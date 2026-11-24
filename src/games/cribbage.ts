export const CRIBBAGE_TARGET = 121;

export const CRIBBAGE_RULES = `
**Goal:** Be the first to peg **121** points. Each hand, enter the points each player scored — totals accumulate and the highest score leads. First to 121 wins.

**The deal:** 2 players get 6 cards, 3–4 players get 5 (dealer keeps the extra in a 3-handed game). Each player discards to the dealer's **crib**.

**The play (pegging):** Players alternate laying cards, calling the running total. Score for hitting **15** (2 pts) or **31** (2 pts), **pairs** (2), **runs** (1 each), and the **go** / last card (1).

**The show (counting hands):** After the play, each hand is counted, then the dealer counts the crib. Score **fifteens** (2 each), **pairs** (2), **runs** (1/card), **flushes** (4, or 5 with the starter), and **his nobs** — jack matching the starter's suit (1).

**His heels:** If the starter card is a jack, the dealer pegs 2 immediately.

**Skunk:** Winning before the loser reaches 91 is a skunk; before 61 is a double skunk.

**Tip:** Enter each player's total points per hand (pegging + the show). The tracker keeps the running total to 121.
`.trim();
