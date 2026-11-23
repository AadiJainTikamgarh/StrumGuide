'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Activity, Zap, Music2, RotateCcw } from 'lucide-react';

export interface PracticeStats {
  totalSeconds: number;
  sessionCount: number;
  highestBpm: number;
  patternsPracticedCount: number;
  lastSessionDate: string;
  history: {
    id: string;
    date: string;
    durationSeconds: number;
    patternName: string;
    bpm: number;
  }[];
}

const DEFAULT_STATS: PracticeStats = {
  totalSeconds: 1420, // ~23 mins initial mock/historical
  sessionCount: 6,
  highestBpm: 125,
  patternsPracticedCount: 4,
  lastSessionDate: 'Today',
  history: [
    {
      id: 'h-1',
      date: 'Today, 23:45',
      durationSeconds: 480,
      patternName: 'The Island Strum',
      bpm: 96,
    },
    {
      id: 'h-2',
      date: 'Yesterday, 19:15',
      durationSeconds: 620,
      patternName: 'Classic Folk / Country 3/4',
      bpm: 110,
    },
    {
      id: 'h-3',
      date: 'Nov 22, 14:30',
      durationSeconds: 320,
      patternName: 'Pop-Rock with Chuck/Mute',
      bpm: 125,
    },
  ],
};

export const ProgressView: React.FC = () => {
  const [stats, setStats] = useState<PracticeStats>(DEFAULT_STATS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('strumguide_practice_stats');
      if (stored) {
        setStats(JSON.parse(stored));
      } else {
        localStorage.setItem('strumguide_practice_stats', JSON.stringify(DEFAULT_STATS));
      }
    } catch {}
  }, []);

  const formatDuration = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const handleResetHistory = () => {
    if (confirm('Reset practice telemetry log?')) {
      const fresh: PracticeStats = {
        totalSeconds: 0,
        sessionCount: 0,
        highestBpm: 40,
        patternsPracticedCount: 0,
        lastSessionDate: 'None',
        history: [],
      };
      setStats(fresh);
      try {
        localStorage.setItem('strumguide_practice_stats', JSON.stringify(fresh));
      } catch {}
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-analog-border bg-analog-surface p-6 shadow-tactile">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-analog-olive font-display text-[10px] font-bold uppercase tracking-widest mb-1">
              <Activity className="w-3.5 h-3.5" />
              <span>Practice Telemetry</span>
            </div>
            <h2 className="font-display text-2xl font-black text-analog-primary tracking-tight">
              Rhythm Discipline Log
            </h2>
            <p className="font-sans text-xs text-analog-secondary mt-1 max-w-xl">
              Understated metrics tracking physical instrument time behind the metronome. Every minute spent internalizing steady pendulum motion compounds.
            </p>
          </div>

          <button
            onClick={handleResetHistory}
            className="px-3 py-1.5 rounded border border-analog-border bg-analog-bg text-analog-secondary hover:text-analog-primary font-mono text-[10px] font-bold flex items-center space-x-1 cursor-pointer transition self-start md:self-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET LOG</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Time */}
        <div className="p-4 rounded-lg border border-analog-border bg-analog-surface shadow-tactile flex flex-col justify-between">
          <div className="flex items-center justify-between text-analog-secondary mb-2">
            <span className="font-display text-[10px] font-bold uppercase tracking-wider">
              Total Practice Time
            </span>
            <Clock className="w-4 h-4 text-strum-down" />
          </div>
          <span className="font-mono text-2xl font-bold text-analog-primary">
            {formatDuration(stats.totalSeconds)}
          </span>
          <span className="font-mono text-[9px] text-analog-secondary mt-1">
            Last session: {stats.lastSessionDate}
          </span>
        </div>

        {/* Sessions Count */}
        <div className="p-4 rounded-lg border border-analog-border bg-analog-surface shadow-tactile flex flex-col justify-between">
          <div className="flex items-center justify-between text-analog-secondary mb-2">
            <span className="font-display text-[10px] font-bold uppercase tracking-wider">
              Practice Sessions
            </span>
            <Activity className="w-4 h-4 text-analog-accent" />
          </div>
          <span className="font-mono text-2xl font-bold text-analog-primary">
            {stats.sessionCount}
          </span>
          <span className="font-mono text-[9px] text-analog-secondary mt-1">
            Dedicated metronome workouts
          </span>
        </div>

        {/* Highest BPM */}
        <div className="p-4 rounded-lg border border-analog-border bg-analog-surface shadow-tactile flex flex-col justify-between">
          <div className="flex items-center justify-between text-analog-secondary mb-2">
            <span className="font-display text-[10px] font-bold uppercase tracking-wider">
              Max Calibrated BPM
            </span>
            <Zap className="w-4 h-4 text-strum-mute" />
          </div>
          <span className="font-mono text-2xl font-bold text-analog-primary">
            {stats.highestBpm} <span className="text-xs font-normal">BPM</span>
          </span>
          <span className="font-mono text-[9px] text-analog-secondary mt-1">
            Highest steady tempo sustained
          </span>
        </div>

        {/* Patterns Practiced */}
        <div className="p-4 rounded-lg border border-analog-border bg-analog-surface shadow-tactile flex flex-col justify-between">
          <div className="flex items-center justify-between text-analog-secondary mb-2">
            <span className="font-display text-[10px] font-bold uppercase tracking-wider">
              Patterns Mastered
            </span>
            <Music2 className="w-4 h-4 text-strum-up" />
          </div>
          <span className="font-mono text-2xl font-bold text-analog-primary">
            {stats.patternsPracticedCount}
          </span>
          <span className="font-mono text-[9px] text-analog-secondary mt-1">
            Repertoire distinct grooves
          </span>
        </div>
      </div>

      {/* History Log Table */}
      <div className="rounded-lg border border-analog-border bg-analog-surface p-6 shadow-tactile space-y-4">
        <div className="flex items-center justify-between border-b border-analog-border pb-3">
          <span className="font-display text-xs font-bold uppercase tracking-wider text-analog-primary">
            Recent Practice Activity Log
          </span>
          <span className="font-mono text-[10px] text-analog-secondary">CHRONOLOGICAL RECORD</span>
        </div>

        {stats.history.length === 0 ? (
          <div className="py-8 text-center text-analog-secondary font-mono text-xs">
            No logged sessions yet. Start the metronome in the Practice Studio to begin tracking.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-analog-border text-[10px] text-analog-secondary uppercase">
                  <th className="py-2.5 px-3">Date / Timestamp</th>
                  <th className="py-2.5 px-3">Pattern</th>
                  <th className="py-2.5 px-3">Tempo (BPM)</th>
                  <th className="py-2.5 px-3 text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-analog-border/50">
                {stats.history.map((row) => (
                  <tr key={row.id} className="hover:bg-analog-elevated/40 transition">
                    <td className="py-3 px-3 text-analog-secondary">{row.date}</td>
                    <td className="py-3 px-3 font-bold text-analog-primary">{row.patternName}</td>
                    <td className="py-3 px-3 text-analog-accent font-bold">{row.bpm} BPM</td>
                    <td className="py-3 px-3 text-right text-analog-primary font-bold">
                      {formatDuration(row.durationSeconds)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
