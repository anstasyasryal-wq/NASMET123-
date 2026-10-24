import { CipherProgress } from '../types/nesmaCipher';
import { PSYCHOLOGICAL_QUOTES } from '../data/nesmaCipherData';

const STORAGE_KEY = 'nesma_cipher_progress_v1';

export const DEFAULT_CIPHER_PROGRESS: CipherProgress = {
  completedLevels: [],
  currentLevel: 1,
  score: 0,
  stars: {},
  discoveredQuotes: [],
  gardenItems: ['seed_of_awareness'],
  discoveredSecrets: [],
  unlockedGrandSecret: false,
  grandSecretUnlockedAt: undefined,
  lastPlayedTimestamp: Date.now(),
};

export function loadCipherProgress(): CipherProgress {
  if (typeof window === 'undefined') return DEFAULT_CIPHER_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CIPHER_PROGRESS;
    const parsed = JSON.parse(raw);
    
    // Validate schema integrity against corrupted/partial data
    if (typeof parsed !== 'object' || parsed === null) {
      return DEFAULT_CIPHER_PROGRESS;
    }

    const completedLevels = Array.isArray(parsed.completedLevels)
      ? parsed.completedLevels.filter((n: any) => typeof n === 'number')
      : [];

    const currentLevel = typeof parsed.currentLevel === 'number' && parsed.currentLevel >= 1
      ? parsed.currentLevel
      : 1;

    const score = typeof parsed.score === 'number' ? Math.max(0, parsed.score) : 0;

    const stars = typeof parsed.stars === 'object' && parsed.stars !== null
      ? parsed.stars
      : {};

    const discoveredQuotes = Array.isArray(parsed.discoveredQuotes)
      ? parsed.discoveredQuotes.filter((n: any) => typeof n === 'number')
      : [];

    const gardenItems = Array.isArray(parsed.gardenItems)
      ? parsed.gardenItems.filter((s: any) => typeof s === 'string')
      : DEFAULT_CIPHER_PROGRESS.gardenItems;

    const discoveredSecrets = Array.isArray(parsed.discoveredSecrets)
      ? parsed.discoveredSecrets.filter((s: any) => typeof s === 'string')
      : [];

    const unlockedGrandSecret = typeof parsed.unlockedGrandSecret === 'boolean'
      ? parsed.unlockedGrandSecret
      : false;

    const grandSecretUnlockedAt = typeof parsed.grandSecretUnlockedAt === 'number'
      ? parsed.grandSecretUnlockedAt
      : undefined;

    return {
      completedLevels,
      currentLevel,
      score,
      stars,
      discoveredQuotes,
      gardenItems,
      discoveredSecrets,
      unlockedGrandSecret,
      grandSecretUnlockedAt,
      lastPlayedTimestamp: parsed.lastPlayedTimestamp || Date.now(),
    };
  } catch (err) {
    console.error('Error loading Nesma Cipher progress, falling back safely:', err);
    return DEFAULT_CIPHER_PROGRESS;
  }
}

export function saveCipherProgress(progress: CipherProgress): void {
  if (typeof window === 'undefined') return;
  try {
    const dataToSave = {
      ...progress,
      lastPlayedTimestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (err) {
    console.error('Error saving Nesma Cipher progress:', err);
  }
}

export function markStageCompleted(
  stageId: number,
  earnedStars: number = 3,
  points: number = 100
): CipherProgress {
  const current = loadCipherProgress();
  const isFirstTime = !current.completedLevels.includes(stageId);

  const nextCompleted = Array.from(new Set([...current.completedLevels, stageId]));
  const nextStars = {
    ...current.stars,
    [stageId]: Math.max(current.stars[stageId] || 0, earnedStars),
  };

  // Prevent duplicate score points upon replaying
  const nextScore = current.score + (isFirstTime ? points : 0);
  const nextCurrentLevel = Math.max(current.currentLevel, stageId + 1);

  // Automatically discover quotes when all target stages for a quote are done
  const nextDiscoveredQuotes = Array.from(new Set([
    ...current.discoveredQuotes,
    ...PSYCHOLOGICAL_QUOTES
      .filter((q) => q.targetStageIds.every((id) => nextCompleted.includes(id)))
      .map((q) => q.id),
  ]));

  const updated: CipherProgress = {
    ...current,
    completedLevels: nextCompleted,
    currentLevel: nextCurrentLevel,
    stars: nextStars,
    score: nextScore,
    discoveredQuotes: nextDiscoveredQuotes,
  };

  saveCipherProgress(updated);
  return updated;
}

export function unlockSecret(secretId: string): { progress: CipherProgress; isNew: boolean } {
  const current = loadCipherProgress();
  const alreadyDiscovered = current.discoveredSecrets.includes(secretId);

  if (alreadyDiscovered) {
    return { progress: current, isNew: false };
  }

  const nextSecrets = [...current.discoveredSecrets, secretId];
  const updated: CipherProgress = {
    ...current,
    discoveredSecrets: nextSecrets,
  };

  saveCipherProgress(updated);
  return { progress: updated, isNew: true };
}

export function unlockGrandSecret(): { progress: CipherProgress; isNew: boolean } {
  const current = loadCipherProgress();
  if (current.unlockedGrandSecret) {
    return { progress: current, isNew: false };
  }

  const updated: CipherProgress = {
    ...current,
    unlockedGrandSecret: true,
    grandSecretUnlockedAt: Date.now(),
  };

  saveCipherProgress(updated);
  return { progress: updated, isNew: true };
}

export function isGrandSecretUnlocked(): boolean {
  return Boolean(loadCipherProgress().unlockedGrandSecret);
}

export function resetCipherProgress(): CipherProgress {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
  return DEFAULT_CIPHER_PROGRESS;
}
