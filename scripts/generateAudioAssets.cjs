const fs = require('fs');
const path = require('path');

// Ensure directories exist
const lettersDir = path.join(__dirname, '..', 'public', 'audio', 'letters');
const wordsDir = path.join(__dirname, '..', 'public', 'audio', 'words');

fs.mkdirSync(lettersDir, { recursive: true });
fs.mkdirSync(wordsDir, { recursive: true });

// Helper to generate a small valid 1-second 8kHz mono PCM WAV file
function createWavBuffer(freq = 440, durationMs = 300) {
  const sampleRate = 8000;
  const numSamples = Math.floor(sampleRate * (durationMs / 1000));
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // AudioFormat (PCM)
  buffer.writeUInt16LE(1, 22);  // NumChannels (1)
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
  buffer.writeUInt16LE(2, 32);  // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate sine wave sample with fade out
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.max(0, 1 - (i / numSamples));
    const sample = Math.sin(2 * Math.PI * freq * t) * 0.3 * envelope;
    const intSample = Math.floor(sample * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

const letterFiles = [
  'alif', 'ba', 'pe', 'ta', 'tte', 'sa', 'jeem', 'che', 'ha', 'kha',
  'dal', 'ddal', 'zal', 'ra', 'rra', 'za', 'zha', 'seen', 'sheen',
  'saad', 'zaad', 'toa', 'zoa', 'ain', 'ghain', 'fea', 'qaaf', 'kaaf',
  'gaaf', 'laam', 'meem', 'noon', 'waw', 'hea', 'hamza', 'yea', 'bari_yea'
];

const wordFiles = [
  'allah', 'bismillah', 'pankha', 'tala', 'topi', 'samar', 'jug', 'chaabi',
  'huqqa', 'kheema', 'dawaat', 'ddol', 'zakheera', 'roza', 'pahar', 'zeraf',
  'zhala', 'seab', 'surt', 'surahi', 'zaeef', 'tooti', 'zuroof', 'ainak',
  'gubar', 'fawara', 'qalam', 'kursi', 'gaaye', 'lota', 'masjid', 'nal',
  'warda', 'hiran', 'yaqoot'
];

// Write letter files
letterFiles.forEach((file, index) => {
  const filePath = path.join(lettersDir, `${file}.mp3`);
  const wavBuffer = createWavBuffer(200 + (index * 15) % 400, 400);
  fs.writeFileSync(filePath, wavBuffer);
});

// Write word files
wordFiles.forEach((file, index) => {
  const filePath = path.join(wordsDir, `${file}.mp3`);
  const wavBuffer = createWavBuffer(300 + (index * 20) % 500, 500);
  fs.writeFileSync(filePath, wavBuffer);
});

console.log('Successfully created local audio assets structure in /public/audio/');
