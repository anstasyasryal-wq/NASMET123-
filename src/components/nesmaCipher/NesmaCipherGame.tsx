import React, { useState } from 'react';
import { CipherMap } from './CipherMap';
import { CipherLevelPlay } from './CipherLevelPlay';
import { NesmaCipherJournal } from './NesmaCipherJournal';
import { NesmaCipherStage } from '../../types/nesmaCipher';
import { getStageById } from '../../data/nesmaCipherData';

interface NesmaCipherGameProps {
  onBackToHome?: () => void;
}

export const NesmaCipherGame: React.FC<NesmaCipherGameProps> = ({ onBackToHome }) => {
  const [currentView, setCurrentView] = useState<'map' | 'play'>('map');
  const [activeStage, setActiveStage] = useState<NesmaCipherStage | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);

  const handleSelectStage = (stage: NesmaCipherStage) => {
    setActiveStage(stage);
    setCurrentView('play');
  };

  const handleBackToMap = () => {
    setCurrentView('map');
    setActiveStage(null);
  };

  const handleNextStage = (nextStageId: number) => {
    const next = getStageById(nextStageId);
    if (next) {
      setActiveStage(next);
      setCurrentView('play');
    } else {
      setCurrentView('map');
      setActiveStage(null);
    }
  };

  return (
    <div className="min-h-screen py-6 px-3 sm:px-6">
      {currentView === 'map' && (
        <CipherMap
          onSelectStage={handleSelectStage}
          onOpenJournal={() => setIsJournalOpen(true)}
          onBackToHome={onBackToHome}
        />
      )}

      {currentView === 'play' && activeStage && (
        <CipherLevelPlay
          stage={activeStage}
          onBackToMap={handleBackToMap}
          onNextStage={handleNextStage}
          onOpenJournal={() => setIsJournalOpen(true)}
        />
      )}

      {/* Psychological Quotes Journal Modal */}
      <NesmaCipherJournal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
      />
    </div>
  );
};
