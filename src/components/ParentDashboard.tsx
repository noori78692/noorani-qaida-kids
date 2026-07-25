import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award, Clock, Star, AlertTriangle, Printer, RotateCcw, X, BookOpen, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { ALL_LESSONS } from '../data/qaidaData';

interface ParentDashboardProps {
  userProfile: UserProfile;
  onResetProgress: () => void;
  onClose: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  userProfile,
  onResetProgress,
  onClose,
}) => {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState('');

  const completedCount = userProfile.unlockedLessonIds.length;
  const progressPercent = Math.round((completedCount / ALL_LESSONS.length) * 100);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin === '7860') {
      setIsUnlocked(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN (Default parent PIN: 1234)');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-slate-300 w-full max-w-2xl my-8 relative text-gray-800"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!isUnlocked ? (
          /* Parent Gate PIN Check */
          <div className="text-center py-8 max-w-sm mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-700 shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-1">Parent Gate</h3>
            <p className="text-xs text-gray-500 mb-6">Enter PIN to access detailed learning progress and reports. (Default PIN: 1234)</p>

            <form onSubmit={handleUnlock} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={e => setPin(e.target.value)}
                placeholder="1234"
                className="w-full text-center text-3xl font-extrabold tracking-widest p-3 rounded-2xl border-2 border-slate-300 focus:border-amber-500 focus:outline-none"
              />
              {pinError && <p className="text-xs text-rose-600 font-bold">{pinError}</p>}
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3.5 rounded-2xl shadow transition"
              >
                Unlock Parent Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Main Parent Dashboard */
          <div>
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Parent Analytics & Report</h2>
                <p className="text-xs text-slate-500 font-medium">Noorani Qaida Learning Summary for {userProfile.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-2xl text-xs font-bold transition"
                >
                  <Printer className="w-4 h-4" /> Print PDF Report
                </button>
              </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-center">
                <BookOpen className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <span className="block text-2xl font-black text-amber-900">{completedCount} / {ALL_LESSONS.length}</span>
                <span className="text-[10px] font-bold text-amber-700 uppercase">Completed Lessons</span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center">
                <Star className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <span className="block text-2xl font-black text-emerald-900">{userProfile.stars}</span>
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Total Stars</span>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-center">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <span className="block text-2xl font-black text-blue-900">{userProfile.timeSpentMinutes} mins</span>
                <span className="text-[10px] font-bold text-blue-700 uppercase">Total Time Spent</span>
              </div>

              <div className="bg-purple-50 border border-purple-200 p-4 rounded-2xl text-center">
                <Award className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <span className="block text-2xl font-black text-purple-900">{userProfile.streak} Days</span>
                <span className="text-[10px] font-bold text-purple-700 uppercase">Learning Streak</span>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-700">Course Completion Rate</span>
                <span className="text-xs font-black text-slate-900">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Lesson Breakdown List */}
            <div className="mb-6">
              <h4 className="font-bold text-sm text-slate-800 mb-3">Sabaq Progress Breakdown</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {ALL_LESSONS.map(lesson => {
                  const isCompleted = userProfile.unlockedLessonIds.includes(lesson.id);
                  const stars = userProfile.lessonStars[lesson.id] || 0;

                  return (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between bg-white border p-3 rounded-xl shadow-sm text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                        )}
                        <span className="font-bold text-slate-800">{lesson.titleEnglish}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map(s => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Danger Zone: Reset */}
            <div className="border-t pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 text-xs font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Reset Child Progress</span>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all stars and progress?')) {
                    onResetProgress();
                    alert('Progress reset successfully.');
                  }
                }}
                className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-xl text-xs font-bold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Data
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
