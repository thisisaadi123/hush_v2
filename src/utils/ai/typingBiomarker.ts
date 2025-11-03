export const TypingBiomarker = {
  keyPressTimestamps: [] as number[],
  backspaceCount: 0,
  _listener: null as ((e: KeyboardEvent) => void) | null,

  startListening(inputId: string) {
    this.stopListening(); // cleanup any existing listener
    const inputElement = document.getElementById(inputId) as HTMLTextAreaElement;
    if (!inputElement) {
      console.error('Biomarker: Could not find input element #' + inputId);
      return;
    }

    this._listener = (e: KeyboardEvent) => {
      this.keyPressTimestamps.push(Date.now());
      if (e.key === 'Backspace') this.backspaceCount++;
    };

    inputElement.addEventListener('keydown', this._listener);
    console.log('TypingBiomarker is listening.');
  },

  stopListening() {
    if (this._listener) {
      const inputElement = document.getElementById('journal-input') as HTMLTextAreaElement;
      if (inputElement) {
        inputElement.removeEventListener('keydown', this._listener);
      }
      this._listener = null;
      this.keyPressTimestamps = [];
      this.backspaceCount = 0;
    }
  },

  analyze(): { finalTypingScore: number } {
    console.log('TypingBiomarker: Analyzing', {
      keypressCount: this.keyPressTimestamps.length,
      backspaceCount: this.backspaceCount,
      hasListener: !!this._listener
    });

    if (this.keyPressTimestamps.length < 10) {
      console.log('TypingBiomarker: Not enough keystrokes, need 10+');
      return { finalTypingScore: 0 };
    }

    const deltas: number[] = [];
    for (let i = 1; i < this.keyPressTimestamps.length; i++) {
      deltas.push(this.keyPressTimestamps[i] - this.keyPressTimestamps[i - 1]);
    }
    const mean = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    const variance = deltas.map(k => Math.pow(k - mean, 2)).reduce((a, b) => a + b, 0) / deltas.length;
    const stdDev = Math.sqrt(variance);
    const backspaceRatio = this.backspaceCount / this.keyPressTimestamps.length;

    console.log('TypingBiomarker: Stats', {
      meanInterval: mean.toFixed(2),
      stdDev: stdDev.toFixed(2),
      backspaceRatio: backspaceRatio.toFixed(3)
    });

    const agitationScore = Math.min(stdDev / 150, 1.0);
    const hesitationScore = Math.min(backspaceRatio / 0.15, 1.0);
    const finalTypingScore = (agitationScore * 0.7) + (hesitationScore * 0.3);

    this.keyPressTimestamps = [];
    this.backspaceCount = 0;
    return { finalTypingScore: Math.max(0, Math.min(1, finalTypingScore)) };
  }
};
