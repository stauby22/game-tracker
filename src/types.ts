export type GameId = 'dirty-deuce' | 'phase-10' | 'mexican-train' | 'skip-bo';

export interface PlayerRoundScore {
  player: string;
  score: number;
  phaseCompleted?: boolean; // phase-10 only
}

export interface Round {
  id: string;
  scores: PlayerRoundScore[];
}

export interface GameSession {
  gameId: GameId;
  players: string[];
  rounds: Round[];
  // phase-10 only: current phase per player (1-10)
  playerPhases?: Record<string, number>;
  // skip-bo: win tallies within session
  skipBoWins?: Record<string, number>;
  startedAt: string;
}

export interface HistoryEntry {
  game: GameId;
  date: string;
  players: string[];
  winner: string;
  finalStandings: { player: string; score: number; phase?: number }[];
}

export interface GameMeta {
  id: GameId;
  name: string;
  tagline: string;
  color: string;
  accent: string;
}

export const GAMES: GameMeta[] = [
  {
    id: 'dirty-deuce',
    name: 'Dirty Deuce',
    tagline: '8 rounds, 2s wreck you',
    color: 'bg-red-50',
    accent: 'border-red-400',
  },
  {
    id: 'phase-10',
    name: 'Phase 10',
    tagline: 'Race through 10 phases',
    color: 'bg-blue-50',
    accent: 'border-blue-400',
  },
  {
    id: 'mexican-train',
    name: 'Mexican Train',
    tagline: 'Dominoes, low pips win',
    color: 'bg-green-50',
    accent: 'border-green-400',
  },
  {
    id: 'skip-bo',
    name: 'Skip-Bo',
    tagline: 'Empty your stockpile first',
    color: 'bg-purple-50',
    accent: 'border-purple-400',
  },
];
