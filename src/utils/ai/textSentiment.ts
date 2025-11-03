// Lightweight in-browser sentiment approximation to avoid bundling a Node-only
// dependency. This is a simple lexicon-based scanner that returns a
// normalized "negativity" score between 0 (positive) and 1 (negative).
const negativeWords = new Set([
  'sad','angry','upset','depressed','anxious','lonely','hate','bad','hurt','helpless','overwhelmed','stressed','depressed','panic','panic','fear','scared'
]);
const positiveWords = new Set([
  'happy','grateful','good','calm','peace','relieved','hopeful','okay','well','better','content','satisfied','joy','love'
]);

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/["'`\-–—():;,.!?\/\\]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function getTextScore(text: string): number {
  if (!text) {
    console.log('TextSentiment: Empty text, returning 0');
    return 0;
  }
  const tokens = tokenize(text);
  if (tokens.length === 0) {
    console.log('TextSentiment: No tokens after filtering, returning 0');
    return 0;
  }

  console.log('TextSentiment: Analyzing tokens:', tokens);
  let score = 0;
  const matches: string[] = [];
  for (const t of tokens) {
    if (negativeWords.has(t)) {
      score -= 1;
      matches.push(`-${t}`);
    }
    if (positiveWords.has(t)) {
      score += 1;
      matches.push(`+${t}`);
    }
  }
  console.log('TextSentiment: Matched words:', matches);

  // Normalize raw score to range -10..+10 then map to 0..1 with flip (0 good, 1 bad)
  const clamped = Math.max(-10, Math.min(10, score));
  const normalized = (clamped * -1 + 10) / 20;
  const final = Math.max(0, Math.min(1, normalized));
  console.log('TextSentiment: raw score:', score, 'normalized:', final);
  return final;
}

export default getTextScore;
