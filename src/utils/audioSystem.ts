// Web Audio & Web Speech API helper for child-friendly interactive sound and speech

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
  }

  public getMute(): boolean {
    return this.isMuted;
  }

  public playChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Audio context fallback
    }
  }

  public playSuccessFanfare() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.1;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch {
      // Audio context fallback
    }
  }

  public playErrorSound() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Fallback
    }
  }

  public playSparkle() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      for (let i = 0; i < 5; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + i * 0.05;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200 + i * 200, start);
        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.1);
      }
    } catch {
      // Fallback
    }
  }
}

export const soundFx = new SoundManager();

// Standard Noorani Qaida & Urdu letter phonetic mapping dictionary
const URDU_LETTER_PHONETIC_MAP: Record<string, string> = {
  // Single Letters - Fully Diacritized Arabic Phonics for Perfect Tajweed Makhraj
  'ا': 'أَلِف',
  'ب': 'بَاء',
  'پ': 'پَاء',
  'ت': 'تَاء',
  'ٹ': 'ٹَاء',
  'ث': 'ثَاء',
  'ج': 'جِيم',
  'چ': 'چِيم',
  'ح': 'حَاء',
  'خ': 'خَاء',
  'د': 'دَال',
  'ڈ': 'ڈَال',
  'ذ': 'ذَال',
  'ر': 'رَاء',
  'ڑ': 'ڑَاء',
  'ز': 'زَاي',
  'ژ': 'ژَاي',
  'س': 'سِين',
  'ش': 'شِين',
  'ص': 'صَاد',
  'ض': 'ضَاد',
  'ط': 'طَاء',
  'ظ': 'ظَاء',
  'ع': 'عَيْن',
  'غ': 'غَيْن',
  'ف': 'فَاء',
  'ق': 'قَاف',
  'ک': 'كَاف',
  'گ': 'گَاف',
  'ل': 'لاَم',
  'م': 'مِيم',
  'ن': 'نُون',
  'و': 'وَاو',
  'ہ': 'هَاء',
  'ء': 'هَمْزَة',
  'ی': 'يَاء',
  'ے': 'يَاء کَبِيرَة',

  // Sacred Quranic terms & Bismillah mapping
  'بسم اللہ': 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
  'بسم الله': 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
  'بِسْمِ اللهِ': 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
  'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ': 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
  'Bismillah': 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
  'bismillah': 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
  'اللہ': 'اَللّٰہُ',
  'الله': 'اَللّٰہُ',

  // Harakat Vowels - Zabar (Fatha َ )
  'اَ': 'الف زبر اَ',
  'بَ': 'با زبر بَ',
  'پَ': 'پے زبر پَ',
  'تَ': 'تا زبر تَ',
  'ٹَ': 'ٹے زبر ٹَ',
  'ثَ': 'ثا زبر ثَ',
  'جَ': 'جیم زبر جَ',
  'چَ': 'چے زبر چَ',
  'حَ': 'حا زبر حَ',
  'خَ': 'خا زبر خَ',
  'دَ': 'دال زبر دَ',
  'ڈَ': 'ڈال زبر ڈَ',
  'ذَ': 'ذال زبر ذَ',
  'رَ': 'را زبر رَ',
  'ڑَ': 'ڑے زبر ڑَ',
  'زَ': 'زا زبر زَ',
  'سَ': 'سین زبر سَ',
  'شَ': 'شین زبر شَ',
  'صَ': 'صاد زبر صَ',
  'ضَ': 'ضاد زبر ضَ',
  'طَ': 'طا زبر طَ',
  'ظَ': 'ظا زبر ظَ',
  'عَ': 'عین زبر عَ',
  'غَ': 'غین زبر غَ',
  'فَ': 'فا زبر فَ',
  'قَ': 'قاف زبر قَ',
  'کَ': 'کاف زبر کَ',
  'گَ': 'گاف زبر گَ',
  'لَ': 'لام زبر لَ',
  'مَ': 'میم زبر مَ',
  'نَ': 'نون زبر نَ',
  'وَ': 'واؤ زبر وَ',
  'ہَ': 'ہا زبر ہَ',
  'یَ': 'یا زبر یَ',

  // Harakat Vowels - Zer (Kasra ِ )
  'اِ': 'الف زیر اِ',
  'بِ': 'با زیر بِ',
  'پِ': 'پے زیر پِ',
  'تِ': 'تا زیر تِ',
  'ٹِ': 'ٹے زیر ٹِ',
  'ثِ': 'ثا زیر ثِ',
  'جِ': 'جیم زیر جِ',
  'چِ': 'چے زیر چِ',
  'حِ': 'حا زیر حِ',
  'خِ': 'خا زیر خِ',
  'دِ': 'دال زیر دِ',
  'ڈِ': 'ڈال زیر ڈِ',
  'ذِ': 'ذال زیر ذِ',
  'رِ': 'را زیر رِ',
  'ڑِ': 'ڑے زیر ڑِ',
  'زِ': 'زا زیر زِ',
  'سِ': 'سین زیر سِ',
  'شِ': 'شین زیر شِ',
  'صِ': 'صاد زیر صِ',
  'ضِ': 'ضاد زیر ضِ',
  'طِ': 'طا زیر طِ',
  'ظِ': 'ظا زیر ظِ',
  'عِ': 'عین زیر عِ',
  'غِ': 'غین زیر غِ',
  'فِ': 'فا زیر فِ',
  'قِ': 'قاف زیر قِ',
  'کِ': 'کاف زیر کِ',
  'گِ': 'گاف زیر گِ',
  'لِ': 'لام زیر لِ',
  'مِ': 'میم زیر مِ',
  'نِ': 'نون زیر نِ',
  'وِ': 'واؤ زیر وِ',
  'ہِ': 'ہا زیر ہِ',
  'یِ': 'یا زیر یِ',

  // Harakat Vowels - Pesh (Damma ُ )
  'اُ': 'الف پیش اُ',
  'بُ': 'با پیش بُ',
  'پُ': 'پے پیش پُ',
  'تُ': 'تا پیش تُ',
  'ٹُ': 'ٹے پیش ٹُ',
  'ثُ': 'ثا پیش ثُ',
  'جُ': 'جیم پیش جُ',
  'چُ': 'چے پیش چُ',
  'حُ': 'حا پیش حُ',
  'خُ': 'خا پیش خُ',
  'دُ': 'دال پیش دُ',
  'ڈُ': 'ڈال پیش ڈُ',
  'ذُ': 'ذال پیش ذُ',
  'رُ': 'را پیش رُ',
  'ڑُ': 'ڑے پیش ڑُ',
  'زُ': 'زا پیش زُ',
  'سُ': 'سین پیش سُ',
  'شُ': 'شین پیش شُ',
  'صُ': 'صاد پیش صُ',
  'ضُ': 'ضاد پیش ضُ',
  'طُ': 'طا پیش طُ',
  'ظُ': 'ظا پیش ظُ',
  'عُ': 'عین پیش عُ',
  'غُ': 'غین پیش غُ',
  'فُ': 'فا پیش فُ',
  'قُ': 'قاف پیش قُ',
  'کُ': 'کاف پیش کُ',
  'گُ': 'گاف پیش گُ',
  'لُ': 'لام پیش لُ',
  'مُ': 'میم پیش مُ',
  'نُ': 'نون پیش نُ',
  'وُ': 'واؤ پیش وُ',
  'ہُ': 'ہا پیش ہُ',
  'یُ': 'یا پیش یُ',
};

// Cached Voices Management
let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };

  const unlockAudioEngine = () => {
    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    document.removeEventListener('click', unlockAudioEngine);
    document.removeEventListener('touchstart', unlockAudioEngine);
  };
  document.addEventListener('click', unlockAudioEngine, { once: true });
  document.addEventListener('touchstart', unlockAudioEngine, { once: true });
}

function getArabicVoice(): { voice: SpeechSynthesisVoice | null; lang: string } {
  if (cachedVoices.length === 0) {
    loadVoices();
  }

  const maleNames = ['maged', 'tarik', 'hassan', 'hamed', 'naayf', 'ali', 'saeed', 'youssef', 'male', 'man', 'george', 'david'];
  const femaleNames = ['laila', 'zeina', 'salma', 'female', 'woman', 'zira', 'susan', 'victoria'];

  // 1. Prioritize explicit Male Arabic regional voices (Saudi, Egyptian, UAE, etc.)
  const maleArVoice = cachedVoices.find(v => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    const isAr = lang.startsWith('ar');
    const isMale = maleNames.some(m => name.includes(m)) || (!femaleNames.some(f => name.includes(f)) && name.includes('male'));
    return isAr && isMale;
  });

  if (maleArVoice) {
    return { voice: maleArVoice, lang: maleArVoice.lang };
  }

  // 2. Search by Arabic country priority codes excluding explicit female voice names
  const preferredLangs = ['ar-sa', 'ar-eg', 'ar-ae', 'ar-qa', 'ar-kw', 'ar-jo', 'ar-bh', 'ar-om', 'ar'];
  for (const langCode of preferredLangs) {
    const found = cachedVoices.find(v =>
      (v.lang.toLowerCase() === langCode || v.lang.toLowerCase().startsWith(langCode)) &&
      !femaleNames.some(f => v.name.toLowerCase().includes(f))
    );
    if (found) {
      return { voice: found, lang: found.lang };
    }
  }

  // 3. Fallback to any Arabic voice
  const arVoice = cachedVoices.find(v => v.lang.toLowerCase().startsWith('ar'));
  if (arVoice) return { voice: arVoice, lang: arVoice.lang };

  // 4. Fallback to Urdu voice
  const urVoice = cachedVoices.find(v => v.lang.toLowerCase().startsWith('ur'));
  if (urVoice) return { voice: urVoice, lang: 'ur-PK' };

  return { voice: null, lang: 'ar-SA' };
}

function getUrduVoice(): { voice: SpeechSynthesisVoice | null; lang: string } {
  if (cachedVoices.length === 0) {
    loadVoices();
  }

  const maleNames = ['maged', 'tarik', 'hassan', 'hamed', 'naayf', 'ali', 'saeed', 'youssef', 'male', 'man', 'david'];
  const femaleNames = ['laila', 'zeina', 'salma', 'female', 'woman', 'zira', 'susan'];

  // 1. Prefer explicit Male Urdu voice
  const urMaleVoice = cachedVoices.find(v => {
    const name = v.name.toLowerCase();
    const lang = v.lang.toLowerCase();
    return lang.startsWith('ur') && (maleNames.some(m => name.includes(m)) || !femaleNames.some(f => name.includes(f)));
  });
  if (urMaleVoice) return { voice: urMaleVoice, lang: 'ur-PK' };

  const urVoice = cachedVoices.find(v => v.lang.toLowerCase().startsWith('ur'));
  if (urVoice) return { voice: urVoice, lang: 'ur-PK' };

  // 2. Fallback to Male Arabic voice
  const arVoice = cachedVoices.find(v => v.lang.toLowerCase().startsWith('ar'));
  if (arVoice) return { voice: arVoice, lang: 'ar-SA' };

  return { voice: null, lang: 'ur-PK' };
}

// Speech & Audio Synthesis for Arabic & Urdu Letters & Words with Native Google TTS & Speech Engines
import { qaidaAudio } from './audioManager';
import { voiceManager } from './voiceManager';

export function speakArabic(text: string, onEnd?: () => void) {
  if (soundFx.getMute()) return;
  if (typeof window === 'undefined') return;

  const trimmed = text.trim();
  const isLetter = trimmed.length <= 2;

  // Primary: Use qaidaAudio + VoiceManager for native Google TTS & IndexedDB caching
  try {
    qaidaAudio.playItem(trimmed, isLetter, onEnd);
  } catch {
    voiceManager.speakArabic(trimmed, URDU_LETTER_PHONETIC_MAP, onEnd);
  }
}

export function speakEnglishOrUrdu(text: string, isUrdu: boolean = false, onEnd?: () => void) {
  if (soundFx.getMute()) return;
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.85;
  utter.pitch = 0.78; // Deep male voice pitch for instructions and prompts

  if (isUrdu) {
    const { voice, lang } = getUrduVoice();
    if (voice) utter.voice = voice;
    utter.lang = lang;
  } else {
    if (cachedVoices.length === 0) loadVoices();
    const enMaleVoice = cachedVoices.find(v =>
      v.lang.toLowerCase().startsWith('en') &&
      (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('alex') || v.name.toLowerCase().includes('daniel'))
    );
    const enVoice = enMaleVoice || cachedVoices.find(v => v.lang.toLowerCase().startsWith('en'));
    if (enVoice) utter.voice = enVoice;
    utter.lang = 'en-US';
  }

  if (onEnd) {
    utter.onend = onEnd;
    utter.onerror = onEnd;
  }

  window.speechSynthesis.speak(utter);
}

// Speech Recognition for Child Pronunciation Check
export interface VoiceRecognitionResult {
  isSupported: boolean;
  transcript: string;
  isMatch: boolean;
  score: number; // 0 to 100
  feedback: string;
}

export class ChildVoiceChecker {
  private recognition: unknown = null;

  constructor() {
    const SpeechRec = (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition || 
                      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    if (SpeechRec) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rec = new (SpeechRec as any)();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'ar-SA';
      this.recognition = rec;
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(expectedWord: string, callback: (result: VoiceRecognitionResult) => void) {
    if (!this.recognition) {
      callback({
        isSupported: false,
        transcript: '',
        isMatch: false,
        score: 0,
        feedback: 'Voice recognition not supported in this browser.',
      });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = this.recognition as any;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.trim();
      const confidence = event.results[0][0].confidence || 0.85;

      // Basic similarity check
      const normalizedExp = expectedWord.trim().toLowerCase();
      const normalizedTrans = transcript.toLowerCase();

      const isExact = normalizedTrans.includes(normalizedExp) || normalizedExp.includes(normalizedTrans);
      const score = isExact ? Math.round(confidence * 100) : 65;

      let feedback = 'Excellent Pronunciation! ⭐⭐⭐';
      if (score < 50) {
        feedback = 'Good try! Keep listening and say it out loud again! 🌟';
      } else if (score < 80) {
        feedback = 'Great job! Almost perfect! 🎈';
      }

      callback({
        isSupported: true,
        transcript,
        isMatch: isExact || score > 60,
        score,
        feedback,
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onerror = (err: any) => {
      callback({
        isSupported: true,
        transcript: '',
        isMatch: false,
        score: 0,
        feedback: `Speak clearly into the microphone. (${err.error || 'Retry'})`,
      });
    };

    try {
      rec.start();
    } catch {
      // May fail if already listening
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this.recognition as any).stop();
      } catch {
        // ignore
      }
    }
  }
}

export const voiceChecker = new ChildVoiceChecker();
