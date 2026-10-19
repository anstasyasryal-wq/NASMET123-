export const hymnAudioUrl = (trackId: string) => `/audio/hymns/${trackId}.mp3`;

interface HymnFileCallbacks {
  onDuration: (seconds: number) => void;
  onTime: (seconds: number) => void;
  onEnded: () => void;
  onPlaying: () => void;
  onBlocked: () => void;
  onMissing: () => void;
}

/**
 * Plays the recorded hymn file for a track. If the file has not been uploaded
 * (or cannot be decoded), `onMissing` is called so the caller can fall back.
 */
export function playHymnFile(
  trackId: string,
  volume: number,
  callbacks: HymnFileCallbacks
): HTMLAudioElement {
  const el = new Audio(hymnAudioUrl(trackId));
  el.preload = 'auto';
  el.volume = Math.min(1, Math.max(0, volume));

  el.onloadedmetadata = () => {
    if (Number.isFinite(el.duration)) callbacks.onDuration(Math.round(el.duration));
  };
  el.ontimeupdate = () => callbacks.onTime(Math.floor(el.currentTime));
  el.onended = () => callbacks.onEnded();

  el.play()
    .then(() => callbacks.onPlaying())
    .catch((err: DOMException) => {
      if (err?.name === 'NotAllowedError') callbacks.onBlocked();
      else if (err?.name !== 'AbortError') callbacks.onMissing();
    });

  return el;
}
