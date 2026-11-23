'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, HelpCircle, Music2, ArrowDown, ArrowUp, Ghost, VolumeX, X } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleTheme }) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <header className="w-full flex items-center justify-between py-4 px-6 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Music2 className="w-6 h-6 text-black stroke-[2.5]" />
          </motion.div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tight text-white">StrumGuide</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                PRO TRAINER
              </span>
            </div>
            <p className="text-xs text-zinc-400">Interactive Guitar Strumming & Rhythm Metronome</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Help / Guide button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHelp(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs font-semibold transition cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">How To Practice</span>
          </motion.button>

          {/* Dark / Light Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </motion.button>
        </div>
      </header>

      {/* How to practice guide modal with Motion AnimatePresence */}
      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHelp(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              className="relative w-full max-w-xl rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-5 text-zinc-300 max-h-[90vh] overflow-y-auto z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center space-x-2">
                  <Music2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">The Golden Rules of Guitar Strumming</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowHelp(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4 text-xs leading-relaxed">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <h4 className="font-bold text-emerald-300 text-sm mb-1">
                    1. The Pendulum Rule (Never Stop Moving Your Hand!)
                  </h4>
                  <p>
                    Your right hand should swing constantly up and down like a clock pendulum:
                    <br />
                    • <strong>Down</strong> on numbered beats (<strong>1, 2, 3, 4</strong>)
                    <br />
                    • <strong>Up</strong> on the offbeats (<strong>&</strong>)
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-2">2. What the 4 Strumming States Mean:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start space-x-2">
                      <ArrowDown className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-emerald-400">Down (↓)</strong>
                        <p className="text-[11px] text-zinc-400">Strike the strings moving downward.</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start space-x-2">
                      <ArrowUp className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-sky-400">Up (↑)</strong>
                        <p className="text-[11px] text-zinc-400">Brush the higher strings moving upward.</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start space-x-2">
                      <Ghost className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-slate-300">Ghost / Air Strum</strong>
                        <p className="text-[11px] text-zinc-400">Move hand in the air without touching strings to maintain rhythm.</p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start space-x-2">
                      <VolumeX className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-orange-400">Mute / Slap (x)</strong>
                        <p className="text-[11px] text-zinc-400">Palm slap or fret-hand percussive chuck.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">3. Practice Routine:</h4>
                  <ol className="list-decimal pl-4 space-y-1 text-zinc-400">
                    <li>Start slow (around 60–75 BPM).</li>
                    <li>First, listen with <strong>Guitar Audio enabled</strong> to hear the groove.</li>
                    <li>Mute the guitar audio and play along using only the <strong>Metronome click</strong>.</li>
                    <li>Enable <strong>Speed Trainer</strong> to build speed by 2-3 BPM automatically.</li>
                  </ol>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowHelp(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition cursor-pointer"
                >
                  Got It, Let&apos;s Strum!
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
