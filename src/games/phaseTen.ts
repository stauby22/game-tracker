export const PHASES = [
  '2 sets of 3',
  '1 set of 3 + 1 run of 4',
  '1 set of 4 + 1 run of 4',
  '1 run of 7',
  '1 run of 8',
  '1 run of 9',
  '2 sets of 4',
  '7 cards of 1 color (suit)',
  '1 set of 5 + 1 set of 2',
  '1 set of 5 + 1 set of 3',
];

export const PHASE_10_CARD_VALUES = [
  { label: '2 (Skip)', value: 75 },
  { label: '8 (Wild)', value: 50 },
  { label: 'Ace (Wild)', value: 25 },
  { label: 'Joker (Skip)', value: 25 },
  { label: '3–7, 9 (number cards)', value: 5 },
  { label: '10, J, Q, K (face cards)', value: 10 },
];

export const PHASE_10_RULES = `
**Ace:** Wild card — can substitute for any card in a phase.

**Joker (Skip):** Forces another player to skip their turn. Same player cannot be skipped two consecutive rounds.

**Win condition:** First player to complete Phase 10 AND go out. If multiple finish Phase 10 in the same round, lowest total score wins the tiebreaker.

**Phase advance:** You must complete your current phase AND go out in the same round to advance. Failing to complete your phase means you stay on it next round.
`.trim();

export function getPhaseLabel(phase: number): string {
  if (phase < 1 || phase > 10) return 'Done!';
  return `Phase ${phase}: ${PHASES[phase - 1]}`;
}
