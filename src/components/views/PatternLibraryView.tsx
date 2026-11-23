'use client';

import React, { useState } from 'react';
import { Play, Pause, Star, ArrowRight, Music2 } from 'lucide-react';
import { StrumPattern } from '@/types/strum';
import { PRESET_PATTERNS } from '@/constants/presets';

interface PatternLibraryViewProps {
  onSelectPattern: (pattern: StrumPattern) => void;
  onPreviewPattern: (pattern: StrumPattern) => void;
}

export const PatternLibraryView: React.FC<PatternLibraryViewProps> = ({
  onSelectPattern,
  onPreviewPattern,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [favorites, setFavorites] = useState<string[]>(['island-strum']);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const categories = ['All', 'Beginner', 'Acoustic', 'Groove', 'Rock'];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const filteredPatterns = PRESET_PATTERNS.filter((p) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Beginner') return p.category === 'Beginner';
    if (selectedCategory === 'Acoustic') return p.category === 'Folk' || p.category === 'Beginner';
    if (selectedCategory === 'Groove') return p.category === 'Funk/R&B';
    if (selectedCategory === 'Rock') return p.category === 'Pop/Rock';
    return true;
  });

  const getNotationDisplay = (p: StrumPattern) => {
    return p.slots
      .slice(0, p.timeSignature === '4/4' ? 8 : 6)
      .map((s) => {
        if (s.action === 'DOWN') return 'D';
        if (s.action === 'UP') return 'U';
        if (s.action === 'MUTE') return 'X';
        return '_';
      })
      .join(' ');
  };

  const handlePlayPreview = (p: StrumPattern, e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewingId === p.id) {
      setPreviewingId(null);
    } else {
      setPreviewingId(p.id);
      onPreviewPattern(p);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header Card */}
      <div className="rounded-2xl border border-analog-border bg-analog-surface p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-analog-accent/10 border border-analog-accent/30 flex items-center justify-center text-analog-accent">
              <Music2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-display text-xl font-black text-analog-primary tracking-tight">
                Patterns Library
              </h2>
              <p className="font-sans text-xs text-analog-secondary mt-0.5">
                Essential rhythm grooves for acoustic & electric guitar.
              </p>
            </div>
          </div>

          {/* Category Filter Pills matching UI image */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-analog-bg border border-analog-border">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-display font-bold transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-analog-accent text-white shadow-2xs'
                    : 'text-analog-secondary hover:text-analog-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pattern List Items matching UI image */}
      <div className="rounded-2xl border border-analog-border bg-analog-surface overflow-hidden shadow-xs divide-y divide-analog-border/50">
        {filteredPatterns.map((pattern) => {
          const isFav = favorites.includes(pattern.id);
          const isPlayingThis = previewingId === pattern.id;
          const notation = getNotationDisplay(pattern);

          return (
            <div
              key={pattern.id}
              onClick={() => onSelectPattern(pattern)}
              className="p-4 px-6 flex items-center justify-between hover:bg-analog-elevated/40 transition cursor-pointer group"
            >
              {/* Play Button & Title */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={(e) => handlePlayPreview(pattern, e)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition shadow-2xs cursor-pointer ${
                    isPlayingThis
                      ? 'bg-analog-accent text-white'
                      : 'bg-analog-bg border border-analog-border text-analog-primary group-hover:border-analog-accent'
                  }`}
                  title="Audition rhythm"
                >
                  {isPlayingThis ? (
                    <Pause className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  )}
                </button>

                <div>
                  <h3 className="font-display text-sm font-bold text-analog-primary group-hover:text-analog-accent transition">
                    {pattern.name}
                  </h3>
                  <div className="font-mono text-xs font-semibold text-analog-secondary mt-0.5 tracking-wider">
                    {notation}
                  </div>
                </div>
              </div>

              {/* Metadata & Actions */}
              <div className="flex items-center space-x-4">
                <span className="font-mono text-xs text-analog-secondary">
                  {pattern.subdivision} · {pattern.timeSignature}
                </span>

                <button
                  onClick={(e) => toggleFavorite(pattern.id, e)}
                  className="p-1 text-analog-secondary hover:text-analog-accent transition cursor-pointer"
                  title="Favorite"
                >
                  <Star
                    className={`w-4 h-4 ${
                      isFav ? 'fill-analog-accent text-analog-accent' : ''
                    }`}
                  />
                </button>

                <div className="hidden sm:flex items-center text-xs font-display font-bold text-analog-accent group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
