import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Volume2, Check, X, ArrowRight } from 'lucide-react';
import { QuizQuestion } from '../types';
import { LetterIllustration } from './LetterIllustration';
import { soundFx, speakArabic } from '../utils/audioSystem';
import confetti from 'canvas-confetti';

interface QuizModalProps {
  lessonTitle: string;
  questions: QuizQuestion[];
  onComplete: (starsEarned: number, scorePercent: number) => void;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  lessonTitle,
  questions,
  onComplete,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  const handleOptionSelect = (optionValue: string | number) => {
    if (isAnswered) return;

    setSelectedOption(optionValue);
    setIsAnswered(true);

    const isCorrect = optionValue === currentQ.correctAnswer;

    if (isCorrect) {
      soundFx.playChime();
      setScoreCount(s => s + 1);
    } else {
      soundFx.playErrorSound();
    }
  };

  const handlePlayAudioPrompt = () => {
    if (currentQ.audioText) {
      speakArabic(currentQ.audioText);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz Complete
      setIsFinished(true);
      const percent = Math.round((scoreCount / questions.length) * 100);
      let stars = 1;
      if (percent >= 90) stars = 3;
      else if (percent >= 60) stars = 2;

      soundFx.playSuccessFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });

      onComplete(stars, percent);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 w-full max-w-lg relative text-center"
      >
        {!isFinished ? (
          <>
            {/* Header progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                {lessonTitle}
              </span>
              <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-6">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Prompt */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{currentQ.prompt}</h3>

              {currentQ.audioText && (
                <button
                  onClick={handlePlayAudioPrompt}
                  className="mt-2 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-full text-sm shadow transition"
                >
                  <Volume2 className="w-5 h-5" /> Listen Sound
                </button>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQ.optionsLetter && (
                <div className="grid grid-cols-2 gap-3">
                  {currentQ.optionsLetter.map((opt, idx) => {
                    const isSelected = selectedOption === opt;
                    const isCorrectOpt = opt === currentQ.correctAnswer;
                    let btnStyle = 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-amber-50 hover:border-amber-300';

                    if (isAnswered) {
                      if (isCorrectOpt) btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                      else if (isSelected) btnStyle = 'bg-rose-500 text-white border-rose-600';
                    }

                    return (
                      <motion.button
                        key={idx}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOptionSelect(opt)}
                        disabled={isAnswered}
                        className={`p-4 rounded-2xl border-3 text-4xl font-black shadow-sm transition flex items-center justify-center min-h-[80px] ${btnStyle}`}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {currentQ.optionsPicture && (
                <div className="grid grid-cols-3 gap-3">
                  {currentQ.optionsPicture.map((pic, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrectOpt = idx === currentQ.correctAnswer;
                    let btnStyle = 'bg-gray-50 border-gray-200 hover:bg-amber-50';

                    if (isAnswered) {
                      if (isCorrectOpt) btnStyle = 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-400';
                      else if (isSelected) btnStyle = 'bg-rose-100 border-rose-500';
                    }

                    return (
                      <motion.button
                        key={idx}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOptionSelect(idx)}
                        disabled={isAnswered}
                        className={`p-3 rounded-2xl border-3 flex flex-col items-center justify-center transition ${btnStyle}`}
                      >
                        <LetterIllustration iconType={pic.iconType} size={64} isAnimated={false} />
                        <span className="text-xs font-bold text-gray-800 mt-1">{pic.wordUrdu}</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Next Button */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center"
                >
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-8 py-3 rounded-full shadow-lg text-base transition"
                  >
                    Next Question <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Finished Screen */
          <div className="py-6">
            <Trophy className="w-20 h-20 text-amber-500 animate-bounce mx-auto mb-3" />
            <h3 className="text-3xl font-black text-gray-900 mb-2">Quiz Completed!</h3>
            <p className="text-sm font-semibold text-gray-600 mb-4">
              You scored {scoreCount} out of {questions.length} questions correctly!
            </p>

            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map(star => (
                <Sparkles
                  key={star}
                  className={`w-10 h-10 ${
                    star <= Math.round((scoreCount / questions.length) * 3)
                      ? 'text-amber-400 fill-amber-400 animate-pulse'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={onClose}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold px-8 py-3 rounded-full shadow-xl text-base transition hover:scale-105"
            >
              Collect Rewards & Back to Home
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
