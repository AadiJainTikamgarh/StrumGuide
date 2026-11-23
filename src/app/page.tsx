'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Sidebar, NavigationTab } from '@/components/navigation/Sidebar';
import { ThemeToggleCapsule } from '@/components/analog/ThemeToggleCapsule';
import { PracticeStudio } from '@/components/views/PracticeStudio';
import { PatternLibraryView } from '@/components/views/PatternLibraryView';
import { ChordExplorerView } from '@/components/views/ChordExplorerView';
import { ProgressionBuilderView } from '@/components/views/ProgressionBuilderView';
import { CustomLibraryView } from '@/components/views/CustomLibraryView';
import { ProgressView, PracticeStats } from '@/components/views/ProgressView';
import { SettingsView } from '@/components/views/SettingsView';
import { StrumScheduler, TickEvent } from '@/audio/scheduler';
import { SampleLoader } from '@/audio/SampleLoader';
import { PRESET_PATTERNS, createEmptySlots } from '@/constants/presets';
import { CHORD_LIBRARY, ALL_CHORDS } from '@/constants/chords';
import { playGuitarStrum } from '@/audio/guitarSynth';
import { getAudioContext } from '@/audio/audioContext';
import {
  StrumPattern,
  StrumSlot,
  StrumAction,
  TimeSignature,
  Subdivision,
  AudioSettings,
  SpeedTrainerConfig,
  ChordMode,
} from '@/types/strum';


export default function Home() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('practice');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Pattern and rhythm parameters
  const [pattern, setPattern] = useState<StrumPattern>(PRESET_PATTERNS[0]);
  const [barCount, setBarCount] = useState<number>(1);
  const [bpm, setBpm] = useState<number>(PRESET_PATTERNS[0].suggestedBpm || 90);
  const [chordMode, setChordMode] = useState<ChordMode>('single');
  const [singleChord, setSingleChord] = useState<string>('G');
  const [progression, setProgression] = useState<string[]>(['G', 'Em', 'C', 'D']);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isCountIn, setIsCountIn] = useState<boolean>(false);
  const [countInBeat, setCountInBeat] = useState<number>(1);
  const [countInBeats, setCountInBeats] = useState<3 | 4>(4);
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number>(-1);
  const [currentBarIndex, setCurrentBarIndex] = useState<number>(0);
  const [currentBeat, setCurrentBeat] = useState<number>(1);
  const [currentSubdivision, setCurrentSubdivision] = useState<string>('1');
  const [currentDirection, setCurrentDirection] = useState<'down' | 'up'>('down');
  const [currentAction, setCurrentAction] = useState<StrumAction>('REST');
  const [loopEnabled, setLoopEnabled] = useState<boolean>(true);

  // Audio mix & trainer config
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    masterVolume: 0.85,
    guitarVolume: 0.8,
    isGuitarMuted: false,
    metronomeVolume: 0.6,
    isMetronomeMuted: false,
    countInEnabled: true,
  });

  const [speedTrainer, setSpeedTrainer] = useState<SpeedTrainerConfig>({
    enabled: false,
    startBpm: 75,
    targetBpm: 120,
    incrementBpm: 3,
    incrementEveryBars: 2,
  });

  // Undo / Redo history stack
  const [history, setHistory] = useState<StrumSlot[][]>([PRESET_PATTERNS[0].slots]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Tap tempo state
  const tapTimesRef = useRef<number[]>([]);

  // Scheduler ref
  const schedulerRef = useRef<StrumScheduler | null>(null);

  // Practice session telemetry timer
  const playStartTimeRef = useRef<number | null>(null);

  // Initialize theme from LocalStorage and preload guitar samples
  useEffect(() => {
    // Preload authentic guitar samples in background
    try {
      SampleLoader.getInstance().preloadAll();
    } catch {}

    try {
      const storedTheme = localStorage.getItem('strumguide_theme');
      if (storedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    } catch {}
  }, []);

  const handleToggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    try {
      localStorage.setItem('strumguide_theme', nextDark ? 'dark' : 'light');
    } catch {}
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Effective chord progression depending on Single vs Progression mode
  const effectiveProgression = chordMode === 'single' ? [singleChord] : progression;

  // Active chord for current bar
  const activeChord =
    chordMode === 'single'
      ? singleChord
      : progression[currentBarIndex % progression.length] || 'G';

  // Initialize and synchronize audio scheduler
  useEffect(() => {
    if (!schedulerRef.current) {
      schedulerRef.current = new StrumScheduler(
        pattern,
        effectiveProgression,
        audioSettings,
        speedTrainer,
        bpm
      );

      schedulerRef.current.onTick((event: TickEvent) => {
        setIsCountIn(event.isCountIn);
        setCountInBeat(event.countInBeat);
        setCurrentSlotIndex(event.slotIndex);
        setCurrentBarIndex(event.barIndex);
        setCurrentBeat(event.beatNumber);
        setCurrentSubdivision(event.subdivisionLabel);
        setCurrentDirection(event.direction);

        if (event.slotIndex >= 0 && pattern.slots[event.slotIndex]) {
          setCurrentAction(pattern.slots[event.slotIndex].action);
        } else {
          setCurrentAction('REST');
        }
      });

      schedulerRef.current.onBpmChange((newBpm) => {
        setBpm(newBpm);
      });
    }

    return () => {
      schedulerRef.current?.stop();
    };
  }, []);

  // Sync scheduler whenever state changes
  useEffect(() => {
    if (schedulerRef.current) {
      schedulerRef.current.setPattern(pattern);
      schedulerRef.current.setChordProgression(effectiveProgression);
      schedulerRef.current.setAudioSettings(audioSettings);
      schedulerRef.current.setSpeedTrainer(speedTrainer);
      schedulerRef.current.setBpm(bpm);
      schedulerRef.current.setCountInBeats(countInBeats);
    }
  }, [pattern, effectiveProgression, audioSettings, speedTrainer, bpm, countInBeats]);

  // Record practice session telemetry
  const recordPracticeTelemetry = (durationSec: number) => {
    if (durationSec < 5) return;
    try {
      const stored = localStorage.getItem('strumguide_practice_stats');
      const stats: PracticeStats = stored ? JSON.parse(stored) : {
        totalSeconds: 0,
        sessionCount: 0,
        highestBpm: bpm,
        patternsPracticedCount: 1,
        lastSessionDate: 'Today',
        history: [],
      };

      stats.totalSeconds += durationSec;
      stats.sessionCount += 1;
      stats.highestBpm = Math.max(stats.highestBpm, bpm);
      stats.lastSessionDate = 'Today';
      stats.history = [
        {
          id: `h-${Date.now()}`,
          date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          durationSeconds: durationSec,
          patternName: pattern.name,
          bpm,
        },
        ...stats.history.slice(0, 19),
      ];

      localStorage.setItem('strumguide_practice_stats', JSON.stringify(stats));
    } catch {}
  };

  // Transport actions
  const handleTogglePlay = useCallback(() => {
    if (!schedulerRef.current) return;

    if (isPlaying) {
      schedulerRef.current.stop();
      setIsPlaying(false);
      setIsCountIn(false);
      setCurrentSlotIndex(-1);
      setCurrentAction('REST');

      if (playStartTimeRef.current) {
        const elapsed = Math.round((Date.now() - playStartTimeRef.current) / 1000);
        recordPracticeTelemetry(elapsed);
        playStartTimeRef.current = null;
      }
    } else {
      schedulerRef.current.start();
      setIsPlaying(true);
      playStartTimeRef.current = Date.now();
    }
  }, [isPlaying, bpm, pattern.name]);

  const handleStop = () => {
    if (schedulerRef.current) {
      schedulerRef.current.stop();
    }
    setIsPlaying(false);
    setIsCountIn(false);
    setCurrentSlotIndex(-1);
    setCurrentBarIndex(0);
    setCurrentAction('REST');

    if (playStartTimeRef.current) {
      const elapsed = Math.round((Date.now() - playStartTimeRef.current) / 1000);
      recordPracticeTelemetry(elapsed);
      playStartTimeRef.current = null;
    }
  };

  const handleRestart = () => {
    handleStop();
    setTimeout(() => {
      schedulerRef.current?.start();
      setIsPlaying(true);
      playStartTimeRef.current = Date.now();
    }, 50);
  };

  const handleTapTempo = () => {
    const now = Date.now();
    const tapTimes = tapTimesRef.current;
    if (tapTimes.length > 0 && now - tapTimes[tapTimes.length - 1] > 2000) {
      tapTimes.length = 0;
    }
    tapTimes.push(now);
    if (tapTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < tapTimes.length; i++) {
        intervals.push(tapTimes[i] - tapTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 40 && calculatedBpm <= 240) {
        setBpm(calculatedBpm);
      }
    }
  };

  // Push new slots to history stack for Undo / Redo
  const pushSlotsHistory = (newSlots: StrumSlot[]) => {
    const upToCurrent = history.slice(0, historyIndex + 1);
    const updated = [...upToCurrent, newSlots];
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      const previousSlots = history[nextIndex];
      setPattern((p) => ({ ...p, slots: previousSlots }));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      const nextSlots = history[nextIndex];
      setPattern((p) => ({ ...p, slots: nextSlots }));
    }
  };

  // Slot cycling and editing
  const handleSlotCycleAction = (index: number) => {
    const updated = [...pattern.slots];
    const s = updated[index];
    if (!s) return;

    const primary: StrumAction = s.direction === 'down' ? 'DOWN' : 'UP';
    let next: StrumAction = 'REST';
    if (s.action === 'REST') next = primary;
    else if (s.action === primary) next = 'GHOST';
    else if (s.action === 'GHOST') next = 'MUTE';
    else if (s.action === 'MUTE') next = 'REST';
    else next = primary;

    updated[index] = { ...s, action: next };
    setPattern((p) => ({ ...p, slots: updated }));
    pushSlotsHistory(updated);
  };

  const handleClearPattern = () => {
    const cleared = pattern.slots.map((s) => ({ ...s, action: 'REST' as StrumAction }));
    setPattern((p) => ({ ...p, slots: cleared }));
    pushSlotsHistory(cleared);
  };

  // Time signature and subdivision adjustments
  const handleTimeSignatureChange = (ts: TimeSignature) => {
    const base = createEmptySlots(ts, pattern.subdivision);
    const slots = [...base];
    for (let b = 1; b < barCount; b++) {
      const barSlots = createEmptySlots(ts, pattern.subdivision).map((s, idx) => ({
        ...s,
        id: `slot-b${b}-${idx}`,
      }));
      slots.push(...barSlots);
    }
    const updated: StrumPattern = {
      ...pattern,
      timeSignature: ts,
      slots,
    };
    setPattern(updated);
    pushSlotsHistory(slots);
  };

  const handleSubdivisionChange = (sub: Subdivision) => {
    const base = createEmptySlots(pattern.timeSignature, sub);
    const slots = [...base];
    for (let b = 1; b < barCount; b++) {
      const barSlots = createEmptySlots(pattern.timeSignature, sub).map((s, idx) => ({
        ...s,
        id: `slot-b${b}-${idx}`,
      }));
      slots.push(...barSlots);
    }
    const updated: StrumPattern = {
      ...pattern,
      subdivision: sub,
      slots,
    };
    setPattern(updated);
    pushSlotsHistory(slots);
  };

  const handleBarCountChange = (bars: number) => {
    setBarCount(bars);
    const slotsPerBar = createEmptySlots(pattern.timeSignature, pattern.subdivision);
    const totalSlotsNeeded = slotsPerBar.length * bars;

    let updatedSlots = [...pattern.slots];
    if (updatedSlots.length > totalSlotsNeeded) {
      updatedSlots = updatedSlots.slice(0, totalSlotsNeeded);
    } else {
      while (updatedSlots.length < totalSlotsNeeded) {
        const currentBarIdx = Math.floor(updatedSlots.length / slotsPerBar.length);
        const nextBar = createEmptySlots(pattern.timeSignature, pattern.subdivision).map(
          (s, idx) => ({
            ...s,
            id: `slot-b${currentBarIdx}-${idx}`,
          })
        );
        updatedSlots.push(...nextBar);
      }
    }

    setPattern((p) => ({ ...p, slots: updatedSlots }));
    pushSlotsHistory(updatedSlots);
  };

  // Direct chord audition
  const handleChordSoundPreview = (chordName: string) => {
    try {
      const ctx = getAudioContext();
      const chordDef = CHORD_LIBRARY[chordName] || CHORD_LIBRARY.G;
      playGuitarStrum(ctx, chordDef, 'down', ctx.currentTime, 0.8, ctx.destination);
    } catch {}
  };

  const handleAddChordBar = () => {
    if (progression.length < 8) {
      setProgression((p) => [...p, 'G']);
    }
  };

  const handleRemoveChordBar = (barIndex: number) => {
    if (progression.length > 1) {
      const updated = progression.filter((_, i) => i !== barIndex);
      setProgression(updated);
    }
  };

  const handleSelectSingleChord = (chord: string) => {
    setSingleChord(chord);
    handleChordSoundPreview(chord);
  };

  const handlePrevChord = () => {
    const currentCh = chordMode === 'single' ? singleChord : activeChord;
    const idx = ALL_CHORDS.indexOf(currentCh);
    const prevIdx = (idx - 1 + ALL_CHORDS.length) % ALL_CHORDS.length;
    const nextChord = ALL_CHORDS[prevIdx];
    if (chordMode === 'single') {
      setSingleChord(nextChord);
    } else {
      const updated = [...progression];
      const targetIdx = currentBarIndex % progression.length;
      updated[targetIdx] = nextChord;
      setProgression(updated);
    }
    handleChordSoundPreview(nextChord);
  };

  const handleNextChord = () => {
    const currentCh = chordMode === 'single' ? singleChord : activeChord;
    const idx = ALL_CHORDS.indexOf(currentCh);
    const nextIdx = (idx + 1) % ALL_CHORDS.length;
    const nextChord = ALL_CHORDS[nextIdx];
    if (chordMode === 'single') {
      setSingleChord(nextChord);
    } else {
      const updated = [...progression];
      const targetIdx = currentBarIndex % progression.length;
      updated[targetIdx] = nextChord;
      setProgression(updated);
    }
    handleChordSoundPreview(nextChord);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        handleTapTempo();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const step = e.shiftKey ? 5 : 1;
        setBpm((b) => Math.max(40, b - step));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const step = e.shiftKey ? 5 : 1;
        setBpm((b) => Math.min(240, b + step));
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, historyIndex, history]);

  // Load selected pattern from library into Practice Studio
  const handleLoadPattern = (selected: StrumPattern) => {
    setPattern(selected);
    setBpm(selected.suggestedBpm || 90);
    setBarCount(1);
    setHistory([selected.slots]);
    setHistoryIndex(0);
    setActiveTab('practice');
    handleStop();
  };

  return (
    <div className="min-h-screen bg-analog-bg text-analog-primary font-sans flex flex-col antialiased">
      {/* Fixed Left Sidebar matching the reference design */}
      <Sidebar
        activeTab={activeTab}
        isDarkMode={isDarkMode}
        isPlaying={isPlaying}
        onTabChange={(tab) => setActiveTab(tab)}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Hardware Workspace Area */}
      <div className="flex-1 lg:pl-64 pb-28 sm:pb-24 lg:pb-12 flex flex-col min-w-0">
        {/* Top Header matching reference image: Title + Subtitle + Capsule Theme Toggle */}
        <header className="px-3.5 sm:px-6 md:px-8 pt-3 sm:pt-6 md:pt-7 pb-2.5 sm:pb-4 flex items-center justify-between gap-3 select-none">
          <div className="min-w-0">
            {/* Mobile Header: Brand + Title Pill */}
            <div className="flex items-center space-x-2 lg:hidden mb-1">
              <div
                className="w-6 h-6 rounded-md bg-analog-accent flex items-center justify-center text-white shadow-xs shrink-0"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 35%, 82% 100%, 18% 100%, 0% 35%)',
                }}
              >
                <div className="flex items-center space-x-0.5">
                  <span className="w-0.5 h-1.5 bg-white rounded-full" />
                  <span className="w-0.5 h-2.5 bg-white rounded-full" />
                  <span className="w-0.5 h-1.5 bg-white rounded-full" />
                </div>
              </div>
              <span className="font-display text-sm font-black tracking-tight text-analog-primary">
                StrumGuide
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-analog-accent/10 border border-analog-accent/30 font-display text-[10px] font-bold text-analog-accent uppercase">
                {activeTab}
              </span>
            </div>

            {/* Desktop Section Title */}
            <h2 className="hidden lg:block font-display text-2xl md:text-3xl font-black text-analog-primary tracking-tight truncate">
              {activeTab === 'practice' && 'Practice'}
              {activeTab === 'patterns' && 'Patterns Library'}
              {activeTab === 'chords' && 'Guitar Chords'}
              {activeTab === 'progressions' && 'Chord Progressions'}
              {activeTab === 'library' && 'Custom Patterns'}
              {activeTab === 'settings' && 'Settings'}
            </h2>
            <p className="font-sans italic text-[11px] sm:text-xs md:text-sm text-analog-secondary/90 mt-0.5 truncate">
              Build steady rhythm. Master strumming patterns.
            </p>
          </div>

          {/* Capsule Sun / Moon theme toggle button matching reference UI */}
          <div className="shrink-0">
            <ThemeToggleCapsule
              isDarkMode={isDarkMode}
              onToggleTheme={handleToggleTheme}
            />
          </div>
        </header>

        {/* View Content Port */}
        <main className="flex-1 max-w-6xl w-full px-3.5 sm:px-6 md:px-8 min-w-0">
          {activeTab === 'practice' && (
            <PracticeStudio
              pattern={pattern}
              bpm={bpm}
              barCount={barCount}
              timeSignature={pattern.timeSignature}
              subdivision={pattern.subdivision}
              chordMode={chordMode}
              singleChord={singleChord}
              progression={progression}
              activeChord={activeChord}
              activeBarIndex={currentBarIndex}
              isPlaying={isPlaying}
              isCountIn={isCountIn}
              countInBeat={countInBeat}
              countInBeats={countInBeats}
              currentSlotIndex={currentSlotIndex}
              currentBeat={currentBeat}
              currentSubdivision={currentSubdivision}
              currentDirection={currentDirection}
              currentAction={currentAction}
              loopEnabled={loopEnabled}
              speedTrainer={speedTrainer}
              audioSettings={audioSettings}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              onBpmChange={(newBpm) => setBpm(newBpm)}
              onTapTempo={handleTapTempo}
              onTimeSignatureChange={handleTimeSignatureChange}
              onSubdivisionChange={handleSubdivisionChange}
              onBarCountChange={handleBarCountChange}
              onSlotCycleAction={handleSlotCycleAction}
              onClearPattern={handleClearPattern}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onChordModeChange={(m) => setChordMode(m)}
              onSelectSingleChord={handleSelectSingleChord}
              onPrevChord={handlePrevChord}
              onNextChord={handleNextChord}
              onChordChange={(idx, c) => {
                const next = [...progression];
                next[idx] = c;
                setProgression(next);
                handleChordSoundPreview(c);
              }}
              onRemoveChordBar={handleRemoveChordBar}
              onChordSoundPreview={handleChordSoundPreview}
              onTogglePlay={handleTogglePlay}
              onStop={handleStop}
              onRestart={handleRestart}
              onToggleLoop={() => setLoopEnabled(!loopEnabled)}
              onToggleSpeedTrainer={() =>
                setSpeedTrainer((s) => ({ ...s, enabled: !s.enabled, startBpm: bpm }))
              }
              onAudioSettingsChange={(s) => setAudioSettings(s)}
              onCountInBeatsChange={(b) => setCountInBeats(b)}
              onSelectPattern={handleLoadPattern}
              onAddChordBar={handleAddChordBar}
            />
          )}

          {activeTab === 'patterns' && (
            <PatternLibraryView
              onSelectPattern={handleLoadPattern}
              onPreviewPattern={(p) => {
                handleLoadPattern(p);
                setTimeout(() => handleTogglePlay(), 60);
              }}
            />
          )}

          {activeTab === 'chords' && (
            <ChordExplorerView
              onPlayChordSound={handleChordSoundPreview}
              onSendToProgression={(chord) => {
                if (chordMode === 'single') {
                  setSingleChord(chord);
                } else {
                  setProgression((pr) => [chord, ...pr.slice(1)]);
                }
                setActiveTab('practice');
              }}
            />
          )}

          {activeTab === 'progressions' && (
            <ProgressionBuilderView
              progression={progression}
              activeBarIndex={currentBarIndex}
              isPlaying={isPlaying}
              onProgressionChange={(newP) => setProgression(newP)}
              onPlayChordSound={handleChordSoundPreview}
              onApplyAndPractice={() => setActiveTab('practice')}
            />
          )}

          {activeTab === 'library' && (
            <CustomLibraryView
              onLoadPatternToStudio={handleLoadPattern}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              isDarkMode={isDarkMode}
              countInBeats={countInBeats}
              onToggleTheme={handleToggleTheme}
              onCountInBeatsChange={(b) => setCountInBeats(b)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
