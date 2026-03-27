import type { GameSession, HistoryEntry } from '../types';
import { GAMES } from '../types';
import { getRunningTotals } from './Scoreboard';

interface Props {
  session: GameSession;
  onSave: (entry: HistoryEntry) => void;
  onDiscard: () => void;
}

export default function GameOver({ session, onSave, onDiscard }: Props) {
  const isSkipBo = session.gameId === 'skip-bo';
  const game = GAMES.find((g) => g.id === session.gameId)!;

  let standings: { player: string; score: number; phase?: number }[];
  let winner: string;

  if (isSkipBo) {
    const wins = session.skipBoWins ?? {};
    standings = session.players
      .map((p) => ({ player: p, score: wins[p] ?? 0 }))
      .sort((a, b) => b.score - a.score);
    winner = standings[0].player;
  } else {
    const totals = getRunningTotals(session);
    standings = totals.map((t) => ({
      player: t.player,
      score: t.total,
      phase: t.phase,
    }));
    winner = standings[0].player;
  }

  function handleSave() {
    const entry: HistoryEntry = {
      game: session.gameId,
      date: new Date().toISOString(),
      players: session.players,
      winner,
      finalStandings: standings,
    };
    onSave(entry);
  }

  const medals = ['🥇', '🥈', '🥉'];
  const scoreLabel = isSkipBo ? 'wins' : 'pts';

  return (
    <div className="flex flex-col min-h-svh bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-5 text-center">
        <p className="text-4xl mb-2">🎉</p>
        <h1 className="text-xl font-bold text-gray-900">{game.name} Complete!</h1>
        <p className="text-sm text-gray-500 mt-1">{winner} wins!</p>
      </div>

      <div className="flex-1 px-4 py-5 space-y-4">
        {/* Final standings */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Final Standings</p>
          </div>
          {standings.map((s, i) => (
            <div
              key={s.player}
              className={`flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 ${
                i === 0 ? 'bg-amber-50' : ''
              }`}
            >
              <span className="text-xl w-8 text-center">{medals[i] ?? `${i + 1}`}</span>
              <div className="flex-1">
                <span className="font-semibold text-gray-900">{s.player}</span>
                {s.phase !== undefined && (
                  <span className="ml-2 text-xs text-blue-500">Phase {s.phase}</span>
                )}
              </div>
              <span className="font-bold text-gray-900">
                {s.score} {scoreLabel}
              </span>
            </div>
          ))}
        </div>

        {/* Round count */}
        {!isSkipBo && (
          <div className="text-center text-xs text-gray-400">
            {session.rounds.length} rounds played
          </div>
        )}
      </div>

      <div className="px-4 pb-8 pt-3 space-y-3 border-t border-gray-100 bg-gray-50">
        <button
          onClick={handleSave}
          className="w-full py-4 bg-blue-500 text-white font-semibold rounded-2xl text-base active:bg-blue-600 tap-active"
        >
          Save Results
        </button>
        <button
          onClick={onDiscard}
          className="w-full py-3.5 rounded-2xl border border-gray-200 text-gray-500 font-medium text-sm active:bg-gray-100 tap-active"
        >
          Discard & Go Home
        </button>
      </div>
    </div>
  );
}
