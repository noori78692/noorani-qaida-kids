/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Sparkles,
  Award,
  Volume2,
  VolumeX,
  Lock,
  Star,
  CheckCircle2,
  Play,
  Grid,
  Edit3,
  Gamepad2,
  Users,
  Shield,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft,
  Search,
  Mic,
} from 'lucide-react';

import { UserProfile, Lesson, LetterItem } from './types';
import { ALL_LESSONS, ALL_LETTERS } from './data/qaidaData';
import { LetterIllustration } from './components/LetterIllustration';
import { LetterTracing } from './components/LetterTracing';
import { MakhrajGuide } from './components/MakhrajGuide';
import { WordBuilder } from './components/practice/WordBuilder';
import { MemoryGame } from './components/practice/MemoryGame';
import { VoicePracticeModal } from './components/practice/VoicePracticeModal';
import { QuizModal } from './components/QuizModal';
import { ParentDashboard } from './components/ParentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { MascotGuide } from './components/MascotGuide';
import { soundFx, speakArabic } from './utils/audioSystem';

const INITIAL_PROFILE: UserProfile = {
  name: 'Little Scholar',
  avatar: {
    color: 'bg-amber-400',
    hat: 'crown',
    expression: 'happy',
  },
  coins: 150,
  stars: 12,
  streak: 3,
  lastLoginDate: new Date().toISOString().split('T')[0],
  currentLessonId: 1,
  unlockedLessonIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // All unlocked for full exploration!
  lessonScores: { 1: 100, 2: 90 },
  lessonStars: { 1: 3, 2: 3 },
  weakLetters: [],
  totalQuizzesCompleted: 2,
  timeSpentMinutes: 45,
};

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'lessons' | 'alphabet' | 'tracing' | 'games' | 'parent' | 'teacher'>('lessons');

  // User State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('noorani_qaida_user_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PROFILE;
      }
    }
    return INITIAL_PROFILE;
  });

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem('noorani_qaida_user_v1', JSON.stringify(userProfile));
  }, [userProfile]);

  // Audio mute state
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Active Lesson State
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [lessonSubTab, setLessonSubTab] = useState<'read' | 'trace' | 'makhraj' | 'game' | 'quiz'>('read');
  const [selectedLetterItem, setSelectedLetterItem] = useState<LetterItem>(ALL_LETTERS[0]);

  // Modals
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showParentDashboard, setShowParentDashboard] = useState(false);
  const [showTeacherDashboard, setShowTeacherDashboard] = useState(false);

  // Alphabet search filter
  const [alphabetSearch, setAlphabetSearch] = useState('');

  const activeLesson: Lesson = ALL_LESSONS.find(l => l.id === selectedLessonId) || ALL_LESSONS[0];

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundFx.setMute(nextMute);
  };

  const handleUpdateAvatarHat = (hat: UserProfile['avatar']['hat']) => {
    setUserProfile(prev => ({
      ...prev,
      avatar: { ...prev.avatar, hat },
    }));
  };

  const handleQuizComplete = (starsEarned: number, scorePercent: number) => {
    if (!selectedLessonId) return;

    setUserProfile(prev => {
      const currentStars = prev.lessonStars[selectedLessonId] || 0;
      const nextStars = Math.max(currentStars, starsEarned);
      const nextUnlocked = Array.from(new Set([...prev.unlockedLessonIds, selectedLessonId + 1]));

      return {
        ...prev,
        coins: prev.coins + starsEarned * 25,
        stars: prev.stars + (starsEarned > currentStars ? starsEarned - currentStars : 0),
        unlockedLessonIds: nextUnlocked,
        lessonScores: { ...prev.lessonScores, [selectedLessonId]: scorePercent },
        lessonStars: { ...prev.lessonStars, [selectedLessonId]: nextStars },
        totalQuizzesCompleted: prev.totalQuizzesCompleted + 1,
      };
    });

    setShowQuizModal(false);
  };

  const handleResetProgress = () => {
    setUserProfile(INITIAL_PROFILE);
    localStorage.removeItem('noorani_qaida_user_v1');
  };

  const filteredLetters = ALL_LETTERS.filter(
    item =>
      item.nameEnglish.toLowerCase().includes(alphabetSearch.toLowerCase()) ||
      item.nameUrdu.includes(alphabetSearch) ||
      item.letter.includes(alphabetSearch) ||
      item.pictureWordUrdu.includes(alphabetSearch) ||
      item.pictureWordEnglish.toLowerCase().includes(alphabetSearch.toLowerCase())
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans pb-16 select-none ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-sky-50 text-indigo-950'
    }`}>
      {/* Top Navigation Header - Vibrant Palette style */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b-4 border-indigo-100 dark:border-slate-800 shadow-sm px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Branding */}
          <div
            onClick={() => setSelectedLessonId(null)}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-13 h-13 rounded-2xl bg-amber-400 border-4 border-amber-200 flex items-center justify-center text-indigo-950 font-black text-2xl shadow-md transform rotate-3 group-hover:rotate-6 group-hover:scale-105 transition-all shrink-0">
              ق
            </div>
            <div>
              <h1 className="font-black text-xl sm:text-2xl text-indigo-900 dark:text-white tracking-tight flex items-center gap-2 leading-none">
                Noorani Kids <Sparkles className="w-5 h-5 text-amber-400 fill-amber-300 animate-pulse" />
              </h1>
              <p className="text-[11px] font-bold text-sky-500 dark:text-sky-400 uppercase tracking-widest hidden sm:block mt-1">
                Interactive Qaida App
              </p>
            </div>
          </div>

          {/* Center Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-indigo-50/80 dark:bg-slate-800 p-1.5 rounded-full border-2 border-indigo-100/80 dark:border-slate-700">
            {[
              { id: 'lessons', label: '📖 Lessons', icon: BookOpen },
              { id: 'alphabet', label: '🔤 Alphabet', icon: Grid },
              { id: 'tracing', label: '✏️ Tracing', icon: Edit3 },
              { id: 'games', label: '🎮 Games', icon: Gamepad2 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  setSelectedLessonId(null);
                  soundFx.playChime();
                }}
                className={`px-5 py-2 rounded-full font-black text-xs transition-all ${
                  activeTab === tab.id && selectedLessonId === null
                    ? 'bg-indigo-500 text-white shadow-md border-b-2 border-indigo-700'
                    : 'text-indigo-900 dark:text-slate-300 font-extrabold hover:bg-indigo-100/50 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons with 3D bottom borders */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowParentDashboard(true)}
              className="w-10 h-10 sm:w-11 sm:h-11 bg-white dark:bg-slate-800 text-indigo-900 dark:text-white rounded-2xl flex items-center justify-center shadow-md border-b-4 border-indigo-200 dark:border-slate-700 active:border-b-0 transition hover:bg-indigo-50"
              title="Parent Dashboard"
            >
              <Shield className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowTeacherDashboard(true)}
              className="w-10 h-10 sm:w-11 sm:h-11 bg-white dark:bg-slate-800 text-indigo-900 dark:text-white rounded-2xl flex items-center justify-center shadow-md border-b-4 border-indigo-200 dark:border-slate-700 active:border-b-0 transition hover:bg-indigo-50"
              title="Teacher Mode"
            >
              <Users className="w-5 h-5" />
            </button>

            <button
              onClick={toggleMute}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-md border-b-4 transition active:border-b-0 ${
                isMuted
                  ? 'bg-rose-400 text-white border-rose-600'
                  : 'bg-emerald-400 text-white border-emerald-600'
              }`}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-10 h-10 sm:w-11 sm:h-11 bg-indigo-50 dark:bg-slate-800 text-indigo-900 dark:text-amber-300 rounded-2xl flex items-center justify-center shadow-md border-b-4 border-indigo-200 dark:border-slate-700 active:border-b-0 transition"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 mt-4">
        {/* Mascot & Progress Bar Header */}
        <MascotGuide userProfile={userProfile} onUpdateAvatar={handleUpdateAvatarHat} />

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto gap-2 my-3 pb-2 scrollbar-none">
          {[
            { id: 'lessons', label: '📖 Lessons' },
            { id: 'alphabet', label: '🔤 Alphabet' },
            { id: 'tracing', label: '✏️ Tracing' },
            { id: 'games', label: '🎮 Mini Games' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                setSelectedLessonId(null);
              }}
              className={`px-4 py-2 rounded-2xl font-black text-xs whitespace-nowrap transition border-b-4 active:border-b-0 ${
                activeTab === tab.id && selectedLessonId === null
                  ? 'bg-indigo-500 text-white border-indigo-700 shadow-md'
                  : 'bg-white dark:bg-slate-800 text-indigo-900 dark:text-slate-200 border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- VIEW 1: LESSON DETAILS (Inside a specific Sabaq) --- */}
        {selectedLessonId !== null ? (
          <div>
            {/* Back Button & Title */}
            <div className="flex items-center justify-between my-4">
              <button
                onClick={() => setSelectedLessonId(null)}
                className="flex items-center gap-1.5 bg-white dark:bg-slate-800 hover:bg-sky-100 text-indigo-900 dark:text-slate-200 px-4 py-2.5 rounded-2xl font-black text-xs shadow-md border-b-4 border-indigo-200 dark:border-slate-700 active:border-b-0 transition"
              >
                <ChevronLeft className="w-4 h-4" /> All Sabaq Lessons
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-indigo-900 dark:text-sky-300 bg-indigo-50 dark:bg-slate-800 border-2 border-indigo-100 dark:border-slate-700 px-3.5 py-1.5 rounded-full">
                  {activeLesson.pagesCovered}
                </span>
                <button
                  onClick={() => setShowQuizModal(true)}
                  className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-5 py-2.5 rounded-2xl text-xs shadow-md border-b-4 border-emerald-700 active:border-b-0 transition hover:scale-105"
                >
                  <Award className="w-4 h-4" /> Take Quiz
                </button>
              </div>
            </div>

            {/* Sabaq Banner Card */}
            <div className="bg-indigo-500 text-white rounded-[36px] p-6 sm:p-8 shadow-xl mb-6 relative overflow-hidden border-b-8 border-indigo-700">
              <div className="max-w-2xl relative z-10">
                <span className="bg-amber-400 text-indigo-950 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-3 inline-block shadow border-2 border-amber-200">
                  Sabaq {activeLesson.sabaqNumber}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black mb-2" dir="rtl">{activeLesson.titleUrdu}</h2>
                <h3 className="text-lg font-bold opacity-90 mb-3">{activeLesson.titleEnglish}</h3>
                <p className="text-xs sm:text-sm font-medium opacity-90 leading-relaxed">
                  {activeLesson.description}
                </p>
              </div>
            </div>

            {/* Sub-Tab Navigation Bar with 3D bottom borders */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {[
                { id: 'read', label: '📖 Reading Practice' },
                { id: 'trace', label: '✏️ Letter Tracing' },
                { id: 'makhraj', label: '🔊 Makhraj Visualizer' },
                { id: 'game', label: '🧩 Mini Game' },
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setLessonSubTab(sub.id as typeof lessonSubTab)}
                  className={`px-5 py-2.5 rounded-2xl font-black text-xs shadow-md border-b-4 transition active:border-b-0 ${
                    lessonSubTab === sub.id
                      ? 'bg-indigo-500 text-white border-indigo-700'
                      : 'bg-white dark:bg-slate-800 text-indigo-900 dark:text-slate-200 border-indigo-100 dark:border-slate-700 hover:bg-sky-100'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* --- SUB TAB 1: READ --- */}
            {lessonSubTab === 'read' && (
              <div dir="rtl">
                {/* Sabaq 1 - Isolated Letters with Cartoon Pictures (Right to Left flow) */}
                {activeLesson.items && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" dir="rtl">
                    {activeLesson.items.map(item => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.04, y: -3 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          setSelectedLetterItem(item);
                          soundFx.playChime();
                          speakArabic(item.letter);
                        }}
                        className={`bg-white dark:bg-slate-800 rounded-[28px] p-4 shadow-lg border-b-8 transition-all cursor-pointer flex flex-col items-center justify-between text-center relative ${
                          selectedLetterItem.id === item.id
                            ? 'border-indigo-500 ring-4 ring-indigo-200 dark:ring-indigo-900 shadow-2xl'
                            : 'border-indigo-100 dark:border-slate-700 hover:border-indigo-300'
                        }`}
                      >
                        {/* Audio Tap Trigger for Letter */}
                        <div className="w-full flex justify-between items-center text-indigo-500 mb-1" dir="ltr">
                          <span className="text-[10px] font-black uppercase text-indigo-400">{item.nameEnglish}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakArabic(item.letter);
                            }}
                            className="p-1 rounded-full hover:bg-indigo-50 dark:hover:bg-slate-700 text-indigo-600"
                            title="Play Letter Audio"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Large Letter */}
                        <div className="my-2">
                          <span className="text-5xl font-black text-indigo-900 dark:text-white" dir="rtl">{item.letter}</span>
                        </div>

                        {/* Picture Illustration */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            speakArabic(item.pictureWordUrdu);
                          }}
                          className="w-full bg-indigo-50/70 dark:bg-slate-700/50 rounded-2xl p-2 mt-2 flex flex-col items-center border-2 border-indigo-100 dark:border-slate-600"
                          title="Tap picture to speak word!"
                        >
                          <LetterIllustration iconType={item.iconType} size={72} />
                          <span className="font-black text-sm text-indigo-950 dark:text-slate-100 mt-1" dir="rtl">
                            {item.pictureWordUrdu}
                          </span>
                          <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400" dir="ltr">
                            {item.pictureWordEnglish}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Sabaq 2-12 - Word/Phrase Grid (Right to Left flow) */}
                {activeLesson.words && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" dir="rtl">
                    {activeLesson.words.map(w => (
                      <motion.div
                        key={w.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          soundFx.playChime();
                          speakArabic(w.urdu);
                        }}
                        className="bg-white dark:bg-slate-800 p-6 rounded-[32px] shadow-lg border-b-8 border-indigo-100 dark:border-slate-700 flex flex-col items-center justify-between text-center cursor-pointer hover:border-indigo-300 transition-all"
                      >
                        <span className="text-4xl font-black text-indigo-950 dark:text-white my-3 tracking-wide" dir="rtl">
                          {w.arabic}
                        </span>
                        <div className="w-full border-t-2 border-indigo-50 dark:border-slate-700 pt-3 mt-2 flex items-center justify-between text-xs font-bold text-indigo-900 dark:text-slate-300" dir="ltr">
                          <span>{w.english}</span>
                          <button className="flex items-center gap-1 bg-indigo-500 text-white px-3.5 py-1.5 rounded-full font-black shadow-md border-b-2 border-indigo-700 text-xs">
                            <Play className="w-3 h-3 fill-white" /> Listen
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --- SUB TAB 2: TRACE --- */}
            {lessonSubTab === 'trace' && (
              <LetterTracing
                letter={selectedLetterItem.letter}
                nameUrdu={selectedLetterItem.nameUrdu}
                nameEnglish={selectedLetterItem.nameEnglish}
              />
            )}

            {/* --- SUB TAB 3: MAKHRAJ --- */}
            {lessonSubTab === 'makhraj' && (
              <div className="max-w-2xl mx-auto">
                <MakhrajGuide item={selectedLetterItem} />
              </div>
            )}

            {/* --- SUB TAB 4: MINI GAME --- */}
            {lessonSubTab === 'game' && (
              <div>
                {activeLesson.words ? (
                  <WordBuilder words={activeLesson.words} />
                ) : (
                  <MemoryGame letters={activeLesson.items || ALL_LETTERS.slice(0, 8)} />
                )}
              </div>
            )}
          </div>
        ) : (
          /* --- VIEW 2: HOME EXPLORER (Sabaq Grid & Features) --- */
          <div>
            {/* Header Tabs Content */}
            {activeTab === 'lessons' && (
              <div>
                <div className="flex items-center justify-between my-4">
                  <div>
                    <h2 className="text-2xl font-black text-indigo-950 dark:text-white">All Sabaq Lessons</h2>
                    <p className="text-xs text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider">
                      Complete 12 Sabaq Noorani Qaida Curriculum
                    </p>
                  </div>
                </div>

                {/* Grid of 12 Sabaq Lessons in Vibrant Palette style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
                  {ALL_LESSONS.map(lesson => {
                    const isUnlocked = userProfile.unlockedLessonIds.includes(lesson.id);
                    const stars = userProfile.lessonStars[lesson.id] || 0;

                    return (
                      <motion.div
                        key={lesson.id}
                        whileHover={{ y: -6, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (isUnlocked) {
                            setSelectedLessonId(lesson.id);
                            soundFx.playChime();
                          }
                        }}
                        className={`rounded-[32px] p-6 shadow-xl border-b-8 transition-all relative flex flex-col justify-between overflow-hidden cursor-pointer ${
                          isUnlocked
                            ? 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-slate-700 hover:border-indigo-300'
                            : 'bg-slate-100 dark:bg-slate-900 border-slate-200 opacity-70'
                        }`}
                      >
                        {/* Top Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-black bg-indigo-50 dark:bg-slate-700 text-indigo-900 dark:text-indigo-300 px-3.5 py-1 rounded-full uppercase tracking-wider border border-indigo-100 dark:border-slate-600">
                            Sabaq {lesson.sabaqNumber}
                          </span>

                          <div className="flex items-center gap-1">
                            {[1, 2, 3].map(s => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${
                                  s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div className="my-2">
                          <h3 className="text-3xl font-black text-indigo-950 dark:text-white mb-1" dir="rtl">
                            {lesson.titleUrdu}
                          </h3>
                          <h4 className="text-sm font-bold text-sky-600 dark:text-sky-400 mb-2">
                            {lesson.titleEnglish}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {lesson.description}
                          </p>
                        </div>

                        {/* Footer Action */}
                        <div className="mt-4 border-t-2 border-indigo-50 dark:border-slate-700 pt-3 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300">
                            {lesson.pagesCovered}
                          </span>

                          {isUnlocked ? (
                            <button className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-2xl font-black text-xs shadow-md border-b-4 border-indigo-700 active:border-b-0 transition">
                              Start <ChevronRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                              <Lock className="w-3.5 h-3.5" /> Locked
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* activeTab === 'alphabet' */}
            {activeTab === 'alphabet' && (
              <div>
                {/* Search Bar */}
                <div className="max-w-md mx-auto my-4 relative">
                  <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={alphabetSearch}
                    onChange={e => setAlphabetSearch(e.target.value)}
                    placeholder="Search letter, e.g. Alif, Ba, Bismillah..."
                    className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-amber-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" dir="rtl">
                  {filteredLetters.map(item => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedLetterItem(item);
                        setSelectedLessonId(1);
                        setLessonSubTab('read');
                        soundFx.playChime();
                        speakArabic(item.letter);
                      }}
                      className="bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-md border-2 border-amber-200 dark:border-slate-700 flex flex-col items-center justify-between text-center cursor-pointer hover:border-amber-400"
                    >
                      <span className="text-5xl font-black text-gray-900 dark:text-white my-2" dir="rtl">{item.letter}</span>
                      <LetterIllustration iconType={item.iconType} size={70} />
                      <span className="font-extrabold text-sm text-gray-800 dark:text-slate-200 mt-2" dir="rtl">{item.pictureWordUrdu}</span>
                      <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">{item.pictureWordEnglish}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* activeTab === 'tracing' */}
            {activeTab === 'tracing' && (
              <div>
                <LetterTracing
                  letter={selectedLetterItem.letter}
                  nameUrdu={selectedLetterItem.nameUrdu}
                  nameEnglish={selectedLetterItem.nameEnglish}
                />
              </div>
            )}

            {/* activeTab === 'games' */}
            {activeTab === 'games' && (
              <div className="space-y-8">
                <WordBuilder words={ALL_LESSONS[9].words || []} />
                <MemoryGame letters={ALL_LETTERS.slice(0, 8)} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- MODALS --- */}
      {/* Voice Recognition Modal */}
      {showVoiceModal && (
        <VoicePracticeModal
          expectedWord={selectedLetterItem.nameEnglish}
          wordUrdu={selectedLetterItem.letter}
          onClose={() => setShowVoiceModal(false)}
        />
      )}

      {/* Quiz Modal */}
      {showQuizModal && (
        <QuizModal
          lessonTitle={activeLesson.titleEnglish}
          questions={activeLesson.quizQuestions}
          onComplete={handleQuizComplete}
          onClose={() => setShowQuizModal(false)}
        />
      )}

      {/* Parent Dashboard Modal */}
      {showParentDashboard && (
        <ParentDashboard
          userProfile={userProfile}
          onResetProgress={handleResetProgress}
          onClose={() => setShowParentDashboard(false)}
        />
      )}

      {/* Teacher Dashboard Modal */}
      {showTeacherDashboard && (
        <TeacherDashboard onClose={() => setShowTeacherDashboard(false)} />
      )}
    </div>
  );
}
