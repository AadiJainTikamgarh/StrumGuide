'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, Save, Library } from 'lucide-react';
import { StrumPattern, StrumSlot, StrumAction, TimeSignature, Subdivision } from '@/types/strum';
import { createEmptySlots } from '@/constants/presets';
import { TactileRhythmKey } from '@/components/analog/TactileRhythmKey';

interface CustomLibraryViewProps {
  onLoadPatternToStudio: (pattern: StrumPattern) => void;
}

export const CustomLibraryView: React.FC<CustomLibraryViewProps> = ({
  onLoadPatternToStudio,
}) => {
  const [savedPatterns, setSavedPatterns] = useState<StrumPattern[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // New pattern form state
  const [name, setName] = useState('');
  const [timeSignature, setTimeSignature] = useState<TimeSignature>('4/4');
  const [subdivision, setSubdivision] = useState<Subdivision>('8th');
  const [slots, setSlots] = useState<StrumSlot[]>(createEmptySlots('4/4', '8th'));

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('strumguide_saved_patterns');
      if (stored) {
        setSavedPatterns(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const handleTimeSignatureChange = (ts: TimeSignature) => {
    setTimeSignature(ts);
    setSlots(createEmptySlots(ts, subdivision));
  };

  const handleSubdivisionChange = (sub: Subdivision) => {
    setSubdivision(sub);
    setSlots(createEmptySlots(timeSignature, sub));
  };

  const handleCycleSlot = (index: number) => {
    const updated = [...slots];
    const s = updated[index];
    const primary: StrumAction = s.direction === 'down' ? 'DOWN' : 'UP';

    let next: StrumAction = 'REST';
    if (s.action === 'REST') next = primary;
    else if (s.action === primary) next = 'GHOST';
    else if (s.action === 'GHOST') next = 'MUTE';
    else if (s.action === 'MUTE') next = 'REST';
    else next = primary;

    updated[index] = { ...s, action: next };
    setSlots(updated);
  };

  const handleSavePattern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPattern: StrumPattern = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: 'User constructed custom strum pattern',
      category: 'Custom',
      timeSignature,
      subdivision,
      slots,
      suggestedBpm: 90,
    };

    const nextList = [newPattern, ...savedPatterns];
    setSavedPatterns(nextList);
    try {
      localStorage.setItem('strumguide_saved_patterns', JSON.stringify(nextList));
    } catch {}

    setName('');
    setIsCreating(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextList = savedPatterns.filter((p) => p.id !== id);
    setSavedPatterns(nextList);
    try {
      localStorage.setItem('strumguide_saved_patterns', JSON.stringify(nextList));
    } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-analog-border bg-analog-surface p-6 shadow-tactile">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-strum-up font-display text-[10px] font-bold uppercase tracking-widest mb-1">
              <Library className="w-3.5 h-3.5" />
              <span>User Archive & Sequencer</span>
            </div>
            <h2 className="font-display text-2xl font-black text-analog-primary tracking-tight">
              Custom Pattern Editor & Library
            </h2>
            <p className="font-sans text-xs text-analog-secondary mt-1 max-w-xl">
              Design bespoke strum patterns from scratch with custom subdivision arrangements and save them locally for offline practice.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2.5 rounded bg-analog-accent text-white font-display text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 shadow-sm hover:opacity-95 transition cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{isCreating ? 'CLOSE DESIGNER' : 'NEW CUSTOM PATTERN'}</span>
          </button>
        </div>
      </div>

      {/* Pattern Creation Canvas */}
      {isCreating && (
        <form
          onSubmit={handleSavePattern}
          className="rounded-lg border border-analog-accent/40 bg-analog-surface p-6 shadow-tactile space-y-5"
        >
          <div className="flex items-center justify-between border-b border-analog-border pb-3">
            <span className="font-display text-sm font-bold uppercase tracking-wider text-analog-primary">
              Pattern Constructor
            </span>

            <div className="flex items-center space-x-3">
              {/* Meters */}
              <div className="flex items-center rounded border border-analog-border bg-analog-bg p-0.5 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => handleTimeSignatureChange('4/4')}
                  className={`px-2 py-0.5 rounded-xs font-bold ${
                    timeSignature === '4/4' ? 'bg-analog-primary text-analog-bg' : 'text-analog-secondary'
                  }`}
                >
                  4/4
                </button>
                <button
                  type="button"
                  onClick={() => handleTimeSignatureChange('3/4')}
                  className={`px-2 py-0.5 rounded-xs font-bold ${
                    timeSignature === '3/4' ? 'bg-analog-primary text-analog-bg' : 'text-analog-secondary'
                  }`}
                >
                  3/4
                </button>
              </div>

              {/* Subdivisions */}
              <div className="flex items-center rounded border border-analog-border bg-analog-bg p-0.5 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => handleSubdivisionChange('8th')}
                  className={`px-2 py-0.5 rounded-xs font-bold ${
                    subdivision === '8th' ? 'bg-strum-up text-white' : 'text-analog-secondary'
                  }`}
                >
                  8th
                </button>
                <button
                  type="button"
                  onClick={() => handleSubdivisionChange('16th')}
                  className={`px-2 py-0.5 rounded-xs font-bold ${
                    subdivision === '16th' ? 'bg-strum-up text-white' : 'text-analog-secondary'
                  }`}
                >
                  16th
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              placeholder="Pattern Name (e.g. Syncopated Bossa Groove)..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-3 py-2 rounded bg-analog-bg border border-analog-border text-xs font-sans text-analog-primary focus:outline-none focus:ring-1 focus:ring-analog-accent"
              required
            />

            <button
              type="submit"
              className="px-4 py-2 rounded bg-analog-primary text-analog-bg font-display text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm hover:opacity-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>SAVE TO ARCHIVE</span>
            </button>
          </div>

          {/* Interactive slots strip */}
          <div className="pt-2">
            <span className="font-mono text-[10px] text-analog-secondary block mb-2">
              CLICK KEYCAPS TO ARRANGE DOWN / UP / GHOST / MUTE / REST:
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {slots.map((s, idx) => (
                <TactileRhythmKey
                  key={s.id}
                  slot={s}
                  index={idx}
                  isActive={false}
                  onCycleAction={handleCycleSlot}
                  onSetAction={() => {}}
                />
              ))}
            </div>
          </div>
        </form>
      )}

      {/* Saved Patterns Grid */}
      <div className="rounded-lg border border-analog-border bg-analog-surface p-6 shadow-tactile space-y-4">
        <div className="flex items-center justify-between border-b border-analog-border pb-3">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-analog-primary">
            Saved Custom Patterns ({savedPatterns.length})
          </span>
          <span className="font-mono text-[10px] text-analog-secondary">LOCAL STORAGE PERSISTED</span>
        </div>

        {savedPatterns.length === 0 ? (
          <div className="py-12 text-center text-analog-secondary font-mono text-xs">
            No custom patterns created yet. Click &quot;New Custom Pattern&quot; above to assemble your first rhythm.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPatterns.map((pat) => (
              <div
                key={pat.id}
                className="p-4 rounded-md border border-analog-border bg-analog-bg/60 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold text-analog-primary">
                      {pat.name}
                    </h4>
                    <span className="font-mono text-[10px] text-analog-secondary">
                      {pat.timeSignature} • {pat.subdivision}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleDelete(pat.id, e)}
                    className="p-1.5 rounded hover:bg-analog-border text-analog-secondary hover:text-analog-accent transition cursor-pointer"
                    title="Delete pattern"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => onLoadPatternToStudio(pat)}
                  className="w-full mt-2 py-1.5 rounded bg-analog-surface border border-analog-border hover:border-analog-primary text-analog-primary font-display text-[10px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer transition"
                >
                  <span>LOAD INTO STUDIO</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
