// Production-quality Native Arabic Audio Manager for Noorani Qaida
// Maps every letter, word, picture, and phrase to recorded native audio assets with instant preloading

import { voiceManager } from './voiceManager';

export interface AudioAssetMap {
  letters: Record<string, string>;
  words: Record<string, string>;
}

// 1. Direct file mapping to local audio assets in /public/audio/
export const AUDIO_ASSETS: AudioAssetMap = {
  letters: {
    'ا': '/audio/letters/alif.mp3',
    'ب': '/audio/letters/ba.mp3',
    'پ': '/audio/letters/pe.mp3',
    'ت': '/audio/letters/ta.mp3',
    'ٹ': '/audio/letters/tte.mp3',
    'ث': '/audio/letters/sa.mp3',
    'ج': '/audio/letters/jeem.mp3',
    'چ': '/audio/letters/che.mp3',
    'ح': '/audio/letters/ha.mp3',
    'خ': '/audio/letters/kha.mp3',
    'د': '/audio/letters/dal.mp3',
    'ڈ': '/audio/letters/ddal.mp3',
    'ذ': '/audio/letters/zal.mp3',
    'ر': '/audio/letters/ra.mp3',
    'ڑ': '/audio/letters/rra.mp3',
    'ز': '/audio/letters/za.mp3',
    'ژ': '/audio/letters/zha.mp3',
    'س': '/audio/letters/seen.mp3',
    'ش': '/audio/letters/sheen.mp3',
    'ص': '/audio/letters/saad.mp3',
    'ض': '/audio/letters/zaad.mp3',
    'ط': '/audio/letters/toa.mp3',
    'ظ': '/audio/letters/zoa.mp3',
    'ع': '/audio/letters/ain.mp3',
    'غ': '/audio/letters/ghain.mp3',
    'ف': '/audio/letters/fea.mp3',
    'ق': '/audio/letters/qaaf.mp3',
    'ک': '/audio/letters/kaaf.mp3',
    'گ': '/audio/letters/gaaf.mp3',
    'ل': '/audio/letters/laam.mp3',
    'م': '/audio/letters/meem.mp3',
    'ن': '/audio/letters/noon.mp3',
    'و': '/audio/letters/waw.mp3',
    'ہ': '/audio/letters/hea.mp3',
    'ء': '/audio/letters/hamza.mp3',
    'ی': '/audio/letters/yea.mp3',
    'ے': '/audio/letters/bari_yea.mp3',
  },
  words: {
    'اللہ': '/audio/words/allah.mp3',
    'الله': '/audio/words/allah.mp3',
    'بسم اللہ': '/audio/words/bismillah.mp3',
    'بسم الله': '/audio/words/bismillah.mp3',
    'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ': '/audio/words/bismillah.mp3',
    'پنکھا': '/audio/words/pankha.mp3',
    'تالا': '/audio/words/tala.mp3',
    'ٹوپی': '/audio/words/topi.mp3',
    'ثمر (پھل)': '/audio/words/samar.mp3',
    'جگ': '/audio/words/jug.mp3',
    'چابی': '/audio/words/chaabi.mp3',
    'حقہ': '/audio/words/huqqa.mp3',
    'خیمہ': '/audio/words/kheema.mp3',
    'دوات': '/audio/words/dawaat.mp3',
    'ڈول': '/audio/words/ddol.mp3',
    'ذخیرہ': '/audio/words/zakheera.mp3',
    'روزا': '/audio/words/roza.mp3',
    'پہاڑ': '/audio/words/pahar.mp3',
    'زرافہ': '/audio/words/zeraf.mp3',
    'ژالہ باری': '/audio/words/zhala.mp3',
    'سیب': '/audio/words/seab.mp3',
    'شیر': '/audio/words/surt.mp3',
    'صراحی': '/audio/words/surahi.mp3',
    'ضعیف': '/audio/words/zaeef.mp3',
    'طوطا': '/audio/words/tooti.mp3',
    'ظروف': '/audio/words/zuroof.mp3',
    'عینک': '/audio/words/ainak.mp3',
    'غبارہ': '/audio/words/gubar.mp3',
    'فوارہ': '/audio/words/fawara.mp3',
    'قلم': '/audio/words/qalam.mp3',
    'کرسی': '/audio/words/kursi.mp3',
    'گائے': '/audio/words/gaaye.mp3',
    'لوٹا': '/audio/words/lota.mp3',
    'مسجد': '/audio/words/masjid.mp3',
    'نل': '/audio/words/nal.mp3',
    'وردہ': '/audio/words/warda.mp3',
    'ہرن': '/audio/words/hiran.mp3',
    'یاقوت': '/audio/words/yaqoot.mp3',
  },
};

// Standard Classical Arabic / Native Qaida Pronunciation Phonics Map
export const NATIVE_ARABIC_PHONETICS: Record<string, string> = {
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

  // Islamic & Qaida Words
  'اللہ': 'اللّٰه',
  'الله': 'اللّٰه',
  'بسم اللہ': 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
  'بسم الله': 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
  'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ': 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
  'Bismillah': 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
  'bismillah': 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
};

class QaidaAudioManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private currentlyPlaying: HTMLAudioElement | null = null;
  private preloaded = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.preloadAll();
    }
  }

  // Preload all letter and word audio files into memory for 0ms delay instant playback
  public preloadAll() {
    if (this.preloaded || typeof window === 'undefined') return;
    this.preloaded = true;

    // Preload letters
    Object.entries(AUDIO_ASSETS.letters).forEach(([letter, src]) => {
      try {
        const audio = new Audio(src);
        audio.preload = 'auto';
        this.audioCache.set(`letter:${letter}`, audio);
      } catch {
        // Fallback handled during play
      }
    });

    // Preload words
    Object.entries(AUDIO_ASSETS.words).forEach(([word, src]) => {
      try {
        const audio = new Audio(src);
        audio.preload = 'auto';
        this.audioCache.set(`word:${word}`, audio);
      } catch {
        // Fallback handled during play
      }
    });
  }

  // Stop active playback immediately
  public stopCurrent() {
    if (this.currentlyPlaying) {
      try {
        this.currentlyPlaying.pause();
        this.currentlyPlaying.currentTime = 0;
      } catch {
        // Ignore
      }
      this.currentlyPlaying = null;
    }
    voiceManager.stop();
  }

  // Play native recorded audio file or fallback to VoiceManager high quality native Arabic AI stream
  public playItem(textKey: string, isLetter: boolean = false, onEnd?: () => void) {
    this.stopCurrent();

    const trimmed = textKey.trim();
    const cacheKey = isLetter ? `letter:${trimmed}` : `word:${trimmed}`;
    const cachedAudio = this.audioCache.get(cacheKey) || this.audioCache.get(`letter:${trimmed}`) || this.audioCache.get(`word:${trimmed}`);

    if (cachedAudio) {
      this.currentlyPlaying = cachedAudio;
      cachedAudio.currentTime = 0;

      cachedAudio.onended = () => {
        this.currentlyPlaying = null;
        if (onEnd) onEnd();
      };

      cachedAudio.onerror = () => {
        voiceManager.speakArabic(trimmed, NATIVE_ARABIC_PHONETICS, onEnd);
      };

      const promise = cachedAudio.play();
      if (promise !== undefined) {
        promise.catch(() => voiceManager.speakArabic(trimmed, NATIVE_ARABIC_PHONETICS, onEnd));
      }
    } else {
      voiceManager.speakArabic(trimmed, NATIVE_ARABIC_PHONETICS, onEnd);
    }
  }
}

export const qaidaAudio = new QaidaAudioManager();
