export const SKIP_BO_RULES = `
**Goal:** Be the first to empty your 30-card stockpile.

**Card values:** A=1, 2=2, 3=3 ... 10=10, J=11, Q=12, K=13. Jokers are wild (act as Skip-Bo cards and can represent any number).

**Build piles:** Center build piles go from 1 (Ace) to 13 (King) in sequence. Completed piles are cleared.

**Discard piles:** Each player has up to 4 personal discard piles. You can play from the top of any discard pile.

**Turn:** Draw up to 5 cards in hand. Play cards to build piles (from hand, stockpile top, or discard tops). End turn by discarding one card to a discard pile.

**Win:** First player to play their last stockpile card wins.
`.trim();
