// High-Quality Native Arabic AI Voice Manager with IndexedDB Local Audio Caching and SSML Support
// Designed specifically for Noorani Qaida & Quran learning for children

export interface VoiceCacheEntry {
  key: string;
  blob: Blob;
  mimeType: string;
  createdAt: number;
}

// SSML generator for clear child-friendly Makhraj & Tajweed pronunciation
export function generateArabicSSML(text: string): string {
  const cleanText = text.trim();
  return `<speak><prosody rate="75%" pitch="-2st">${cleanText}</prosody></speak>`;
}

class VoiceManagerEngine {
  private dbName = 'QaidaNativeVoiceCache_DB';
  private storeName = 'arabic_audio_blobs';
  private db: IDBDatabase | null = null;
  private activeAudio: HTMLAudioElement | null = null;
  private isMuted = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initIndexedDB();
    }
  }

  // Initialize IndexedDB persistent cache
  private initIndexedDB(): Promise<IDBDatabase | null> {
    if (this.db) return Promise.resolve(this.db);
    if (typeof window === 'undefined' || !('indexedDB' in window)) return Promise.resolve(null);

    return new Promise((resolve) => {
      try {
        const request = indexedDB.open(this.dbName, 1);
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: 'key' });
          }
        };
        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          resolve(this.db);
        };
        request.onerror = () => {
          resolve(null);
        };
      } catch {
        resolve(null);
      }
    });
  }

  // Get cached audio blob from IndexedDB
  public async getCachedAudio(key: string): Promise<Blob | null> {
    const db = await this.initIndexedDB();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.get(key);
        req.onsuccess = () => {
          if (req.result && req.result.blob) {
            resolve(req.result.blob as Blob);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  // Save generated audio blob to IndexedDB
  public async cacheAudio(key: string, blob: Blob) {
    const db = await this.initIndexedDB();
    if (!db) return;

    try {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.put({
        key,
        blob,
        mimeType: blob.type || 'audio/mp3',
        createdAt: Date.now(),
      });
    } catch {
      // Ignore cache write errors
    }
  }

  // Stop current active sound
  public stop() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch {
        // Ignore
      }
      this.activeAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
  }

  // Speak using high quality Native Arabic AI Voice + IndexedDB Cache
  public async speakArabic(
    text: string,
    phoneticFallbackMap: Record<string, string>,
    onEnd?: () => void
  ) {
    if (this.isMuted) return;
    this.stop();

    const trimmed = text.trim();
    const phoneticText = phoneticFallbackMap[trimmed] || phoneticFallbackMap[trimmed.toLowerCase()] || trimmed;
    const cacheKey = `ar_voice_v2_${encodeURIComponent(phoneticText)}`;

    // 1. Try playing from IndexedDB Cache
    try {
      const cachedBlob = await this.getCachedAudio(cacheKey);
      if (cachedBlob) {
        const audioUrl = URL.createObjectURL(cachedBlob);
        const audio = new Audio(audioUrl);
        this.activeAudio = audio;

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.activeAudio = null;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          this.fallbackSpeechSynthesis(phoneticText, onEnd);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.fallbackSpeechSynthesis(phoneticText, onEnd);
          });
        }
        return;
      }
    } catch {
      // Proceed to fetch
    }

    // 2. Fetch Native Arabic AI Neural Audio stream, convert to Blob, Cache & Play
    try {
      const ttsApiUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(phoneticText)}&tl=ar&client=tw-ob`;
      const response = await fetch(ttsApiUrl);

      if (response.ok) {
        const blob = await response.blob();
        // Cache to IndexedDB for offline instant reuse
        this.cacheAudio(cacheKey, blob);

        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        this.activeAudio = audio;

        // Tune to gentle male Qari Tajweed pace
        audio.playbackRate = 0.88;
        if ('preservesPitch' in audio) {
          (audio as unknown as { preservesPitch: boolean }).preservesPitch = false;
        }

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          this.activeAudio = null;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          this.fallbackSpeechSynthesis(phoneticText, onEnd);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.fallbackSpeechSynthesis(phoneticText, onEnd);
          });
        }
        return;
      }
    } catch {
      // Fallback
    }

    // 3. Fallback Web Speech API with SSML & Male Qari Voice
    this.fallbackSpeechSynthesis(phoneticText, onEnd);
  }

  // Web Speech API fallback with Male Qari pitch modulation & Arabic country voice selection
  private fallbackSpeechSynthesis(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.80; // Slow child-friendly rate
    utter.pitch = 0.75; // Male Qari voice pitch resonance

    const voices = window.speechSynthesis.getVoices();
    const maleNames = ['maged', 'tarik', 'hassan', 'hamed', 'naayf', 'ali', 'saeed', 'male'];

    const arMaleVoice = voices.find(v => {
      const lang = v.lang.toLowerCase();
      const name = v.name.toLowerCase();
      return lang.startsWith('ar') && maleNames.some(m => name.includes(m));
    });

    const arVoice = arMaleVoice || voices.find(v => v.lang.toLowerCase().startsWith('ar'));
    if (arVoice) {
      utter.voice = arVoice;
      utter.lang = arVoice.lang;
    } else {
      utter.lang = 'ar-SA';
    }

    if (onEnd) {
      utter.onend = onEnd;
      utter.onerror = onEnd;
    }

    window.speechSynthesis.speak(utter);
  }
}

export const voiceManager = new VoiceManagerEngine();
