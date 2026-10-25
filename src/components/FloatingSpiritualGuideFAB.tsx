/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { soundManager } from '../utils/audio';

interface FloatingSpiritualGuideFABProps {
  onOpenSpiritualGuide: () => void;
  currentView: string;
}

export const FloatingSpiritualGuideFAB: React.FC<FloatingSpiritualGuideFABProps> = ({
  onOpenSpiritualGuide,
  currentView,
}) => {
  // Hide in intensive games / puzzle views where it might collide with game boards
  if (currentView === 'stage_player' || currentView === 'monastic_puzzle') {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 sm:bottom-24 sm:left-6 z-40 animate-fade-in print:hidden">
      <button
        onClick={() => {
          soundManager.playTick();
          onOpenSpiritualGuide();
        }}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black shadow-2xl shadow-amber-600/40 border-2 border-amber-300 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        title="استشر المرشد الروحي والتأمل الآبائي"
      >
        {/* Glowing aura */}
        <div className="absolute inset-0 rounded-2xl bg-amber-400/30 blur-md group-hover:blur-lg transition-all pointer-events-none" />

        <div className="relative z-10 w-7 h-7 rounded-xl bg-stone-950 text-amber-300 flex items-center justify-center text-base shadow-inner">
          🕊️
        </div>

        <div className="relative z-10 flex flex-col text-right">
          <span className="text-xs font-black tracking-wide text-stone-950 leading-tight">
            المرشد الروحي
          </span>
          <span className="text-[10px] font-bold text-stone-900/80 leading-none">
            اسأل واستنر 💬
          </span>
        </div>
      </button>
    </div>
  );
};
