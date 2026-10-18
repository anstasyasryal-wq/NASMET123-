import {
  HeavenlyMessage,
  HEAVENLY_MESSAGES,
  getDayOfYear,
  getMessageForDayOfYear,
} from '../data/heavenlyMessages';

const HISTORY_STORAGE_KEY = 'mokarasa_heavenly_seen_history';
const DAILY_STORAGE_KEY = 'mokarasa_heavenly_active_daily';
export const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export interface SeenRecord {
  id: string;
  timestamp: number;
}

export interface ActiveDailyRecord {
  id: string;
  timestamp: number;
}

/**
 * Gets clean list of message IDs seen within the past 24 hours.
 * Automatically purges expired entries older than 24 hours.
 */
export function getSeenHistory(): SeenRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const list: SeenRecord[] = JSON.parse(raw);
    const now = Date.now();
    // Keep only records from the last 24 hours
    const active = list.filter((item) => now - item.timestamp < TWENTY_FOUR_HOURS_MS);
    if (active.length !== list.length) {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(active));
    }
    return active;
  } catch {
    return [];
  }
}

/**
 * Records that a message was shown/drawn right now.
 */
export function recordMessageSeen(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getSeenHistory();
    const now = Date.now();
    // Filter out previous entry for this id to avoid duplicates
    const filtered = history.filter((item) => item.id !== id);
    filtered.push({ id, timestamp: now });
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }
}

/**
 * Checks if a specific message ID was seen in the last 24 hours.
 */
export function isMessageSeenInLast24Hours(id: string): boolean {
  const history = getSeenHistory();
  const now = Date.now();
  return history.some((item) => item.id === id && now - item.timestamp < TWENTY_FOUR_HOURS_MS);
}

/**
 * Returns how many messages have been seen in the last 24 hours
 * and how many remain fresh.
 */
export function getFreshStats(): { seenCount: number; freshCount: number; totalCount: number } {
  const history = getSeenHistory();
  const seenIds = new Set(history.map((h) => h.id));
  const total = HEAVENLY_MESSAGES.length;
  const seenCount = seenIds.size;
  const freshCount = Math.max(0, total - seenCount);
  return { seenCount, freshCount, totalCount: total };
}

/**
 * Gets all eligible messages that have NOT been seen in the last 24 hours.
 * If all messages happen to be exhausted within 24h, gracefully returns the least recently seen.
 */
export function getEligibleHeavenlyMessages(
  category?: string,
  excludeCurrentId?: string
): HeavenlyMessage[] {
  const history = getSeenHistory();
  const seenIds = new Set(history.map((h) => h.id));
  if (excludeCurrentId) {
    seenIds.add(excludeCurrentId);
  }

  let pool = HEAVENLY_MESSAGES;
  if (category && category !== 'all') {
    const byCategory = HEAVENLY_MESSAGES.filter((m) => m.category === category);
    if (byCategory.length > 0) pool = byCategory;
  }

  // Filter out any message seen within the last 24 hours
  let eligible = pool.filter((m) => !seenIds.has(m.id));

  // If the category pool was exhausted, try un-seen messages from any category
  if (eligible.length === 0 && category && category !== 'all') {
    eligible = HEAVENLY_MESSAGES.filter((m) => !seenIds.has(m.id));
  }

  // If totally exhausted (user drew all 68+ within 24h), sort by least recently seen
  if (eligible.length === 0) {
    const historyMap = new Map(history.map((h) => [h.id, h.timestamp]));
    const sorted = [...pool].sort((a, b) => {
      const timeA = historyMap.get(a.id) || 0;
      const timeB = historyMap.get(b.id) || 0;
      return timeA - timeB; // oldest first
    });
    return sorted.slice(0, Math.max(1, Math.floor(pool.length / 2)));
  }

  return eligible;
}

/**
 * Draws a lucky message strictly guaranteed not to have been seen in the last 24 hours.
 */
export function getFreshLuckyMessage(
  category?: string,
  excludeCurrentId?: string
): HeavenlyMessage {
  const eligible = getEligibleHeavenlyMessages(category, excludeCurrentId);
  const randomIndex = Math.floor(Math.random() * eligible.length);
  const chosen = eligible[randomIndex] || HEAVENLY_MESSAGES[0];
  recordMessageSeen(chosen.id);
  return chosen;
}

/**
 * Gets or refreshes the active daily message for the user:
 * - If the user has an active daily message received less than 24 hours ago and `forceNew` is false, returns it.
 * - If 24 hours have passed OR `forceNew` is true (user clicks to get a new daily message):
 *   picks a fresh message that has NOT appeared in the last 24 hours, marks it active, and saves the new timestamp.
 */
export function getOrRefreshDailyMessage(forceNew: boolean = false): {
  message: HeavenlyMessage;
  timeRemainingMs: number;
  isNew: boolean;
  receivedAt: number;
} {
  const now = Date.now();
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(DAILY_STORAGE_KEY);
      if (raw && !forceNew) {
        const stored: ActiveDailyRecord = JSON.parse(raw);
        const elapsed = now - stored.timestamp;
        if (elapsed < TWENTY_FOUR_HOURS_MS) {
          const found = HEAVENLY_MESSAGES.find((m) => m.id === stored.id);
          if (found) {
            return {
              message: found,
              timeRemainingMs: TWENTY_FOUR_HOURS_MS - elapsed,
              isNew: false,
              receivedAt: stored.timestamp,
            };
          }
        }
      }
    } catch {
      // fallback
    }
  }

  // Pick today's assigned message by Day of the Year (1 to 366), or a fresh eligible one if forceNew
  let fresh: HeavenlyMessage;
  if (forceNew) {
    const eligible = getEligibleHeavenlyMessages();
    const randomIndex = Math.floor(Math.random() * eligible.length);
    fresh = eligible[randomIndex] || HEAVENLY_MESSAGES[0];
  } else {
    const currentDayOfYear = getDayOfYear();
    fresh = getMessageForDayOfYear(currentDayOfYear);
  }

  recordMessageSeen(fresh.id);

  if (typeof window !== 'undefined') {
    try {
      const newDailyRecord: ActiveDailyRecord = { id: fresh.id, timestamp: now };
      localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(newDailyRecord));
    } catch {
      // ignore
    }
  }

  return {
    message: fresh,
    timeRemainingMs: TWENTY_FOUR_HOURS_MS,
    isNew: true,
    receivedAt: now,
  };
}

/**
 * Helper to format remaining milliseconds into "ساعات ودقائق"
 */
export function formatRemainingTime(ms: number): string {
  if (ms <= 0) return 'جاهزة للتجديد الآن';
  const totalMinutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours} ساعة و ${minutes} دقيقة`;
  }
  return `${minutes} دقيقة`;
}
