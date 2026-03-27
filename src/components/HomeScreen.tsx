import { GAMES, type GameId } from '../types';

interface Props {
  onStartGame: (gameId: GameId) => void;
  onViewStats: () => void;
}

const gameColors: Record<GameId, { bg: string; border: string; dot: string }> = {
  'dirty-deuce': { bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-400' },
  'phase-10': { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-400' },
  'mexican-train': { bg: 'bg-green-50', border: 'border-green-200', dot: 'bg-green-400' },
  'skip-bo': { bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-400' },
};

const gameEmojis: Record<GameId, string> = {
  'dirty-deuce': '🃏',
  'phase-10': '🎴',
  'mexican-train': '🚂',
  'skip-bo': '♠️',
};

export default function HomeScreen({ onStartGame, onViewStats }: Props) {
  return (
    <div className="flex flex-col min-h-svh bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Game Night</h1>
        <p className="text-sm text-gray-500 mt-1">Score tracker for the family</p>
      </div>

      <div className="flex-1 px-4 py-5 space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Choose a Game</p>

        {GAMES.map((game) => {
          const colors = gameColors[game.id];
          return (
            <button
              key={game.id}
              onClick={() => onStartGame(game.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border ${colors.bg} ${colors.border} active:scale-[0.98] transition-transform tap-active`}
            >
              <span className="text-3xl">{gameEmojis[game.id]}</span>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">{game.name}</div>
                <div className="text-sm text-gray-500">{game.tagline}</div>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          );
        })}
      </div>

      {/* All-time stats button */}
      <div className="px-4 pb-8 pt-2">
        <button
          onClick={onViewStats}
          className="w-full py-3.5 rounded-2xl border border-gray-200 bg-white text-gray-700 font-medium text-sm active:bg-gray-50 transition-colors tap-active flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          All-Time Stats
        </button>
      </div>
    </div>
  );
}
