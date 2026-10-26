/**
 * Robust Text-to-Speech Helper with Egyptian Arabic Voice Preference & GC Prevention
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function getEgyptianArabicVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Try to find explicit Egyptian Arabic voice (ar-EG or containing Egypt / مصر)
  const egVoice = voices.find(
    (v) => v.lang.toLowerCase() === 'ar-eg' || v.name.toLowerCase().includes('egypt') || v.name.includes('مصر')
  );
  if (egVoice) return egVoice;

  // 2. Try any Arabic voice
  const arVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ar'));
  return arVoice || voices[0] || null;
}

export function speakEgyptianText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: () => void
): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const cleanText = text.trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  currentUtterance = utterance; // Prevent garbage collection bug (reads first two words and stops)

  utterance.rate = 0.9; // Calm, natural reading speed
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Set Egyptian Arabic language tag
  utterance.lang = 'ar-EG';

  const voice = getEgyptianArabicVoice();
  if (voice) {
    utterance.voice = voice;
    if (voice.lang) {
      utterance.lang = voice.lang;
    }
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };

  utterance.onerror = (e) => {
    currentUtterance = null;
    console.warn('Speech synthesis error:', e);
    onError?.();
  };

  // Chrome/Android bug workaround: resume if paused during long speech
  const resumeInterval = setInterval(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
      clearInterval(resumeInterval);
    }
  }, 3000);

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeakingActive(): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  return window.speechSynthesis.speaking;
}
