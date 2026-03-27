import { useState } from 'react';
import type { HistoryEntry, GameId } from '../types';
import { GAMES } from '../types';

interface Props {
  history: HistoryEntry[];
  onClear: () => void;
  onBack: () => void;
}

export default function AllTimeStats({ history, onClear, onBack }: Props) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Compute win counts per game per player
  const winsByGame: Record<GameId, Record<string, number>> = {
    'dirty-deuce': {},
    'phase-10': {},
    'mexican-train': {},
    'skip-bo': {},
  };

  history.forEach((entry) => {
    if (!winsByGame[entry.game][entry.winner]) winsByGame[entry.game][entry.winner] = 0;
    winsByGame[entry.game][entry.winner]++;
  });

  const gameNames: Record<GameId, string> = {
    'dirty-deuce': 'Dirty Deuce',
    'phase-10': 'Phase 10',
    'mexican-train': 'Mexican Train',
    'skip-bo': 'Skip-Bo',
  };

  return (
    <div className="flex flex-col min-h-svh bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl active:bg-gray-100 tap-active">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-gray-900">All-Time Stats</h1>
          <p className="text-xs text-gray-500">{history.length} games recorded</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
          <p className="text-5xl mb-3">🏆</p>
          <p className="text-base font-semibold text-gray-700 mb-1">No games played yet</p>
          <p className="text-sm text-gray-400">Start a game and save the results to see stats here!</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Per-game win tables */}
          {GAMES.map((game) => {
            const wins = winsByGame[game.id];
            const entries = Object.entries(wins).sort((a, b) => b[1] - a[1]);
            const gamesPlayed = history.filter((h) => h.game === game.id).length;
            if (gamesPlayed === 0) return null;

            return (
              <div key={game.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-gray-900">{game.name}</span>
                    <span className="ml-2 text-xs text-gray-400">{gamesPlayed} game{gamesPlayed !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                {entries.map(([player, count], i) => (
                  <div key={player} className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 ${i === 0 ? 'bg-amber-50' : ''}`}>
                    {i === 0 && <span className="text-base">🥇</span>}
                    {i === 1 && <span className="text-base">🥈</span>}
                    {i >= 2 && <span className="text-sm text-gray-400 w-5 text-center">{i + 1}</span>}
                    <span className="flex-1 text-sm font-medium text-gray-800">{player}</span>
                    <span className="text-sm font-bold text-gray-900">{count} win{count !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            );
          })}

          {/* Recent games */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-bold text-gray-900">Recent Games</span>
            </div>
            {history.slice(0, 10).map((entry, i) => (
              <div key={i} className="px-4 py-3 border-b border-gray-50 last:border-0 flex items-start gap-3">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{gameNames[entry.game]}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' · '}
                    {entry.players.join(', ')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">{entry.winner}</div>
                  <div className="text-xs text-amber-500">Winner</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="px-4 pb-8 pt-3 border-t border-gray-100">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full py-3.5 rounded-2xl border border-red-200 text-red-500 font-medium text-sm active:bg-red-50 tap-active"
          >
            Clear All History
          </button>
        </div>
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 slide-up">
            <h3 className="text-base font-bold text-gray-900 mb-1">Clear All History?</h3>
            <p className="text-sm text-gray-500 mb-5">This will permanently delete all win history. This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm active:bg-gray-50 tap-active"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowClearConfirm(false); onClear(); }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm active:bg-red-600 tap-active"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
