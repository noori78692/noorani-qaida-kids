import React from 'react';
import { motion } from 'motion/react';
import { Volume2, Info } from 'lucide-react';
import { LetterItem } from '../types';
import { speakArabic, soundFx } from '../utils/audioSystem';

interface MakhrajGuideProps {
  item: LetterItem;
}

export const MakhrajGuide: React.FC<MakhrajGuideProps> = ({ item }) => {
  const getHighlightCoords = () => {
    switch (item.makhrajGroup) {
      case 'throat':
        return { x: 50, y: 78, label: 'Halq (Throat)' };
      case 'tongue-deep':
        return { x: 42, y: 55, label: 'Deep Tongue' };
      case 'tongue-center':
        return { x: 50, y: 48, label: 'Center Tongue' };
      case 'tongue-tip':
        return { x: 68, y: 44, label: 'Tip of Tongue' };
      case 'lips':
        return { x: 82, y: 48, label: 'Shafatain (Lips)' };
      case 'nose':
        return { x: 70, y: 28, label: 'Khaishoom (Nose)' };
      default:
        return { x: 50, y: 50, label: 'Jawf (Empty Mouth)' };
    }
  };

  const activeZone = getHighlightCoords();

  const playAudio = () => {
    soundFx.playChime();
    speakArabic(item.letter);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-5 border-2 border-amber-200 shadow-md flex flex-col md:flex-row items-center gap-6">
      {/* Mouth SVG Diagram */}
      <div className="relative w-44 h-44 bg-white rounded-3xl shadow-inner border-2 border-amber-300 flex items-center justify-center p-2">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Head & Throat Outline */}
          <path
            d="M20 20 Q50 10 80 20 Q88 35 88 52 Q82 60 70 65 Q60 88 40 92 L30 92 L28 75 Q15 60 20 20 Z"
            fill="#FEF3C7"
            stroke="#D97706"
            strokeWidth="2.5"
          />
          {/* Nose Cavity */}
          <path d="M65 25 Q75 25 80 32" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 3" />
          {/* Tongue Contour */}
          <path
            d="M35 70 Q45 55 60 52 Q72 52 75 58 Q65 65 50 68 Z"
            fill="#F43F5E"
            opacity="0.8"
            stroke="#E11D48"
            strokeWidth="2"
          />
          {/* Teeth */}
          <rect x="70" y="38" width="6" height="8" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
          <rect x="70" y="56" width="6" height="8" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
          {/* Lips */}
          <path d="M76 38 C84 38 88 44 86 48 C88 52 84 58 76 58" fill="none" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />

          {/* Active Pulse Point */}
          <motion.circle
            cx={activeZone.x}
            cy={activeZone.y}
            r="8"
            fill="#3B82F6"
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <circle cx={activeZone.x} cy={activeZone.y} r="4" fill="#FFFFFF" />
        </svg>

        <span className="absolute bottom-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
          {activeZone.label}
        </span>
      </div>

      {/* Description Info */}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2 mb-1">
          <Info className="w-5 h-5 text-amber-600" />
          <h4 className="font-bold text-gray-800 text-base">Makhraj (Point of Articulation)</h4>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          {item.makhrajDesc}
        </p>

        <button
          onClick={playAudio}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-4 py-2 rounded-2xl shadow transition text-xs"
        >
          <Volume2 className="w-4 h-4" />
          Listen to Makhraj Sound
        </button>
      </div>
    </div>
  );
};
