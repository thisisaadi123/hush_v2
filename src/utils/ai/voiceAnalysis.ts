let audioBlob: Blob | null = null;

export async function recordVoiceSample(durationMs = 5000): Promise<void> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const audioChunks: Blob[] = [];

  mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
  mediaRecorder.start();

  return new Promise((resolve) => {
    setTimeout(() => {
      mediaRecorder.stop();
      stream.getTracks().forEach(track => track.stop());
    }, durationMs);

    mediaRecorder.onstop = () => {
      audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      console.log('Voice sample captured.');
      resolve();
    };
  });
}

/**
 * Analyzes the recorded audio blob for pitch monotony.
 * Returns a score of 0 (expressive) to 1 (monotone).
 */
export async function analyzeVoice(): Promise<number> {
  if (!audioBlob) return 0;

  const audioContext = new AudioContext();
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  // Try to use 'pitchy' if available (optional). If not, fallback to a
  // lightweight zero-crossing based pitch estimator to approximate pitch
  // variation (monotony) without adding heavy dependencies at runtime.
  // Optional: if a dedicated pitch detection library like `pitchy` is
  // available at runtime we could use it here for improved accuracy.
  // To keep installs light and avoid bundler resolution issues, we use
  // the built-in fallback below which approximates pitch via ZCR.

  // Fallback: zero-crossing rate (ZCR) based pitch approximation per-frame.
  try {
    console.log('VoiceAnalysis: Starting FFT analysis');
    const channelData = audioBuffer.getChannelData(0);
    console.log('VoiceAnalysis: Buffer stats', {
      length: channelData.length,
      sampleRate: audioBuffer.sampleRate,
      duration: (channelData.length / audioBuffer.sampleRate).toFixed(2) + 's'
    });

    const sampleRate = audioBuffer.sampleRate;
    const frameSize = 1024;
    const hop = 512;
    const pitches: number[] = [];
    let silentFrames = 0;
    let activeFrames = 0;

    for (let i = 0; i + frameSize < channelData.length; i += hop) {
      // compute energy
      let energy = 0;
      for (let j = 0; j < frameSize; j++) {
        const s = channelData[i + j];
        energy += s * s;
      }
      energy /= frameSize;
      if (energy < 1e-6) {
        silentFrames++;
        continue; // skip silence
      }
      activeFrames++;

      // zero-crossing count
      let zc = 0;
      for (let j = 1; j < frameSize; j++) {
        if ((channelData[i + j - 1] >= 0 && channelData[i + j] < 0) || (channelData[i + j - 1] < 0 && channelData[i + j] >= 0)) zc++;
      }
      const estFreq = (zc * sampleRate) / (2 * frameSize);
      if (estFreq > 50 && estFreq < 2000) {
        pitches.push(estFreq);
      }
    }

    console.log('VoiceAnalysis: Frame analysis', {
      totalFrames: Math.floor((channelData.length - frameSize) / hop),
      silentFrames,
      activeFrames,
      pitchesFound: pitches.length
    });

    if (pitches.length < 6) {
      console.log('VoiceAnalysis: Not enough pitches detected (need 6+)');
      return 0;
    }

    const mean = pitches.reduce((a, b) => a + b, 0) / pitches.length;
    const variance = pitches.map(k => Math.pow(k - mean, 2)).reduce((a, b) => a + b, 0) / pitches.length;
    const stdDev = Math.sqrt(variance);

    // Normalize: low stdDev means monotone. We flip so 1.0 = monotone.
    const monotonyScore = 1.0 - Math.min(stdDev / 50, 1.0);
    const final = Math.max(0, Math.min(1, monotonyScore));

    console.log('VoiceAnalysis: Results', {
      meanPitch: mean.toFixed(1),
      stdDev: stdDev.toFixed(1),
      monotonyScore: final.toFixed(3)
    });

    return final;
  } catch (err) {
    console.warn('Fallback pitch analysis failed', err);
    return 0;
  }
}
