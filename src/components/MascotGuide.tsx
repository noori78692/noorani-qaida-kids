import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Coins, Star, Flame, Volume2, X } from 'lucide-react';
import { UserProfile } from '../types';
import { soundFx, speakEnglishOrUrdu } from '../utils/audioSystem';

interface MascotGuideProps {
  userProfile: UserProfile;
  onUpdateAvatar?: (hat: UserProfile['avatar']['hat']) => void;
}

export const MascotGuide: React.FC<MascotGuideProps> = ({
  userProfile,
  onUpdateAvatar,
}) => {
  const [speechBubble, setSpeechBubble] = useState<string>(
    `Assalamu Alaikum, ${userProfile.name}! Ready to explore Noorani Qaida today? ✨`
  );
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const tips = [
    "Tip: Always pronounce throat letters (Halq) with clean air from the throat!",
    "Great job! Zabar goes above letters, Zer goes underneath!",
    "Tip: Long Alif with Madd ( ~ ) stretches the 'Aa' sound longer!",
    "You can tap the microphone button on any letter to practice your voice!",
    "Keep up your daily streak to earn bonus stars and unlocked badges!",
  ];

  const handleMascotClick = () => {
    soundFx.playChime();
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setSpeechBubble(randomTip);
    speakEnglishOrUrdu(randomTip);
  };

  return (
    <div className="relative flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-sky-400 via-indigo-500 to-indigo-600 p-5 sm:p-6 rounded-[32px] shadow-xl border-b-8 border-indigo-800 my-4 text-white gap-4">
      {/* Mascot Bird Avatar */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMascotClick}
          className="cursor-pointer relative w-16 h-16 sm:w-20 sm:h-20 bg-amber-400 rounded-3xl shadow-lg border-4 border-amber-200 flex items-center justify-center p-1.5 shrink-0 transform -rotate-2"
        >
          {/* Owl Vector SVG */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Body */}
            <circle cx="50" cy="55" r="38" fill="#F59E0B" />
            <circle cx="50" cy="62" r="28" fill="#FEF3C7" />
            {/* Eyes */}
            <circle cx="36" cy="42" r="12" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
            <circle cx="64" cy="42" r="12" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
            <circle cx="38" cy="42" r="6" fill="#1E293B" />
            <circle cx="62" cy="42" r="6" fill="#1E293B" />
            <circle cx="40" cy="40" r="2" fill="#FFFFFF" />
            <circle cx="64" cy="40" r="2" fill="#FFFFFF" />
            {/* Beak */}
            <polygon points="50,48 44,56 56,56" fill="#EF4444" />
            {/* Crown / Hat option */}
            {userProfile.avatar.hat === 'crown' && (
              <path d="M35 22 L42 32 L50 18 L58 32 L65 22 L62 34 H38 Z" fill="#FDE047" stroke="#D97706" strokeWidth="1" />
            )}
            {userProfile.avatar.hat === 'cap' && (
              <path d="M30 25 Q50 10 70 25 Z" fill="#3B82F6" />
            )}
            {userProfile.avatar.hat === 'turban' && (
              <ellipse cx="50" cy="22" rx="22" ry="10" fill="#22C55E" />
            )}
          </svg>

          {/* Sparkle badge */}
          <span className="absolute -top-2 -right-2 bg-amber-400 text-indigo-950 rounded-full p-1 shadow border-2 border-white">
            <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
          </span>
        </motion.div>

        {/* Speech Bubble */}
        <div className="flex-1 max-w-md bg-white/95 text-indigo-950 p-3.5 rounded-2xl shadow-md text-xs font-black relative border-2 border-sky-100">
          <p className="leading-snug">{speechBubble}</p>
          <button
            onClick={handleMascotClick}
            className="mt-1 text-[11px] text-indigo-600 font-extrabold flex items-center gap-1 hover:underline"
          >
            <Volume2 className="w-3.5 h-3.5" /> Tap mascot for tips!
          </button>
        </div>
      </div>

      {/* Stats Badges (Coins, Stars, Streak) */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
        <div className="bg-amber-400 text-indigo-950 border-2 border-amber-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md font-black text-xs">
          <Coins className="w-4 h-4 fill-amber-100 text-amber-900" />
          <span>{userProfile.coins}</span>
        </div>

        <div className="bg-indigo-900 text-white border-2 border-indigo-700 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md font-black text-xs">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>{userProfile.stars}</span>
        </div>

        <div className="bg-rose-500 text-white border-2 border-rose-300 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md font-black text-xs">
          <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>{userProfile.streak}d</span>
        </div>

        <button
          onClick={() => setShowAvatarPicker(true)}
          className="bg-white text-indigo-900 font-black px-4 py-1.5 rounded-full text-xs shadow-md hover:bg-sky-50 transition border-b-2 border-slate-200"
        >
          Hat 🎩
        </button>
      </div>

      {/* Avatar Hat Customizer Overlay */}
      <AnimatePresence>
        {showAvatarPicker && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white text-gray-900 rounded-3xl p-6 w-full max-w-xs shadow-2xl relative text-center"
            >
              <button
                onClick={() => setShowAvatarPicker(false)}
                className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
              <h4 className="font-black text-lg mb-4">Choose Mascot Hat</h4>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { hat: 'none', label: 'Classic' },
                  { hat: 'crown', label: 'Royal Crown 👑' },
                  { hat: 'cap', label: 'Cap 🧢' },
                  { hat: 'turban', label: 'Turban 🟢' },
                ].map(opt => (
                  <button
                    key={opt.hat}
                    onClick={() => {
                      if (onUpdateAvatar) onUpdateAvatar(opt.hat as UserProfile['avatar']['hat']);
                      setShowAvatarPicker(false);
                    }}
                    className="p-3 rounded-2xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 font-bold text-xs transition"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
