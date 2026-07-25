import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Volume2, CheckCircle } from 'lucide-react';
import { QaidaWord } from '../../types';
import { soundFx, speakArabic } from '../../utils/audioSystem';
import confetti from 'canvas-confetti';

interface WordBuilderProps {
  words: QaidaWord[];
  onComplete?: () => void;
}

export const WordBuilder: React.FC<WordBuilderProps> = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentWord = words[currentIndex] || words[0];

  const targetLetters = currentWord.breakdown || currentWord.arabic.split('');
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Available letter pool (shuffled target + distractors)
  const [pool, setPool] = useState<string[]>(() => {
    const distractors = ['ا', 'ب', 'ت', 'ج', 'د', 'ر', 'س', 'م', 'ن', 'ل', 'ک'];
    const combined = [...targetLetters, ...distractors.slice(0, 3)];
    return combined.sort(() => Math.random() - 0.5);
  });

  const handleSelectLetter = (letter: string, indexInPool: number) => {
    if (isSuccess) return;

    soundFx.playChime();
    speakArabic(letter);

    const nextSelected = [...selectedLetters, letter];
    setSelectedLetters(nextSelected);

    // Remove from pool
    const newPool = [...pool];
    newPool.splice(indexInPool, 1);
    setPool(newPool);

    // Check if word is complete
    if (nextSelected.length === targetLetters.length) {
      if (nextSelected.join('') === targetLetters.join('')) {
        setIsSuccess(true);
        soundFx.playSuccessFanfare();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        speakArabic(currentWord.urdu);
      } else {
        soundFx.playErrorSound();
      }
    }
  };

  const handleResetCurrent = () => {
    setSelectedLetters([]);
    setIsSuccess(false);
    setPool([...targetLetters, 'ا', 'ب', 'م'].sort(() => Math.random() - 0.5));
  };

  const handleNextWord = () => {
    const nextIdx = (currentIndex + 1) % words.length;
    setCurrentIndex(nextIdx);
    const nextW = words[nextIdx];
    const nextTarget = nextW.breakdown || nextW.arabic.split('');
    setSelectedLetters([]);
    setIsSuccess(false);
    setPool([...nextTarget, 'ا', 'ب', 'ر', 'ل'].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-4 border-purple-200 max-w-xl mx-auto my-4 text-center">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-xs">
          Word Builder Puzzle
        </span>
        <button
          onClick={handleResetCurrent}
          className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-purple-600 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Target Word Prompt */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
        <Sparkles className="absolute top-2 right-2 w-8 h-8 text-amber-300 opacity-60" />
        <p className="text-xs font-bold uppercase tracking-widest text-purple-200 mb-1">Assemble the Word</p>
        <h3 className="text-4xl font-bold tracking-wide my-2" dir="rtl">{currentWord.urdu}</h3>
        <p className="text-sm font-medium text-purple-100">{currentWord.english}</p>

        <button
          onClick={() => speakArabic(currentWord.urdu)}
          className="mt-3 inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-1.5 rounded-full text-xs transition backdrop-blur-sm"
        >
          <Volume2 className="w-4 h-4" /> Listen Word
        </button>
      </div>

      {/* Slots to drop letters (Right to Left order) */}
      <div className="flex items-center justify-center gap-3 my-6 min-h-[70px]" dir="rtl">
        {targetLetters.map((_, idx) => (
          <div
            key={idx}
            className={`w-14 h-16 rounded-2xl border-3 flex items-center justify-center text-3xl font-bold shadow-inner transition ${
              selectedLetters[idx]
                ? 'bg-purple-500 text-white border-purple-600 shadow-md scale-105'
                : 'bg-gray-100 border-dashed border-gray-300 text-transparent'
            }`}
          >
            {selectedLetters[idx] || '_'}
          </div>
        ))}
      </div>

      {/* Letter Pool buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6" dir="rtl">
        <AnimatePresence>
          {pool.map((char, pIdx) => (
            <motion.button
              key={`${char}-${pIdx}`}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelectLetter(char, pIdx)}
              className="w-12 h-14 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-gray-900 font-extrabold text-2xl rounded-2xl shadow-md border-b-4 border-amber-600 flex items-center justify-center"
            >
              {char}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Completion Banner */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-emerald-800 flex flex-col items-center gap-2 mb-4"
        >
          <div className="flex items-center gap-2 font-bold text-lg">
            <CheckCircle className="w-6 h-6 text-emerald-600" /> Perfect Assembly!
          </div>
          <button
            onClick={handleNextWord}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-6 py-2 rounded-full text-sm shadow hover:scale-105 transition"
          >
            Next Word →
          </button>
        </motion.div>
      )}
    </div>
  );
};
