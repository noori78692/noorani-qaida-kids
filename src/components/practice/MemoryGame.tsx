import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { LetterItem } from '../../types';
import { LetterIllustration } from '../LetterIllustration';
import { soundFx, speakArabic } from '../../utils/audioSystem';
import confetti from 'canvas-confetti';

interface MemoryGameProps {
  letters: LetterItem[];
}

interface CardItem {
  id: string;
  type: 'letter' | 'picture';
  letterObj: LetterItem;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ letters }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const initGame = () => {
    // Pick 4 letters randomly
    const selected = [...letters].sort(() => Math.random() - 0.5).slice(0, 4);

    const deck: CardItem[] = [];
    selected.forEach((item, idx) => {
      deck.push({
        id: `card-letter-${idx}`,
        type: 'letter',
        letterObj: item,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: `card-pic-${idx}`,
        type: 'picture',
        letterObj: item,
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(deck.sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setMatches(0);
    setMoves(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, [letters]);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length === 2) return;

    soundFx.playChime();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newCards[index].type === 'letter') {
      speakArabic(newCards[index].letterObj.letter);
    } else {
      speakArabic(newCards[index].letterObj.pictureWordUrdu);
    }

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const card1 = newCards[firstIdx];
      const card2 = newCards[secondIdx];

      if (card1.letterObj.id === card2.letterObj.id) {
        // Match!
        setTimeout(() => {
          soundFx.playSparkle();
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards([...newCards]);
          setFlippedIndices([]);

          const newMatchCount = matches + 1;
          setMatches(newMatchCount);

          if (newMatchCount === 4) {
            setIsGameOver(true);
            soundFx.playSuccessFanfare();
            confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
          }
        }, 600);
      } else {
        // No match - flip back
        setTimeout(() => {
          soundFx.playErrorSound();
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
        }, 1100);
      }
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-4 border-cyan-200 max-w-xl mx-auto my-4 text-center">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-gray-800 text-lg">Memory Match Cards</h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
          <span>Moves: {moves}</span>
          <button
            onClick={initGame}
            className="flex items-center gap-1 text-cyan-600 hover:text-cyan-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Grid of 8 cards */}
      <div className="grid grid-cols-4 gap-3 my-4">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCardClick(idx)}
            className="h-28 cursor-pointer relative perspective-1000"
          >
            <div
              className={`w-full h-full rounded-2xl shadow-md border-2 transition-all duration-300 flex items-center justify-center p-2 ${
                card.isFlipped || card.isMatched
                  ? 'bg-amber-50 border-amber-300 transform rotate-y-180'
                  : 'bg-gradient-to-tr from-cyan-500 to-blue-600 border-cyan-300 text-white font-bold text-3xl'
              }`}
            >
              {card.isFlipped || card.isMatched ? (
                card.type === 'letter' ? (
                  <span className="text-4xl font-extrabold text-gray-800">{card.letterObj.letter}</span>
                ) : (
                  <LetterIllustration iconType={card.letterObj.iconType} size={64} isAnimated={false} />
                )
              ) : (
                <span className="text-2xl opacity-70">❓</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {isGameOver && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-amber-900 flex flex-col items-center gap-2 mt-4"
        >
          <Trophy className="w-10 h-10 text-amber-500 animate-bounce" />
          <h4 className="text-xl font-bold">You Matched All Cards!</h4>
          <p className="text-xs text-amber-800 font-medium">Completed in {moves} moves! ⭐⭐⭐</p>
          <button
            onClick={initGame}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2 rounded-full text-xs shadow transition"
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
};
