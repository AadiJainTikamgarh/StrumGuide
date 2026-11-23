'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Plus, Trash2 } from 'lucide-react';
import { StrumPattern } from '@/types/strum';
import { PRESET_PATTERNS } from '@/constants/presets';

interface PresetManagerProps {
  currentPattern: StrumPattern;
  onSelectPattern: (pattern: StrumPattern) => void;
  onSaveCurrentPattern: (name: string) => void;
}

export const PresetManager: React.FC<PresetManagerProps> = ({
  currentPattern,
  onSelectPattern,
}) => {
  const [savedPatterns, setSavedPatterns] = useState<StrumPattern[]>([]);
  const [newPatternName, setNewPatternName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load custom patterns from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('strumguide_saved_patterns');
      if (stored) {
        setSavedPatterns(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatternName.trim()) return;

    const patternToSave: StrumPattern = {
      ...currentPattern,
      id: `custom-${Date.now()}`,
      name: newPatternName.trim(),
      description: 'Custom created pattern',
      category: 'Custom',
    };

    const updated = [patternToSave, ...savedPatterns];
    setSavedPatterns(updated);
    try {
      localStorage.setItem('strumguide_saved_patterns', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setNewPatternName('');
    setIsSaving(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedPatterns.filter((p) => p.id !== id);
    setSavedPatterns(updated);
    try {
      localStorage.setItem('strumguide_saved_patterns', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full rounded-2xl bg-zinc-900/90 dark:bg-zinc-950/90 border border-zinc-800 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-zinc-800/80 mb-5 gap-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Preset Library & Saved Patterns
          </h3>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSaving(!isSaving)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Save Current Pattern</span>
        </motion.button>
      </div>

      {/* Save Input Drawer with AnimatePresence */}
      <AnimatePresence>
        {isSaving && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{ overflow: 'hidden' }}
            onSubmit={handleSave}
            className="mb-6 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 flex flex-wrap items-center gap-3"
          >
            <input
              type="text"
              placeholder="Pattern Name (e.g. My Acoustic Groove)..."
              value={newPatternName}
              onChange={(e) => setNewPatternName(e.target.value)}
              className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white text-xs focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition cursor-pointer"
            >
              Save to Library
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsSaving(false)}
              className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-400 font-bold text-xs hover:text-white transition cursor-pointer"
            >
              Cancel
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Presets Grid */}
      <div className="space-y-4">
        {/* Built-in Presets */}
        <div>
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2.5">
            Essential Guitar Patterns
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESET_PATTERNS.map((preset) => {
              const isSelected = currentPattern.id === preset.id;
              return (
                <motion.div
                  key={preset.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                  onClick={() => onSelectPattern(preset)}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500/70 shadow-lg shadow-emerald-500/20'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-950'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{preset.name}</h4>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {preset.timeSignature} • {preset.subdivision} • {preset.suggestedBpm} BPM
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {preset.category}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{preset.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* User Saved Patterns */}
        {savedPatterns.length > 0 && (
          <div className="pt-3 border-t border-zinc-800/80">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2.5">
              Your Custom Patterns
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedPatterns.map((pattern) => {
                const isSelected = currentPattern.id === pattern.id;
                return (
                  <motion.div
                    key={pattern.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectPattern(pattern)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/15 border-indigo-500/70 shadow-lg shadow-indigo-500/20'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{pattern.name}</h4>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {pattern.timeSignature} • {pattern.subdivision}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleDelete(pattern.id, e)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                      title="Delete pattern"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
