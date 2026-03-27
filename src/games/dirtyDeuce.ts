export const DIRTY_DEUCE_ROUNDS = 8;

export function getRoundLabel(roundIndex: number): string {
  const cards = DIRTY_DEUCE_ROUNDS - roundIndex;
  return `Round ${roundIndex + 1} · Dealing ${cards} card${cards !== 1 ? 's' : ''}`;
}

export const DIRTY_DEUCE_CARD_VALUES = [
  { label: '2 (Draw 2)', value: 75 },
  { label: '8 (Wild)', value: 50 },
  { label: 'Ace (Reverse)', value: 25 },
  { label: 'Joker (Skip)', value: 25 },
  { label: '3–7, 9 (number cards)', value: 5 },
  { label: '10, J, Q, K (face cards)', value: 10 },
];

export const DIRTY_DEUCE_RULES = `
**2 (Draw 2):** Makes the next player draw 2 cards. Stackable — if they also play a 2, the next player draws 4, etc.

**8 (Wild):** Can be played on any card. Player declares the new suit.

**Ace (Reverse):** Reverses the direction of play.

**Joker (Skip):** Player chooses who to skip. Same player cannot be skipped two rounds in a row.

**Lowest total score after 8 rounds wins.**
`.trim();
