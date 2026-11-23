'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Trash2, Check, Music } from 'lucide-react';
import { ALL_CHORDS, CHORD_LIBRARY } from '@/constants/chords';
import { ChordDefinition } from '@/types/strum';

const CATEGORIES = [
  { id: 'Essential', label: 'Essential' },
  { id: 'Major', label: 'Majors' },
  { id: 'Minor', label: 'Minors' },
  { id: '7th', label: '7ths' },
  { id: 'Sus/Add', label: 'Sus / Add' },
  { id: 'All', label: 'All Chords' },
] as const;

const CHORD_GROUPS: Record<string, string[]> = {
  Essential: ['G', 'C', 'D', 'Em', 'Am', 'E', 'A', 'F', 'Dm', 'Bm'],
  Major: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Cadd9', 'Cmaj7', 'Fmaj7', 'Gmaj7'],
  Minor: ['Am', 'Bm', 'Dm', 'Em', 'F#m'],
  '7th': ['A7', 'B7', 'C7', 'D7', 'E7', 'G7', 'Am7', 'Dm7', 'Em7'],
  'Sus/Add': ['Dsus4', 'Dsus2', 'Asus4', 'Asus2', 'Cadd9'],
  All: ALL_CHORDS,
};

interface ChordPickerModalProps {
  isOpen: boolean;
  barIndex: number;
  currentChord: string;
  totalBars: number;
  onSelectChord: (chordName: string) => void;
  onRemoveBar?: () => void;
  onClose: () => void;
  onPreviewSound?: (chordName: string) => void;
}

export const ChordPickerModal: React.FC<ChordPickerModalProps> = ({
  isOpen,
  barIndex,
  currentChord,
  totalBars,
  onSelectChord,
  onRemoveBar,
  onClose,
  onPreviewSound,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Essential');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter chords based on category and optional search query
  const availableChords = (CHORD_GROUPS[selectedCategory] || ALL_CHORDS).filter((ch) => {
    if (!searchQuery.trim()) return true;
    const def = CHORD_LIBRARY[ch];
    const q = searchQuery.toLowerCase();
    return ch.toLowerCase().includes(q) || (def?.displayName && def.displayName.toLowerCase().includes(q));
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
        {/* Soft Dim Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
        />

        {/* Dialog Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 8 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="relative w-full max-w-lg rounded-2xl border border-analog-border bg-analog-surface shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-analog-border/70 bg-analog-bg/40">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-analog-accent/10 border border-analog-accent/30 text-analog-accent flex items-center justify-center shrink-0">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-analog-primary leading-tight">
                  Select Chord for Bar {barIndex + 1}
                </h3>
                <span className="font-mono text-[11px] text-analog-secondary">
                  Current: <strong className="text-analog-primary font-bold">{currentChord}</strong> ({CHORD_LIBRARY[currentChord]?.displayName || currentChord})
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-analog-secondary hover:text-analog-primary hover:bg-analog-elevated transition cursor-pointer"
              title="Close dialog (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Category Tabs & Quick Search */}
          <div className="px-4 sm:px-5 pt-3 pb-2 border-b border-analog-border/50 bg-analog-surface space-y-2.5">
            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-0.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSearchQuery('');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition shrink-0 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-analog-primary text-white shadow-2xs'
                      : 'bg-analog-bg text-analog-secondary hover:text-analog-primary border border-analog-border/70'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quick search filter */}
            <input
              type="text"
              placeholder="Search by chord name (e.g. Cadd9, 7th, Bm)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-analog-bg border border-analog-border text-xs font-sans text-analog-primary placeholder:text-analog-secondary/60 focus:outline-none focus:ring-2 focus:ring-analog-accent"
            />
          </div>

          {/* Scrollable Chords Grid */}
          <div className="p-4 sm:p-5 overflow-y-auto no-scrollbar flex-1 min-h-[180px] max-h-[340px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableChords.map((chordName) => {
                const def: ChordDefinition = CHORD_LIBRARY[chordName] || CHORD_LIBRARY.G;
                const isSelected = currentChord === chordName;

                return (
                  <button
                    key={chordName}
                    type="button"
                    onClick={() => {
                      onSelectChord(chordName);
                      onClose();
                    }}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-analog-accent text-white border-analog-accent shadow-sm ring-2 ring-analog-accent/30 font-bold'
                        : 'bg-analog-bg/70 hover:bg-analog-elevated border-analog-border text-analog-primary hover:border-analog-secondary'
                    }`}
                  >
                    <div className="min-w-0 pr-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-display text-base font-black leading-tight">
                          {chordName}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                      </div>
                      <span className={`font-mono text-[9px] block truncate mt-0.5 ${
                        isSelected ? 'text-white/80' : 'text-analog-secondary'
                      }`}>
                        {def.displayName}
                      </span>
                    </div>

                    {/* Sound preview button */}
                    {onPreviewSound && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewSound(chordName);
                        }}
                        className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition ${
                          isSelected
                            ? 'bg-white/20 hover:bg-white/30 text-white'
                            : 'hover:bg-analog-surface text-analog-secondary hover:text-analog-accent'
                        }`}
                        title="Audition chord sound"
                      >
                        <Volume2 className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {availableChords.length === 0 && (
              <div className="text-center py-8 text-analog-secondary text-xs">
                No chords matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between p-3.5 sm:p-4 border-t border-analog-border/70 bg-analog-bg/40">
            {totalBars > 1 && onRemoveBar ? (
              <button
                type="button"
                onClick={() => {
                  onRemoveBar();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg border border-analog-accent/40 bg-analog-accent/10 hover:bg-analog-accent/20 text-analog-accent font-display text-xs font-bold flex items-center space-x-1 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Bar {barIndex + 1}</span>
              </button>
            ) : (
              <span className="text-[11px] font-sans text-analog-secondary">
                Select a chord voicing to assign
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-analog-border bg-analog-surface hover:bg-analog-elevated text-analog-primary font-display text-xs font-bold transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
