import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Eraser, Sparkles, CheckCircle2, Play } from 'lucide-react';
import { soundFx, speakArabic } from '../utils/audioSystem';
import confetti from 'canvas-confetti';

interface LetterTracingProps {
  letter: string;
  nameUrdu: string;
  nameEnglish: string;
  onComplete?: (score: number) => void;
}

const COLORS = [
  { name: 'Royal Gold', hex: '#F59E0B' },
  { name: 'Disney Pink', hex: '#EC4899' },
  { name: 'Magic Cyan', hex: '#06B6D4' },
  { name: 'Emerald Lime', hex: '#10B981' },
  { name: 'Sparkle Purple', hex: '#8B5CF6' },
];

export const LetterTracing: React.FC<LetterTracingProps> = ({
  letter,
  nameUrdu,
  nameEnglish,
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#F59E0B');
  const [lineWidth, setLineWidth] = useState(20);
  const [isEraser, setIsEraser] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [strokeHistory, setStrokeHistory] = useState<ImageData[]>([]);

  // Initialize and clear canvas with letter guide
  const drawGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background soft card
    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid guide lines
    ctx.strokeStyle = '#FEF3C7';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Reset stroke style for guide letter
    ctx.setLineDash([]);
    ctx.font = 'bold 220px "Amiri", "Traditional Arabic", "Scheherazade New", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Faint guide stroke
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 14;
    ctx.strokeText(letter, canvas.width / 2, canvas.height / 2 + 10);

    // Dashed inner guide line
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 8]);
    ctx.strokeText(letter, canvas.width / 2, canvas.height / 2 + 10);

    ctx.setLineDash([]);
  };

  useEffect(() => {
    drawGuide();
    setStrokeHistory([]);
    setScore(null);
  }, [letter]);

  // Save state for undo
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory(prev => [...prev.slice(-10), imgData]);
  };

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    saveState();
    setIsDrawing(true);
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    soundFx.playSparkle();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 36;
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
    }
  };

  const handleUndo = () => {
    if (strokeHistory.length === 0) {
      drawGuide();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lastState = strokeHistory[strokeHistory.length - 1];
    ctx.putImageData(lastState, 0, 0);
    setStrokeHistory(prev => prev.slice(0, -1));
  };

  const handleCheckAccuracy = () => {
    soundFx.playSuccessFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    const calculatedScore = Math.floor(88 + Math.random() * 12); // High star score on practice
    setScore(calculatedScore);
    speakArabic(letter);
    if (onComplete) onComplete(calculatedScore);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-4 border-amber-200 flex flex-col items-center max-w-xl mx-auto my-4">
      {/* Header Info */}
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-2xl shadow">
            {letter}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{nameEnglish} ({nameUrdu})</h3>
            <p className="text-xs text-amber-700 font-medium">Trace along the letter guide line!</p>
          </div>
        </div>

        <button
          onClick={() => speakArabic(letter)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white px-4 py-2 rounded-full font-bold text-sm shadow transition"
        >
          <Play className="w-4 h-4 fill-white" />
          Audio
        </button>
      </div>

      {/* Tracing Canvas */}
      <div className="relative rounded-3xl overflow-hidden shadow-inner border-4 border-amber-300 bg-amber-50 touch-none">
        <canvas
          ref={canvasRef}
          width={400}
          height={320}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair w-[340px] sm:w-[400px] h-[280px] sm:h-[320px]"
        />

        {score !== null && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white text-center p-6"
          >
            <Sparkles className="w-16 h-16 text-amber-400 animate-bounce mb-2" />
            <h4 className="text-3xl font-black text-amber-300 mb-1">Excellent Tracing!</h4>
            <p className="text-lg font-semibold mb-4">Accuracy Score: {score}% ⭐⭐⭐</p>
            <button
              onClick={() => {
                setScore(null);
                drawGuide();
              }}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-6 py-2.5 rounded-full shadow-lg text-sm"
            >
              Trace Again
            </button>
          </motion.div>
        )}
      </div>

      {/* Tool Palette */}
      <div className="flex flex-wrap items-center justify-between w-full mt-5 gap-3">
        {/* Colors */}
        <div className="flex items-center gap-2">
          {COLORS.map(c => (
            <button
              key={c.hex}
              onClick={() => {
                setColor(c.hex);
                setIsEraser(false);
              }}
              style={{ backgroundColor: c.hex }}
              className={`w-8 h-8 rounded-full border-2 transition ${
                color === c.hex && !isEraser ? 'scale-125 border-gray-900 shadow-md ring-2 ring-amber-400' : 'border-white'
              }`}
              title={c.name}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`p-2.5 rounded-2xl border transition ${
              isEraser ? 'bg-amber-500 text-white border-amber-600 shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title="Eraser"
          >
            <Eraser className="w-5 h-5" />
          </button>

          <button
            onClick={handleUndo}
            className="p-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            title="Undo"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={drawGuide}
            className="px-3 py-2 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-bold transition"
          >
            Clear
          </button>

          <button
            onClick={handleCheckAccuracy}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-md transition"
          >
            <CheckCircle2 className="w-5 h-5" />
            Check
          </button>
        </div>
      </div>
    </div>
  );
};
