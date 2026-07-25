export interface LetterItem {
  id: string;
  letter: string; // e.g. "ا"
  nameUrdu: string; // e.g. "الف"
  nameEnglish: string; // e.g. "Alif"
  makhrajGroup: 'throat' | 'tongue-deep' | 'tongue-center' | 'tongue-tip' | 'lips' | 'nose';
  makhrajDesc: string; // e.g. "Emitted from the empty space in the mouth and throat"
  pictureWordUrdu: string; // e.g. "الله"
  pictureWordEnglish: string; // e.g. "Allah"
  pictureTranslation: string; // e.g. "God / Allah"
  iconType: string; // e.g. "mosque", "bismillah", "fan", "lock", "cap", "fruit", "jug", "knife", "pool", "letter", "inkpot", "box", "atom", "coin", "ladder", "apple", "bottle", "pitcher", "pistol", "utensils", "glasses", "balloon", "fountain", "pen", "chair", "glass", "top", "tap", "page", "plough", "cart";
  strokePathSvg?: string;
  exampleWords?: string[];
  transliteration?: string;
}

export type LessonCategory = 
  | 'alphabet' 
  | 'compound' 
  | 'vowels_zabar' 
  | 'vowels_zer' 
  | 'vowels_pesh' 
  | 'mashq_vowels' 
  | 'sukoon_jazm' 
  | 'madd_long' 
  | 'joining_two' 
  | 'word_building' 
  | 'advanced_reading';

export interface QaidaWord {
  id: string;
  arabic: string;
  urdu: string;
  english: string;
  breakdown?: string[]; // e.g. ["د", "ا", "د", "ا"]
  audioKey?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'mcq_letter' | 'mcq_picture' | 'listen_select' | 'drag_match' | 'voice_pronounce';
  prompt: string;
  audioText?: string;
  targetLetter?: string;
  optionsLetter?: string[];
  optionsPicture?: { wordUrdu: string; wordEnglish: string; iconType: string }[];
  correctAnswer: string | number;
  explanation?: string;
}

export interface Lesson {
  id: number; // 1 to 12
  sabaqNumber: number;
  titleUrdu: string;
  titleEnglish: string;
  description: string;
  category: LessonCategory;
  pagesCovered: string; // e.g. "Pages 4 - 10"
  items?: LetterItem[];
  words?: QaidaWord[];
  quizQuestions: QuizQuestion[];
  bgGradient: string;
  accentColor: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProfile {
  name: string;
  avatar: {
    color: string;
    hat: 'none' | 'crown' | 'turban' | 'cap' | 'star';
    expression: 'happy' | 'excited' | 'smart';
  };
  coins: number;
  stars: number;
  streak: number;
  lastLoginDate: string;
  currentLessonId: number;
  unlockedLessonIds: number[];
  lessonScores: Record<number, number>; // lessonId -> percentage 0..100
  lessonStars: Record<number, number>; // lessonId -> 1..3
  weakLetters: string[];
  totalQuizzesCompleted: number;
  timeSpentMinutes: number;
}

export interface StudentRecord {
  id: string;
  name: string;
  avatarColor: string;
  completedLessons: number;
  accuracy: number;
  timeSpentMinutes: number;
  lastActive: string;
  attendance: Record<string, boolean>; // date string -> present
  notes: string;
}
