import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, Volume2, Sparkles, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { soundFx, speakArabic, voiceChecker, VoiceRecognitionResult } from '../../utils/audioSystem';
import confetti from 'canvas-confetti';

interface VoicePracticeModalProps {
  expectedWord: string;
  wordUrdu: string;
  onClose: () => void;
}

export const VoicePracticeModal: React.FC<VoicePracticeModalProps> = ({
  expectedWord,
  wordUrdu,
  onClose,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<VoiceRecognitionResult | null>(null);

  const handleStartListening = () => {
    setIsListening(true);
    setResult(null);
    soundFx.playChime();

    voiceChecker.startListening(expectedWord, (res) => {
      setIsListening(false);
      setResult(res);

      if (res.isMatch) {
        soundFx.playSuccessFanfare();
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
      } else {
        soundFx.playErrorSound();
      }
    });
  };

  const handleStopListening = () => {
    voiceChecker.stopListening();
    setIsListening(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-rose-300 w-full max-w-md relative text-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-rose-100 rounded-3xl flex items-center justify-center mx-auto mb-3 text-rose-600 shadow-inner">
          <Mic className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-1">Voice Pronunciation Check</h3>
        <p className="text-xs text-gray-500 mb-4">Tap the mic and pronounce the letter out loud!</p>

        {/* Target Word */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl p-5 mb-6 shadow">
          <span className="text-5xl font-black block mb-2" dir="rtl">{wordUrdu}</span>
          <span className="text-sm font-semibold">{expectedWord}</span>

          <div className="mt-3 flex justify-center">
            <button
              onClick={() => speakArabic(wordUrdu)}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-xs font-bold transition"
            >
              <Volume2 className="w-3.5 h-3.5" /> Hear Target
            </button>
          </div>
        </div>

        {/* Mic Button */}
        <div className="my-6">
          {!isListening ? (
            <button
              onClick={handleStartListening}
              className="w-24 h-24 bg-gradient-to-tr from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-full shadow-xl flex items-center justify-center mx-auto ring-8 ring-rose-100 active:scale-95 transition"
            >
              <Mic className="w-10 h-10 animate-pulse" />
            </button>
          ) : (
            <button
              onClick={handleStopListening}
              className="w-24 h-24 bg-rose-700 text-white rounded-full shadow-xl flex flex-col items-center justify-center mx-auto ring-8 ring-rose-200 animate-bounce"
            >
              <MicOff className="w-8 h-8 mb-1" />
              <span className="text-[10px] font-bold uppercase">Listening...</span>
            </button>
          )}
        </div>

        {/* Feedback Display */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl text-sm font-bold flex flex-col items-center gap-1 ${
              result.isMatch ? 'bg-emerald-50 text-emerald-800 border border-emerald-300' : 'bg-amber-50 text-amber-900 border border-amber-300'
            }`}
          >
            {result.isMatch ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <p>{result.feedback}</p>
                <div className="flex gap-1 text-amber-400 mt-1">
                  <Sparkles className="w-4 h-4 fill-amber-400" />
                  <Sparkles className="w-4 h-4 fill-amber-400" />
                  <Sparkles className="w-4 h-4 fill-amber-400" />
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-6 h-6 text-amber-600" />
                <p>{result.feedback}</p>
                {result.transcript && (
                  <p className="text-xs text-gray-600 font-normal">Heard: "{result.transcript}"</p>
                )}
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
