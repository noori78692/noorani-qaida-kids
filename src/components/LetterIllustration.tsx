import React from 'react';
import { motion } from 'motion/react';

interface LetterIllustrationProps {
  iconType: string;
  size?: number;
  className?: string;
  isAnimated?: boolean;
}

export const LetterIllustration: React.FC<LetterIllustrationProps> = ({
  iconType,
  size = 120,
  className = '',
  isAnimated = true,
}) => {
  const containerStyle = { width: size, height: size };

  // Helper motion wrapper
  const MotionDiv = isAnimated ? motion.div : 'div';

  switch (iconType) {
    case 'mosque':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-md"
            animate={isAnimated ? { scale: [1, 1.03, 1] } : {}}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            {/* Mosque Dome */}
            <path d="M20 75 H80 V85 H20 Z" fill="#10B981" />
            <path d="M30 75 V55 Q50 30 70 55 V75 Z" fill="#34D399" />
            <path d="M50 25 L50 35 M46 30 H54" stroke="#F59E0B" strokeWidth="3" />
            {/* Crescent */}
            <path d="M52 20 A 4 4 0 1 1 48 24 A 3 3 0 1 0 52 20" fill="#F59E0B" />
            {/* Minarets */}
            <rect x="15" y="40" width="8" height="35" rx="2" fill="#059669" />
            <path d="M15 40 L19 32 L23 40 Z" fill="#F59E0B" />
            <rect x="77" y="40" width="8" height="35" rx="2" fill="#059669" />
            <path d="M77 40 L81 32 L85 40 Z" fill="#F59E0B" />
            {/* Door */}
            <path d="M43 75 Q50 60 57 75 Z" fill="#065F46" />
          </motion.svg>
        </div>
      );

    case 'bismillah':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <motion.div
            className="w-full h-full bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl p-3 shadow-lg border-2 border-amber-200 flex flex-col items-center justify-center text-white"
            whileHover={{ scale: 1.05, rotate: 2 }}
          >
            <span className="font-bold text-2xl tracking-wider drop-shadow">بِسْمِ اللَّهِ</span>
            <span className="text-[10px] uppercase font-semibold mt-1 bg-amber-800/40 px-2 py-0.5 rounded-full">Holy Book</span>
          </motion.div>
        </div>
      );

    case 'fan':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Stand */}
            <rect x="46" y="55" width="8" height="35" fill="#64748B" rx="3" />
            <ellipse cx="50" cy="90" rx="25" ry="6" fill="#334155" />
            {/* Fan Cage */}
            <circle cx="50" cy="40" r="32" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
            {/* Animated Spinning Blades */}
            <motion.g
              style={{ transformOrigin: '50px 40px' }}
              animate={isAnimated ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            >
              <path d="M50 40 Q65 20 60 10 Q50 20 50 40 Z" fill="#0284C7" />
              <path d="M50 40 Q70 55 80 45 Q65 35 50 40 Z" fill="#0284C7" />
              <path d="M50 40 Q35 60 40 70 Q50 60 50 40 Z" fill="#0284C7" />
              <path d="M50 40 Q30 25 20 35 Q35 45 50 40 Z" fill="#0284C7" />
              <circle cx="50" cy="40" r="6" fill="#0369A1" />
            </motion.g>
          </svg>
        </div>
      );

    case 'lock':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Shackle */}
            <motion.path
              d="M32 50 V30 A 18 18 0 0 1 68 30 V50"
              fill="none"
              stroke="#94A3B8"
              strokeWidth="8"
              strokeLinecap="round"
              animate={isAnimated ? { y: [0, -4, 0] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            {/* Body */}
            <rect x="22" y="45" width="56" height="42" rx="10" fill="#F59E0B" stroke="#D97706" strokeWidth="3" />
            {/* Keyhole */}
            <circle cx="50" cy="62" r="5" fill="#78350F" />
            <polygon points="47,62 53,62 51,74 49,74" fill="#78350F" />
          </svg>
        </div>
      );

    case 'cap':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Dome cap */}
            <path d="M15 70 Q50 20 85 70 Z" fill="#8B5CF6" />
            {/* Rim */}
            <path d="M10 70 Q50 78 90 70 V80 Q50 88 10 80 Z" fill="#6D28D9" />
            {/* Pattern stars */}
            <circle cx="50" cy="42" r="3" fill="#FDE047" />
            <circle cx="35" cy="52" r="2.5" fill="#FDE047" />
            <circle cx="65" cy="52" r="2.5" fill="#FDE047" />
          </svg>
        </div>
      );

    case 'fruit':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Basket */}
            <path d="M20 50 L30 85 H70 L80 50 Z" fill="#D97706" stroke="#92400E" strokeWidth="2" />
            {/* Apple */}
            <circle cx="40" cy="42" r="14" fill="#EF4444" />
            {/* Orange */}
            <circle cx="60" cy="44" r="13" fill="#F97316" />
            {/* Banana */}
            <path d="M30 35 Q50 20 70 38 Q50 28 30 35 Z" fill="#EAB308" />
            {/* Leaves */}
            <path d="M40 28 Q45 20 48 28 Z" fill="#22C55E" />
          </svg>
        </div>
      );

    case 'jug':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Handle */}
            <path d="M30 35 C10 35 10 70 30 70" fill="none" stroke="#38BDF8" strokeWidth="6" strokeLinecap="round" />
            {/* Jug Body */}
            <path d="M30 25 C30 20 70 20 70 25 C75 45 80 75 60 85 C40 85 25 75 30 25 Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" />
            {/* Water Inside */}
            <path d="M32 50 Q50 45 68 50 C73 68 60 82 50 82 C38 82 28 68 32 50 Z" fill="#38BDF8" opacity="0.7" />
          </svg>
        </div>
      );

    case 'knife':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Handle */}
            <rect x="15" y="55" width="45" height="18" rx="6" fill="#78350F" />
            {/* Blade */}
            <path d="M60 58 L88 58 Q95 58 85 70 L60 70 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'pool':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Pool Border */}
            <ellipse cx="50" cy="55" rx="42" ry="26" fill="#0284C7" />
            <ellipse cx="50" cy="55" rx="36" ry="21" fill="#38BDF8" />
            {/* Water ripples */}
            <motion.path
              d="M25 55 Q50 50 75 55 Q50 60 25 55"
              fill="none"
              stroke="#E0F2FE"
              strokeWidth="2.5"
              animate={isAnimated ? { d: ['M25 55 Q50 50 75 55 Q50 60 25 55', 'M25 55 Q50 60 75 55 Q50 50 25 55', 'M25 55 Q50 50 75 55 Q50 60 25 55'] } : {}}
              transition={{ repeat: Infinity, duration: 2.5 }}
            />
          </svg>
        </div>
      );

    case 'letter':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Envelope Body */}
            <rect x="15" y="30" width="70" height="48" rx="6" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
            {/* Flap */}
            <polygon points="15,30 50,55 85,30" fill="#FDE047" stroke="#F59E0B" strokeWidth="2" />
            {/* Stamp */}
            <rect x="65" y="36" width="14" height="16" fill="#EF4444" rx="2" />
          </svg>
        </div>
      );

    case 'inkpot':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Ink bottle */}
            <rect x="30" y="45" width="40" height="40" rx="8" fill="#1E293B" />
            <rect x="38" y="35" width="24" height="12" rx="3" fill="#475569" />
            <text x="50" y="70" textAnchor="middle" fill="#38BDF8" fontSize="11" fontWeight="bold">INK</text>
            {/* Feather Pen */}
            <path d="M60 20 Q80 10 75 45 L62 48 Z" fill="#38BDF8" />
          </svg>
        </div>
      );

    case 'box':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Box Body */}
            <rect x="20" y="42" width="60" height="42" rx="4" fill="#EF4444" />
            {/* Lid */}
            <rect x="16" y="34" width="68" height="12" rx="3" fill="#DC2626" />
            {/* Ribbon */}
            <rect x="44" y="34" width="12" height="50" fill="#FDE047" />
            {/* Bow */}
            <circle cx="42" cy="28" r="8" fill="#FDE047" />
            <circle cx="58" cy="28" r="8" fill="#FDE047" />
          </svg>
        </div>
      );

    case 'atom':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <MotionDiv
              className="w-full h-full flex items-center justify-center"
              animate={isAnimated ? { rotate: 360 } : {}}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            >
              <ellipse cx="50" cy="50" rx="38" ry="12" fill="none" stroke="#38BDF8" strokeWidth="3" transform="rotate(0 50 50)" />
              <ellipse cx="50" cy="50" rx="38" ry="12" fill="none" stroke="#F43F5E" strokeWidth="3" transform="rotate(60 50 50)" />
              <ellipse cx="50" cy="50" rx="38" ry="12" fill="none" stroke="#10B981" strokeWidth="3" transform="rotate(120 50 50)" />
              <circle cx="50" cy="50" r="10" fill="#F59E0B" />
            </MotionDiv>
          </svg>
        </div>
      );

    case 'coin':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-lg"
            animate={isAnimated ? { rotateY: [0, 180, 360] } : {}}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <circle cx="50" cy="50" r="40" fill="#F59E0B" stroke="#D97706" strokeWidth="4" />
            <circle cx="50" cy="50" r="32" fill="#FBBF24" />
            <text x="50" y="58" textAnchor="middle" fill="#B45309" fontSize="24" fontWeight="bold">Rs.1</text>
          </motion.svg>
        </div>
      );

    case 'ladder':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Rails */}
            <line x1="30" y1="15" x2="30" y2="85" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
            <line x1="70" y1="15" x2="70" y2="85" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
            {/* Rungs */}
            <line x1="30" y1="30" x2="70" y2="30" stroke="#B45309" strokeWidth="5" />
            <line x1="30" y1="48" x2="70" y2="48" stroke="#B45309" strokeWidth="5" />
            <line x1="30" y1="66" x2="70" y2="66" stroke="#B45309" strokeWidth="5" />
          </svg>
        </div>
      );

    case 'apple':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Apple Body */}
            <path d="M50 32 C35 20 18 35 20 60 C22 80 42 88 50 85 C58 88 78 80 80 60 C82 35 65 20 50 32 Z" fill="#EF4444" stroke="#DC2626" strokeWidth="2" />
            {/* Stem */}
            <path d="M50 30 Q54 18 60 14" fill="none" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
            {/* Leaf */}
            <path d="M52 22 Q65 18 68 25 Q58 28 52 22 Z" fill="#22C55E" />
            {/* Highlight */}
            <ellipse cx="34" cy="45" rx="6" ry="12" fill="#FFFFFF" opacity="0.3" transform="rotate(-20 34 45)" />
          </svg>
        </div>
      );

    case 'bottle':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Bottle */}
            <path d="M40 30 H60 V40 L72 50 V82 H28 V50 L40 40 Z" fill="#EC4899" opacity="0.85" stroke="#BE185D" strokeWidth="3" />
            <rect x="42" y="20" width="16" height="10" rx="2" fill="#F472B6" />
            {/* Label */}
            <rect x="36" y="56" width="28" height="18" rx="3" fill="#FFFFFF" />
            <circle cx="50" cy="65" r="4" fill="#BE185D" />
          </svg>
        </div>
      );

    case 'pitcher':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Surahi neck & body */}
            <path d="M45 20 H55 V40 C70 45 78 60 72 80 C68 90 32 90 28 80 C22 60 30 45 45 40 Z" fill="#B45309" stroke="#78350F" strokeWidth="3" />
            <rect x="40" y="15" width="20" height="6" rx="2" fill="#D97706" />
          </svg>
        </div>
      );

    case 'pistol':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Toy pistol */}
            <path d="M20 35 H65 V52 H50 L42 82 H25 L35 52 H20 Z" fill="#06B6D4" stroke="#0891B2" strokeWidth="3" />
            <circle cx="58" cy="43" r="4" fill="#FDE047" />
          </svg>
        </div>
      );

    case 'utensils':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <path d="M20 50 Q50 90 80 50 Z" fill="#059669" stroke="#047857" strokeWidth="3" />
            <ellipse cx="50" cy="50" rx="30" ry="8" fill="#A7F3D0" />
          </svg>
        </div>
      );

    case 'glasses':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Frames */}
            <circle cx="32" cy="50" r="18" fill="#E0F2FE" stroke="#0284C7" strokeWidth="5" />
            <circle cx="68" cy="50" r="18" fill="#E0F2FE" stroke="#0284C7" strokeWidth="5" />
            <line x1="50" y1="50" x2="50" y2="50" stroke="#0284C7" strokeWidth="5" />
            <line x1="14" y1="50" x2="5" y2="45" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
            <line x1="86" y1="50" x2="95" y2="45" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'balloon':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-lg"
            animate={isAnimated ? { y: [-4, 4, -4], rotate: [-2, 2, -2] } : {}}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            {/* String */}
            <path d="M50 72 Q45 82 52 92" fill="none" stroke="#64748B" strokeWidth="2" />
            {/* Balloon */}
            <path d="M50 18 C28 18 22 40 32 62 C38 72 48 74 50 74 C52 74 62 72 68 62 C78 40 72 18 50 18 Z" fill="#F43F5E" stroke="#E11D48" strokeWidth="2" />
            <polygon points="46,74 54,74 50,79" fill="#E11D48" />
            <ellipse cx="40" cy="32" rx="4" ry="9" fill="#FFFFFF" opacity="0.4" transform="rotate(-25 40 32)" />
          </motion.svg>
        </div>
      );

    case 'fountain':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Base basin */}
            <ellipse cx="50" cy="78" rx="38" ry="12" fill="#0284C7" stroke="#0369A1" strokeWidth="3" />
            <ellipse cx="50" cy="76" rx="30" ry="8" fill="#38BDF8" />
            {/* Center Pillar */}
            <rect x="44" y="45" width="12" height="32" rx="3" fill="#0284C7" />
            {/* Water jets */}
            <motion.path
              d="M50 45 Q30 20 20 50 M50 45 Q70 20 80 50 M50 45 Q50 10 50 50"
              fill="none"
              stroke="#BAE6FD"
              strokeWidth="4"
              strokeLinecap="round"
              animate={isAnimated ? { opacity: [0.6, 1, 0.6] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </svg>
        </div>
      );

    case 'pen':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Pen shaft */}
            <path d="M30 80 L75 25 L82 32 L37 87 Z" fill="#1E293B" />
            <polygon points="30,80 22,90 37,87" fill="#F59E0B" />
            <circle cx="80" cy="22" r="6" fill="#F59E0B" />
          </svg>
        </div>
      );

    case 'chair':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Backrest */}
            <rect x="30" y="20" width="40" height="35" rx="6" fill="#B45309" />
            {/* Seat */}
            <rect x="25" y="52" width="50" height="12" rx="4" fill="#D97706" />
            {/* Legs */}
            <line x1="30" y1="64" x2="28" y2="88" stroke="#78350F" strokeWidth="5" />
            <line x1="70" y1="64" x2="72" y2="88" stroke="#78350F" strokeWidth="5" />
          </svg>
        </div>
      );

    case 'glass':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <path d="M30 20 L35 85 H65 L70 20 Z" fill="#E0F2FE" opacity="0.8" stroke="#0284C7" strokeWidth="3" />
            <path d="M33 38 L36 82 H64 L67 38 Z" fill="#F8FAFC" />
          </svg>
        </div>
      );

    case 'top':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow"
            animate={isAnimated ? { rotate: [0, 15, -15, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            {/* Handle */}
            <rect x="47" y="15" width="6" height="15" rx="2" fill="#78350F" />
            {/* Body */}
            <path d="M20 38 Q50 30 80 38 L50 88 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="3" />
            {/* Stripe */}
            <path d="M28 48 Q50 42 72 48 L62 62 Q50 56 38 62 Z" fill="#FDE047" />
          </motion.svg>
        </div>
      );

    case 'tap':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <rect x="20" y="30" width="30" height="16" fill="#94A3B8" />
            <path d="M50 30 Q70 30 70 50 V60 H55 V50 Q55 42 50 42 Z" fill="#64748B" />
            {/* Water drop */}
            <motion.circle
              cx="62"
              cy="75"
              r="4"
              fill="#38BDF8"
              animate={isAnimated ? { cy: [65, 88], opacity: [1, 0] } : {}}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
          </svg>
        </div>
      );

    case 'page':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <rect x="20" y="20" width="60" height="65" rx="4" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="3" />
            <line x1="30" y1="35" x2="70" y2="35" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
            <line x1="30" y1="48" x2="70" y2="48" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="30" y1="60" x2="60" y2="60" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'plough':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            <path d="M15 75 L75 30 L85 35 L25 80 Z" fill="#78350F" />
            <path d="M25 80 L20 88 L35 88 Z" fill="#475569" />
          </svg>
        </div>
      );

    case 'cart':
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Cart body */}
            <rect x="35" y="40" width="45" height="25" rx="4" fill="#B45309" />
            {/* Wheels */}
            <circle cx="45" cy="72" r="12" fill="#78350F" stroke="#F59E0B" strokeWidth="3" />
            <circle cx="70" cy="72" r="12" fill="#78350F" stroke="#F59E0B" strokeWidth="3" />
            {/* Shaft */}
            <line x1="15" y1="52" x2="35" y2="52" stroke="#78350F" strokeWidth="5" />
          </svg>
        </div>
      );

    default:
      return (
        <div style={containerStyle} className={`relative flex items-center justify-center ${className}`}>
          <motion.div
            className="w-full h-full bg-gradient-to-tr from-amber-300 to-yellow-400 rounded-3xl p-3 shadow flex items-center justify-center text-white"
            animate={isAnimated ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-3xl font-bold">✨</span>
          </motion.div>
        </div>
      );
  }
};
