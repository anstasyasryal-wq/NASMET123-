/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppView } from '../types';

// Map of dynamic import loaders matching App.tsx lazy components
export const viewLoaders: Record<AppView, () => Promise<unknown>> = {
  home: () => Promise.resolve(), // Home is in the main bundle
  stage_player: () => import('../components/StagePlayer'),
  competitions_hub: () => import('../components/CompetitionsHubView'),
  leaderboard: () => import('../components/LeaderboardView'),
  dioceses: () => import('../components/LeaderboardView'),
  supervisor: () => import('../components/SupervisorDashboard'),
  final_ceremony: () => import('../components/FinalCeremonyView'),
  participants: () => import('../components/ParticipantsListView'),
  spiritual_life: () => import('../components/SpiritualLifeView'),
  biblical_study: () => import('../components/BiblicalStudyView'),
  personal_space: () => import('../components/PersonalSpaceView'),
  library: () => import('../components/LibraryView'),
  workshops: () => import('../components/WorkshopsView'),
  creative_lab: () => import('../components/CreativeLab'),
  study_tools: () => import('../components/StudyToolsView'),
  monastic_oasis: () => import('../components/MonasticOasis'),
  spiritual_games: () => import('../components/SpiritualGamesHub'),
  collective_challenges: () => import('../components/CollectiveChallengesView'),
  spiritual_calendar: () => import('../components/SpiritualCalendarView'),
  spiritual_father: () => import('../components/SpiritualFatherCompanion'),
  consecrated_manual: () => import('../components/ConsecratedManualReference'),
  saints_stickers: () => import('../components/SaintsStickersModal'),
  prayer_fortress: () => import('../components/DailyPrayerFortress'),
  virtue_jar: () => import('../components/VirtueJarComponent'),
};

export const modalLoaders: Record<string, () => Promise<unknown>> = {
  registration: () => import('../components/RegistrationModal'),
  rules: () => import('../components/RulesModal'),
  spiritual_guide: () => import('../components/SpiritualGuideModal'),
  emergency: () => import('../components/EmergencyRescueModal'),
  heavenly_message: () => import('../components/HeavenlyMessageModal'),
  saints_stickers: () => import('../components/SaintsStickersModal'),
  spiritual_journal: () => import('../components/SpiritualJournal'),
  icon_gallery: () => import('../components/IconGalleryModal'),
  saints_gallery: () => import('../components/ChurchFathersAndSaintsGallery'),
  welcome_splash: () => import('../components/WelcomeSplashModal'),
};

const prefetchedSet = new Set<string>();

const VISIT_STORAGE_KEY = 'mokarasa_view_visit_counts_v1';

// Default high-priority views to prefetch if user has no visit history yet
const DEFAULT_TOP_VIEWS: AppView[] = [
  'competitions_hub',
  'prayer_fortress',
  'spiritual_life',
  'library',
  'biblical_study',
];

/**
 * Record a user's navigation to a view to build behavioral prefetch profile
 */
export function recordViewVisit(view: AppView): void {
  if (typeof window === 'undefined' || view === 'home') return;
  try {
    const raw = localStorage.getItem(VISIT_STORAGE_KEY);
    const counts: Record<string, number> = raw ? JSON.parse(raw) : {};
    counts[view] = (counts[view] || 0) + 1;
    localStorage.setItem(VISIT_STORAGE_KEY, JSON.stringify(counts));
  } catch {
    // Fail silently on storage errors
  }
}

/**
 * Get user's most frequently visited views sorted by visit count descending
 */
export function getMostVisitedViews(limit = 4): AppView[] {
  if (typeof window === 'undefined') return DEFAULT_TOP_VIEWS.slice(0, limit);
  try {
    const raw = localStorage.getItem(VISIT_STORAGE_KEY);
    if (!raw) return DEFAULT_TOP_VIEWS.slice(0, limit);
    const counts: Record<string, number> = JSON.parse(raw);

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([view]) => view as AppView)
      .filter((v) => viewLoaders[v] && v !== 'home');

    // Fill with defaults if user has visited fewer than limit screens
    const merged = Array.from(new Set([...sorted, ...DEFAULT_TOP_VIEWS]));
    return merged.slice(0, limit);
  } catch {
    return DEFAULT_TOP_VIEWS.slice(0, limit);
  }
}

/**
 * Prefetch a single view component chunk ahead of time
 */
export function prefetchView(view: AppView): void {
  if (prefetchedSet.has(view)) return;
  const loader = viewLoaders[view];
  if (loader) {
    prefetchedSet.add(view);
    loader().catch(() => {
      // Allow retry if network failed
      prefetchedSet.delete(view);
    });
  }
}

/**
 * Prefetch a modal ahead of time (e.g., on hover or idle)
 */
export function prefetchModal(modalKey: string): void {
  if (prefetchedSet.has(modalKey)) return;
  const loader = modalLoaders[modalKey];
  if (loader) {
    prefetchedSet.add(modalKey);
    loader().catch(() => {
      prefetchedSet.delete(modalKey);
    });
  }
}

/**
 * Schedule smart background prefetching during browser idle time
 * Uses requestIdleCallback with setTimeout fallback
 */
export function scheduleSmartPrefetch(viewsToPrefetch?: AppView[]): void {
  if (typeof window === 'undefined') return;

  // Don't aggressively prefetch if user has Data Saver enabled
  const nav = navigator as unknown as { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) {
    return;
  }

  const targets = viewsToPrefetch && viewsToPrefetch.length > 0 
    ? viewsToPrefetch 
    : getMostVisitedViews(5);

  const runPrefetch = () => {
    let index = 0;
    const prefetchNext = () => {
      if (index >= targets.length) return;
      const target = targets[index++];
      prefetchView(target);

      // Stagger prefetch chunks by 300ms to preserve network bandwidth and smooth UI
      setTimeout(prefetchNext, 300);
    };

    prefetchNext();
  };

  if ('requestIdleCallback' in window) {
    (window as unknown as { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => void })
      .requestIdleCallback(runPrefetch, { timeout: 2500 });
  } else {
    setTimeout(runPrefetch, 1200);
  }
}
