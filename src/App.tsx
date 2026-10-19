/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, AppView, Stage, Announcement } from './types';
import {
  getCurrentUser,
  setCurrentUser as persistCurrentUser,
  getStoredStages,
  getStoredAnnouncements,
  saveStages,
  saveAnnouncements,
} from './utils/competitionEngine';
import {
  seedCloudDatabaseIfEmpty,
  subscribeToCloudStages,
  subscribeToCloudAnnouncements,
  syncUserToCloud,
} from './utils/firebaseService';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { StagePlayer } from './components/StagePlayer';
import { LeaderboardView } from './components/LeaderboardView';
import { SupervisorDashboard } from './components/SupervisorDashboard';
import { FinalCeremonyView } from './components/FinalCeremonyView';
import { ParticipantsListView } from './components/ParticipantsListView';
import { CompetitionsHubView } from './components/CompetitionsHubView';
import { RegistrationModal } from './components/RegistrationModal';
import { RulesModal } from './components/RulesModal';
import { SpiritualGuideModal } from './components/SpiritualGuideModal';
import { SpiritualLifeView } from './components/SpiritualLifeView';
import { BiblicalStudyView } from './components/BiblicalStudyView';
import { PersonalSpaceView } from './components/PersonalSpaceView';
import { LibraryView } from './components/LibraryView';
import { WorkshopsView } from './components/WorkshopsView';
import { CreativeLab } from './components/CreativeLab';
import { StudyToolsView } from './components/StudyToolsView';
import { MonasticOasis } from './components/MonasticOasis';
import { SpiritualGamesHub } from './components/SpiritualGamesHub';
import { CollectiveChallengesView } from './components/CollectiveChallengesView';
import { SpiritualCalendarView } from './components/SpiritualCalendarView';
import { SpiritualFatherCompanion } from './components/SpiritualFatherCompanion';
import { ConsecratedManualReference } from './components/ConsecratedManualReference';
import { DailyPrayerFortress } from './components/DailyPrayerFortress';
import { VirtueJarComponent } from './components/VirtueJarComponent';
import { ReadingThemeProvider, useReadingTheme } from './context/ReadingThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { EmergencyRescueModal } from './components/EmergencyRescueModal';
import { HeavenlyMessageModal } from './components/HeavenlyMessageModal';
import { SpiritualJournal } from './components/SpiritualJournal';
import { IconGalleryModal } from './components/IconGalleryModal';
import { ChurchFathersAndSaintsGallery } from './components/ChurchFathersAndSaintsGallery';
import { SaintsStickersModal } from './components/SaintsStickersModal';
import { DailySaintAlertBanner } from './components/DailySaintAlertBanner';
import { HymnsAudioProvider } from './context/HymnsAudioContext';
import { SpiritualHymnsPlayer } from './components/SpiritualHymnsPlayer';
import AppInstallManager from './components/AppInstallManager';

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('mokarasa_current_view') as AppView;
      if (saved) return saved;
    }
    return 'home';
  });
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [activeStageId, setActiveStageId] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('mokarasa_active_stage_id');
      if (saved) return parseInt(saved) || 1;
    }
    return 1;
  });
  const [stages, setStages] = useState<Stage[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Modals
  const [showRegistrationModal, setShowRegistrationModal] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [showSpiritualGuideModal, setShowSpiritualGuideModal] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [showHeavenlyMessageModal, setShowHeavenlyMessageModal] = useState<boolean>(false);
  const [showSpiritualJournal, setShowSpiritualJournal] = useState<boolean>(false);
  const [showIconGallery, setShowIconGallery] = useState<boolean>(false);
  const [showSaintsGallery, setShowSaintsGallery] = useState<boolean>(false);
  const [showSaintsStickersModal, setShowSaintsStickersModal] = useState<boolean>(false);
  const [emergencySituation, setEmergencySituation] = useState<'distress' | 'boredom' | 'lukewarmness' | 'anger'>('distress');

  const { getContainerClass } = useReadingTheme();

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUserState(user);
    setStages(getStoredStages());
    setAnnouncements(getStoredAnnouncements());
  }, []);

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mokarasa_current_view', view);
    }
  };

  const handleSetActiveStage = (stageId: number) => {
    setActiveStageId(stageId);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mokarasa_active_stage_id', String(stageId));
    }
  };

  const handleUserUpdated = (user: User) => {
    setCurrentUserState(user);
    persistCurrentUser(user);
    setStages(getStoredStages());
  };

  const handleStartStage = (stageId: number) => {
    if (!currentUser) {
      handleSetActiveStage(stageId);
      setShowRegistrationModal(true);
      return;
    }
    handleSetActiveStage(stageId);
    handleNavigate('stage_player');
  };

  const handleFinishStage = (nextStageId?: number) => {
    const updated = getCurrentUser();
    if (updated) setCurrentUserState(updated);

    if (nextStageId && nextStageId <= 6) {
      handleSetActiveStage(nextStageId);
      handleNavigate('stage_player');
    } else if (nextStageId === 7 || nextStageId === undefined) {
      handleNavigate('final_ceremony');
    } else {
      handleNavigate('leaderboard');
    }
  };

  const handleOpenEmergency = (sit: 'distress' | 'boredom' | 'lukewarmness' | 'anger' = 'distress') => {
    setEmergencySituation(sit);
    setShowEmergencyModal(true);
  };

  return (
    <div className={`min-h-screen ${getContainerClass()} font-sans selection:bg-amber-200 selection:text-amber-900 flex flex-col justify-between`}>
      <div>
        {/* Navigation Header */}
        <Header
          currentView={currentView}
          currentUser={currentUser}
          onNavigate={(view) => handleNavigate(view)}
          onOpenLogin={() => setShowRegistrationModal(true)}
          onOpenRules={() => setShowRulesModal(true)}
          onOpenSpiritualGuide={() => setShowSpiritualGuideModal(true)}
          onOpenHeavenlyMessage={() => setShowHeavenlyMessageModal(true)}
          onOpenSaintsStickers={() => setShowSaintsStickersModal(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          {/* Daily Saint & Virtue Alert Banner (Persistent across app views) */}
          {currentView !== 'stage_player' && (
            <div className="mb-6">
              <DailySaintAlertBanner
                onOpenFullModal={() => setShowSaintsStickersModal(true)}
              />
            </div>
          )}

          {currentView === 'home' && (
            <HomeView
              currentUser={currentUser}
              stages={stages}
              announcements={announcements}
              onStartStage={handleStartStage}
              onOpenLogin={() => setShowRegistrationModal(true)}
              onOpenMyRank={() => handleNavigate('leaderboard')}
              onOpenRules={() => setShowRulesModal(true)}
              onNavigateToLeaderboard={() => handleNavigate('leaderboard')}
              onNavigateToDioceses={() => handleNavigate('dioceses')}
              onNavigateToSupervisor={() => handleNavigate('supervisor')}
              onNavigateToParticipants={() => handleNavigate('participants')}
              onNavigateToCompetitions={() => handleNavigate('competitions_hub')}
              onOpenSpiritualGuide={() => setShowSpiritualGuideModal(true)}
              onNavigateToSpiritualLife={() => handleNavigate('spiritual_life')}
              onNavigateToBiblicalStudy={() => handleNavigate('biblical_study')}
              onNavigateToPersonalSpace={() => handleNavigate('personal_space')}
              onNavigateToLibrary={() => handleNavigate('library')}
              onNavigateToWorkshops={() => handleNavigate('workshops')}
              onNavigateToCreativeLab={() => handleNavigate('creative_lab')}
              onNavigateToStudyTools={() => handleNavigate('study_tools')}
              onNavigateToMonasticOasis={() => handleNavigate('monastic_oasis')}
              onOpenEmergencyModal={handleOpenEmergency}
              onNavigateToSpiritualGames={() => handleNavigate('spiritual_games')}
              onOpenHeavenlyMessage={() => setShowHeavenlyMessageModal(true)}
              onOpenSpiritualJournal={() => setShowSpiritualJournal(true)}
              onOpenIconGallery={() => setShowIconGallery(true)}
              onOpenSaintsGallery={() => setShowSaintsGallery(true)}
              onNavigateToSpiritualFather={() => handleNavigate('spiritual_father')}
              onNavigateToConsecratedManual={() => handleNavigate('consecrated_manual')}
              onOpenSaintsStickers={() => setShowSaintsStickersModal(true)}
              onNavigateToPrayerFortress={() => handleNavigate('prayer_fortress')}
            />
          )}

          {currentView === 'stage_player' && currentUser && (
            <StagePlayer
              key={`stage-${activeStageId}`}
              stageId={activeStageId}
              currentUser={currentUser}
              onFinishStage={handleFinishStage}
              onBackToHome={() => handleNavigate('home')}
              onOpenLeaderboard={() => handleNavigate('leaderboard')}
            />
          )}

          {currentView === 'competitions_hub' && (
            <CompetitionsHubView
              onStartStage={handleStartStage}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'leaderboard' && (
            <LeaderboardView
              currentUser={currentUser}
              onOpenRegister={() => setShowRegistrationModal(true)}
              onStartStage={handleStartStage}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'dioceses' && (
            <LeaderboardView
              currentUser={currentUser}
              onOpenRegister={() => setShowRegistrationModal(true)}
              onStartStage={handleStartStage}
              onBackToHome={() => handleNavigate('home')}
              initialTab="dioceses"
            />
          )}

          {currentView === 'spiritual_life' && (
            <SpiritualLifeView
              currentUser={currentUser}
              onOpenLogin={() => setShowRegistrationModal(true)}
              onOpenSpiritualGuide={() => setShowSpiritualGuideModal(true)}
              onBackToHome={() => handleNavigate('home')}
              onNavigateToPrayerFortress={() => handleNavigate('prayer_fortress')}
            />
          )}

          {currentView === 'biblical_study' && (
            <BiblicalStudyView
              currentUser={currentUser}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'personal_space' && (
            <PersonalSpaceView
              currentUser={currentUser}
              onOpenLogin={() => setShowRegistrationModal(true)}
              onBackToHome={() => handleNavigate('home')}
              onOpenHeavenlyMessage={() => setShowHeavenlyMessageModal(true)}
              onOpenSpiritualJournal={() => setShowSpiritualJournal(true)}
            />
          )}

          {currentView === 'library' && (
            <LibraryView
              currentUser={currentUser}
              onOpenLogin={() => setShowRegistrationModal(true)}
              onBackToHome={() => handleNavigate('home')}
              onOpenIconGallery={() => setShowIconGallery(true)}
              onOpenSaintsGallery={() => setShowSaintsGallery(true)}
            />
          )}

          {currentView === 'workshops' && (
            <WorkshopsView
              currentUser={currentUser}
              onOpenLogin={() => setShowRegistrationModal(true)}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'creative_lab' && (
            <CreativeLab
              currentUser={currentUser}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'study_tools' && (
            <StudyToolsView
              currentUser={currentUser}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'monastic_oasis' && (
            <MonasticOasis
              currentUser={currentUser}
              onBackToHome={() => handleNavigate('home')}
              onNavigateToManual={() => handleNavigate('consecrated_manual')}
            />
          )}

          {currentView === 'spiritual_games' && (
            <SpiritualGamesHub
              currentUser={currentUser}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'participants' && (
            <ParticipantsListView
              onOpenRegister={() => setShowRegistrationModal(true)}
              onStartStage={handleStartStage}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'supervisor' && (
            <SupervisorDashboard
              onBackToHome={() => handleNavigate('home')}
              onTestStageAsAdmin={(stgId) => {
                handleSetActiveStage(stgId);
                handleNavigate('stage_player');
              }}
            />
          )}

          {currentView === 'final_ceremony' && (
            <FinalCeremonyView
              onBackToHome={() => handleNavigate('home')}
              onOpenLeaderboard={() => handleNavigate('leaderboard')}
            />
          )}

          {currentView === 'collective_challenges' && (
            <CollectiveChallengesView
              currentUser={currentUser}
              onOpenLogin={() => setShowRegistrationModal(true)}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'spiritual_calendar' && (
            <SpiritualCalendarView
              currentUser={currentUser}
              onOpenLogin={() => setShowRegistrationModal(true)}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'spiritual_father' && (
            <SpiritualFatherCompanion
              currentUser={currentUser}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'consecrated_manual' && (
            <ConsecratedManualReference
              currentUser={currentUser}
              onBackToHome={() => handleNavigate('home')}
              onNavigateToOasis={() => handleNavigate('monastic_oasis')}
              onNavigateToSpiritualFather={() => handleNavigate('spiritual_father')}
              onNavigateToPrayerFortress={() => handleNavigate('prayer_fortress')}
            />
          )}

          {currentView === 'saints_stickers' && (
            <SaintsStickersModal
              isFullView={true}
              currentUser={currentUser}
              onBackToHome={() => handleNavigate('home')}
            />
          )}

          {currentView === 'prayer_fortress' && (
            <DailyPrayerFortress
              currentUser={currentUser}
              onBackToHome={() => handleNavigate('home')}
              onNavigateToSpiritualFather={() => handleNavigate('spiritual_father')}
              onNavigateToConsecratedManual={() => handleNavigate('consecrated_manual')}
            />
          )}

          {currentView === 'virtue_jar' && (
            <VirtueJarComponent
              currentUser={currentUser}
              onBackToHome={() => handleNavigate('home')}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={handleUserUpdated}
      />

      <RulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />

      <SpiritualGuideModal
        isOpen={showSpiritualGuideModal}
        onClose={() => setShowSpiritualGuideModal(false)}
      />

      <EmergencyRescueModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        situation={emergencySituation}
      />

      <HeavenlyMessageModal
        isOpen={showHeavenlyMessageModal}
        onClose={() => setShowHeavenlyMessageModal(false)}
        currentUser={currentUser}
      />

      <SaintsStickersModal
        isOpen={showSaintsStickersModal}
        onClose={() => setShowSaintsStickersModal(false)}
        currentUser={currentUser}
      />

      <SpiritualJournal
        isOpen={showSpiritualJournal}
        onClose={() => setShowSpiritualJournal(false)}
        currentUser={currentUser}
      />

      <IconGalleryModal
        isOpen={showIconGallery}
        onClose={() => setShowIconGallery(false)}
        currentUser={currentUser}
      />

      <ChurchFathersAndSaintsGallery
        isOpen={showSaintsGallery}
        onClose={() => setShowSaintsGallery(false)}
        currentUser={currentUser}
      />

      {/* Global Spiritual Hymns Audio Player */}
      <SpiritualHymnsPlayer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ReadingThemeProvider>
        <HymnsAudioProvider>
          <AppContent />
          <AppInstallManager />
        </HymnsAudioProvider>
      </ReadingThemeProvider>
    </LanguageProvider>
  );
}
