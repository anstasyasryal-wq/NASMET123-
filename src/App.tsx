/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { User, AppView, Stage, Announcement } from './types';
import {
  getCurrentUser,
  setCurrentUser as persistCurrentUser,
  getStoredStages,
  getStoredAnnouncements,
} from './utils/competitionEngine';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { DailySaintAlertBanner } from './components/DailySaintAlertBanner';
import { ReadingThemeProvider, useReadingTheme } from './context/ReadingThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { HymnsAudioProvider } from './context/HymnsAudioContext';
import AppInstallManager from './components/AppInstallManager';
import { MobileBottomNav } from './components/MobileBottomNav';
import { JoyfulScreenHeader } from './components/JoyfulScreenHeader';
import { OnlineAutoUpdater } from './components/OnlineAutoUpdater';
import { recordViewVisit } from './utils/preloadManager';
import { motion } from 'framer-motion';
import { SpiritualHymnsPlayer } from './components/SpiritualHymnsPlayer';
import { FloatingSpiritualGuideFAB } from './components/FloatingSpiritualGuideFAB';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy-loaded Views (Code Splitting for instant mobile startup)
const StagePlayer = lazy(() => import('./components/StagePlayer').then(m => ({ default: m.StagePlayer })));
const LeaderboardView = lazy(() => import('./components/LeaderboardView').then(m => ({ default: m.LeaderboardView })));
const SupervisorDashboard = lazy(() => import('./components/SupervisorDashboard').then(m => ({ default: m.SupervisorDashboard })));
const FinalCeremonyView = lazy(() => import('./components/FinalCeremonyView').then(m => ({ default: m.FinalCeremonyView })));
const ParticipantsListView = lazy(() => import('./components/ParticipantsListView').then(m => ({ default: m.ParticipantsListView })));
const CompetitionsHubView = lazy(() => import('./components/CompetitionsHubView').then(m => ({ default: m.CompetitionsHubView })));
const SpiritualLifeView = lazy(() => import('./components/SpiritualLifeView').then(m => ({ default: m.SpiritualLifeView })));
const BiblicalStudyView = lazy(() => import('./components/BiblicalStudyView').then(m => ({ default: m.BiblicalStudyView })));
const PersonalSpaceView = lazy(() => import('./components/PersonalSpaceView').then(m => ({ default: m.PersonalSpaceView })));
const LibraryView = lazy(() => import('./components/LibraryView').then(m => ({ default: m.LibraryView })));
const WorkshopsView = lazy(() => import('./components/WorkshopsView').then(m => ({ default: m.WorkshopsView })));
const CreativeLab = lazy(() => import('./components/CreativeLab').then(m => ({ default: m.CreativeLab })));
const StudyToolsView = lazy(() => import('./components/StudyToolsView').then(m => ({ default: m.StudyToolsView })));
const MonasticOasis = lazy(() => import('./components/MonasticOasis').then(m => ({ default: m.MonasticOasis })));
const SpiritualGamesHub = lazy(() => import('./components/SpiritualGamesHub').then(m => ({ default: m.SpiritualGamesHub })));
const MonasticAscentPuzzle = lazy(() => import('./components/MonasticAscentPuzzle').then(m => ({ default: m.MonasticAscentPuzzle })));
const CollectiveChallengesView = lazy(() => import('./components/CollectiveChallengesView').then(m => ({ default: m.CollectiveChallengesView })));
const SpiritualCalendarView = lazy(() => import('./components/SpiritualCalendarView').then(m => ({ default: m.SpiritualCalendarView })));
const SpiritualFatherCompanion = lazy(() => import('./components/SpiritualFatherCompanion').then(m => ({ default: m.SpiritualFatherCompanion })));
const ConsecratedManualReference = lazy(() => import('./components/ConsecratedManualReference').then(m => ({ default: m.ConsecratedManualReference })));
const DailyPrayerFortress = lazy(() => import('./components/DailyPrayerFortress').then(m => ({ default: m.DailyPrayerFortress })));
const VirtueJarComponent = lazy(() => import('./components/VirtueJarComponent').then(m => ({ default: m.VirtueJarComponent })));

// Lazy-loaded Modals (Loaded only when user opens them)
const RegistrationModal = lazy(() => import('./components/RegistrationModal').then(m => ({ default: m.RegistrationModal })));
const RulesModal = lazy(() => import('./components/RulesModal').then(m => ({ default: m.RulesModal })));
const SpiritualGuideModal = lazy(() => import('./components/SpiritualGuideModal').then(m => ({ default: m.SpiritualGuideModal })));
const EmergencyRescueModal = lazy(() => import('./components/EmergencyRescueModal').then(m => ({ default: m.EmergencyRescueModal })));
const HeavenlyMessageModal = lazy(() => import('./components/HeavenlyMessageModal').then(m => ({ default: m.HeavenlyMessageModal })));
const SaintsStickersModal = lazy(() => import('./components/SaintsStickersModal').then(m => ({ default: m.SaintsStickersModal })));
const SpiritualJournal = lazy(() => import('./components/SpiritualJournal').then(m => ({ default: m.SpiritualJournal })));
const IconGalleryModal = lazy(() => import('./components/IconGalleryModal').then(m => ({ default: m.IconGalleryModal })));
const ChurchFathersAndSaintsGallery = lazy(() => import('./components/ChurchFathersAndSaintsGallery').then(m => ({ default: m.ChurchFathersAndSaintsGallery })));
import WelcomeSplashModal from './components/WelcomeSplashModal';
const VirtualSilentRetreat = lazy(() => import('./components/VirtualSilentRetreat').then(m => ({ default: m.VirtualSilentRetreat })));
const ComprehensiveDirectoryModal = lazy(() => import('./components/ComprehensiveDirectoryModal').then(m => ({ default: m.ComprehensiveDirectoryModal })));

const ViewLoadingFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3 py-16 animate-fade-in text-center" dir="rtl">
    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-2xl animate-pulse shadow-md">
      ✝️
    </div>
    <p className="text-xs text-amber-300 font-bold font-spiritual">جاري فتح القسم بالبركة...</p>
  </div>
);

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('mokarasa_current_view') as AppView;
        if (saved) return saved;
      } catch {
        // Fallback to home if storage is restricted
      }
    }
    return 'home';
  });
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [activeStageId, setActiveStageId] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('mokarasa_active_stage_id');
        if (saved) return parseInt(saved) || 1;
      } catch {
        // Fallback to stage 1
      }
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
  const [showSilentRetreat, setShowSilentRetreat] = useState<boolean>(false);
  const [showDirectoryModal, setShowDirectoryModal] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [showWelcomeSplash, setShowWelcomeSplash] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return !localStorage.getItem('mokarasa_welcomed');
      } catch {
        return true;
      }
    }
    return true;
  });
  const [emergencySituation, setEmergencySituation] = useState<'distress' | 'boredom' | 'lukewarmness' | 'anger'>('distress');

  const { getContainerClass } = useReadingTheme();

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUserState(user);
    setStages(getStoredStages());
    setAnnouncements(getStoredAnnouncements());

    // Automatic daily morning message popup check on first app open of the day
    if (typeof window !== 'undefined') {
      try {
        const popupEnabled = localStorage.getItem('mokarasa_daily_message_popup_enabled') !== 'false';
        if (popupEnabled) {
          const todayStr = new Date().toDateString();
          const lastPopupDate = localStorage.getItem('mokarasa_last_heavenly_popup_date');
          if (lastPopupDate !== todayStr) {
            const timer = setTimeout(() => {
              setShowHeavenlyMessageModal(true);
              localStorage.setItem('mokarasa_last_heavenly_popup_date', todayStr);
            }, 1000);
            return () => clearTimeout(timer);
          }
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const handleNavigate = (view: AppView) => {
    recordViewVisit(view);
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
    <div className={`min-h-screen ${getContainerClass()} font-sans selection:bg-amber-200 selection:text-amber-900 flex flex-col justify-between pb-20 lg:pb-6`}>
      <OnlineAutoUpdater />
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
          mobileMenuOpen={showMobileMenu}
          onToggleMobileMenu={() => setShowMobileMenu((prev) => !prev)}
          onCloseMobileMenu={() => setShowMobileMenu(false)}
          onOpenSilentRetreat={() => setShowSilentRetreat(true)}
          onOpenWelcomeGarden={() => setShowWelcomeSplash(true)}
          onOpenDirectory={() => setShowDirectoryModal(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-6 pb-28 sm:pb-16">
          {/* Daily Saint & Virtue Alert Banner (Rendered only on home for fast clean standalone screens) */}
          {currentView === 'home' && (
            <div className="mb-6">
              <DailySaintAlertBanner
                onOpenFullModal={() => setShowSaintsStickersModal(true)}
              />
            </div>
          )}

          {currentView === 'home' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
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
                onOpenRetreat={() => setShowSilentRetreat(true)}
                onNavigateToMonasticPuzzle={() => handleNavigate('monastic_puzzle')}
                onOpenDirectory={() => setShowDirectoryModal(true)}
              />
            </motion.div>
          )}

          <Suspense fallback={<ViewLoadingFallback />}>
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
              <div className="animate-fade-in">
                <JoyfulScreenHeader
                  title="المسابقات والمراحل الكنسية"
                  subtitle="تحدَّ نفسك واختبر معلوماتك في المسابقات والمراحل الروحية المعتمدة"
                  icon="🏆"
                  badge="المسابقة"
                  onBackToHome={() => handleNavigate('home')}
                />
                <CompetitionsHubView
                  onStartStage={handleStartStage}
                  onBackToHome={() => handleNavigate('home')}
                />
              </div>
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
              <div className="animate-fade-in">
                <JoyfulScreenHeader
                  title="الحياة الروحية والمخدع"
                  subtitle="تأملاتك، مذكرتك الروحية، وإعداد الاعتراف وأبوي الروحي"
                  icon="❤️"
                  badge="مخدع"
                  onBackToHome={() => handleNavigate('home')}
                />
                <SpiritualLifeView
                  currentUser={currentUser}
                  onOpenLogin={() => setShowRegistrationModal(true)}
                  onOpenSpiritualGuide={() => setShowSpiritualGuideModal(true)}
                  onBackToHome={() => handleNavigate('home')}
                  onNavigateToPrayerFortress={() => handleNavigate('prayer_fortress')}
                />
              </div>
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
              <div className="animate-fade-in">
                <JoyfulScreenHeader
                  title="المكتبة الكنسية وأقوال الآباء"
                  subtitle="موسوعة الكتب الروحية وأقوال القديسين والبحوث الآبائية"
                  icon="📚"
                  badge="مراجع"
                  onBackToHome={() => handleNavigate('home')}
                />
                <LibraryView
                  currentUser={currentUser}
                  onOpenLogin={() => setShowRegistrationModal(true)}
                  onBackToHome={() => handleNavigate('home')}
                  onOpenIconGallery={() => setShowIconGallery(true)}
                  onOpenSaintsGallery={() => setShowSaintsGallery(true)}
                />
              </div>
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
              <div className="animate-fade-in">
                <JoyfulScreenHeader
                  title="الألعاب الروحية والعجلة"
                  subtitle="مسابقات وألعاب ترفيهية هادفة لاختبار المعلومات الكنسية"
                  icon="🎮"
                  badge="تسلية هادفة"
                  onBackToHome={() => handleNavigate('home')}
                />
                <SpiritualGamesHub
                  currentUser={currentUser}
                  onBackToHome={() => handleNavigate('home')}
                />
              </div>
            )}

            {currentView === 'monastic_puzzle' && (
              <MonasticAscentPuzzle
                onBack={() => handleNavigate('home')}
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
              <div className="animate-fade-in">
                <JoyfulScreenHeader
                  title="المشاركون والتحديات الجماعية"
                  subtitle="لوحة الشرف، ترتيب المشاركين، والتحديات الروحية الجماعية"
                  icon="👥"
                  badge="مشاركات"
                  onBackToHome={() => handleNavigate('home')}
                />
                <CollectiveChallengesView
                  currentUser={currentUser}
                  onOpenLogin={() => setShowRegistrationModal(true)}
                  onBackToHome={() => handleNavigate('home')}
                />
              </div>
            )}

            {currentView === 'spiritual_calendar' && (
              <div className="animate-fade-in">
                <JoyfulScreenHeader
                  title="التقويم الكنسي والأصوام"
                  subtitle="متابعة الأصوام والأعياد والمناسبات الكنسية اليومية"
                  icon="📅"
                  badge="طقسي"
                  onBackToHome={() => handleNavigate('home')}
                />
                <SpiritualCalendarView
                  currentUser={currentUser}
                  onOpenLogin={() => setShowRegistrationModal(true)}
                  onBackToHome={() => handleNavigate('home')}
                />
              </div>
            )}

            {currentView === 'spiritual_father' && (
              <SpiritualFatherCompanion
                currentUser={currentUser}
                onBackToHome={() => handleNavigate('home')}
              />
            )}

            {currentView === 'consecrated_manual' && (
              <div className="animate-fade-in">
                <JoyfulScreenHeader
                  title="دستور المكرس والمرجع الروحي"
                  subtitle="الأسس الروحية والكتب التوثيقية والتشريعات الكنسية"
                  icon="📜"
                  badge="وثائقي"
                  onBackToHome={() => handleNavigate('home')}
                />
                <ConsecratedManualReference
                  currentUser={currentUser}
                  onBackToHome={() => handleNavigate('home')}
                  onNavigateToOasis={() => handleNavigate('monastic_oasis')}
                  onNavigateToSpiritualFather={() => handleNavigate('spiritual_father')}
                  onNavigateToPrayerFortress={() => handleNavigate('prayer_fortress')}
                />
              </div>
            )}

            {currentView === 'saints_stickers' && (
              <SaintsStickersModal
                isFullView={true}
                currentUser={currentUser}
                onBackToHome={() => handleNavigate('home')}
              />
            )}

            {currentView === 'prayer_fortress' && (
              <div className="animate-fade-in">
                <JoyfulScreenHeader
                  title="حصن الصلاة اليومي والمزامير"
                  subtitle="مزاميرك اليومية ومنبه الصلاة وسلاحك الروحي الثابت"
                  icon="🛡️"
                  badge="يومي"
                  onBackToHome={() => handleNavigate('home')}
                />
                <DailyPrayerFortress
                  currentUser={currentUser}
                  onBackToHome={() => handleNavigate('home')}
                  onNavigateToSpiritualFather={() => handleNavigate('spiritual_father')}
                  onNavigateToConsecratedManual={() => handleNavigate('consecrated_manual')}
                />
              </div>
            )}

            {currentView === 'virtue_jar' && (
              <div className="animate-fade-in">
                <JoyfulScreenHeader
                  title="حصالة الفضائل والتثبيت"
                  subtitle="سجل فضائلك وأعمالك الصالحة وتتبع نموك الروحي نحو الكمال"
                  icon="🪙"
                  badge="تفاعلي"
                  onBackToHome={() => handleNavigate('home')}
                />
                <VirtueJarComponent
                  currentUser={currentUser}
                  onBackToHome={() => handleNavigate('home')}
                />
              </div>
            )}
          </Suspense>
        </main>
      </div>

      {/* Modals - Only loaded on-demand when activated by user */}
      <Suspense fallback={null}>
        <WelcomeSplashModal
          isOpen={showWelcomeSplash}
          onClose={() => {
            setShowWelcomeSplash(false);
            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem('mokarasa_welcomed', 'true');
              } catch {}
            }
          }}
        />

        {showRegistrationModal && (
          <RegistrationModal
            isOpen={showRegistrationModal}
            onClose={() => setShowRegistrationModal(false)}
            onSuccess={handleUserUpdated}
          />
        )}

        {showRulesModal && (
          <RulesModal
            isOpen={showRulesModal}
            onClose={() => setShowRulesModal(false)}
          />
        )}

        {showSpiritualGuideModal && (
          <SpiritualGuideModal
            isOpen={showSpiritualGuideModal}
            onClose={() => setShowSpiritualGuideModal(false)}
          />
        )}

        {showEmergencyModal && (
          <EmergencyRescueModal
            isOpen={showEmergencyModal}
            onClose={() => setShowEmergencyModal(false)}
            situation={emergencySituation}
          />
        )}

        {showHeavenlyMessageModal && (
          <HeavenlyMessageModal
            isOpen={showHeavenlyMessageModal}
            onClose={() => setShowHeavenlyMessageModal(false)}
            currentUser={currentUser}
          />
        )}

        {showSaintsStickersModal && (
          <SaintsStickersModal
            isOpen={showSaintsStickersModal}
            onClose={() => setShowSaintsStickersModal(false)}
            currentUser={currentUser}
          />
        )}

        {showSpiritualJournal && (
          <SpiritualJournal
            isOpen={showSpiritualJournal}
            onClose={() => setShowSpiritualJournal(false)}
            currentUser={currentUser}
          />
        )}

        {showIconGallery && (
          <IconGalleryModal
            isOpen={showIconGallery}
            onClose={() => setShowIconGallery(false)}
            currentUser={currentUser}
          />
        )}

        {showSaintsGallery && (
          <ChurchFathersAndSaintsGallery
            isOpen={showSaintsGallery}
            onClose={() => setShowSaintsGallery(false)}
            currentUser={currentUser}
          />
        )}

        {showSilentRetreat && (
          <VirtualSilentRetreat
            isOpen={showSilentRetreat}
            onClose={() => setShowSilentRetreat(false)}
          />
        )}

        {showDirectoryModal && (
          <ComprehensiveDirectoryModal
            isOpen={showDirectoryModal}
            onClose={() => setShowDirectoryModal(false)}
            onNavigate={(view) => handleNavigate(view)}
            onOpenSpiritualGuide={() => setShowSpiritualGuideModal(true)}
            onOpenEmergencyModal={handleOpenEmergency}
            onOpenSilentRetreat={() => setShowSilentRetreat(true)}
            onOpenSaintsStickers={() => setShowSaintsStickersModal(true)}
            onOpenHeavenlyMessage={() => setShowHeavenlyMessageModal(true)}
            onOpenSpiritualJournal={() => setShowSpiritualJournal(true)}
            onOpenIconGallery={() => setShowIconGallery(true)}
            onOpenSaintsGallery={() => setShowSaintsGallery(true)}
            currentUser={currentUser}
          />
        )}
      </Suspense>

      {/* Global Spiritual Hymns Audio Player */}
      <Suspense fallback={null}>
        <SpiritualHymnsPlayer />
      </Suspense>

      {/* Floating Spiritual Guide FAB */}
      <FloatingSpiritualGuideFAB
        onOpenSpiritualGuide={() => setShowSpiritualGuideModal(true)}
        currentView={currentView}
      />

      {/* Native Mobile Bottom Navigation Bar (5 Unified Pillars) */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenMobileMenu={() => setShowMobileMenu(true)}
        onOpenSpiritualGuide={() => setShowSpiritualGuideModal(true)}
        onOpenDirectory={() => setShowDirectoryModal(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ReadingThemeProvider>
          <HymnsAudioProvider>
            <AppContent />
            <AppInstallManager />
          </HymnsAudioProvider>
        </ReadingThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
