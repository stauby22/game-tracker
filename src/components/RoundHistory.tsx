import type { GameSession, Round } from '../types';

interface Props {
  session: GameSession;
  onEditRound: (round: Round) => void;
}

export default function RoundHistory({ session, onEditRound }: Props) {
  if (session.rounds.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 text-gray-400">
        <p className="text-4xl mb-2">📋</p>
        <p className="text-sm">No rounds yet</p>
      </div>
    );
  }

  // Compute running totals per round
  const runningTotals: Record<string, number> = {};
  session.players.forEach((p) => (runningTotals[p] = 0));

  const roundsWithTotals = session.rounds.map((round, i) => {
    round.scores.forEach((s) => {
      runningTotals[s.player] = (runningTotals[s.player] ?? 0) + s.score;
    });
    return { round, snapshot: { ...runningTotals }, index: i };
  });

  return (
    <div className="px-4 py-4 space-y-3">
      {roundsWithTotals.slice().reverse().map(({ round, snapshot, index }) => (
        <button
          key={round.id}
          onClick={() => onEditRound(round)}
          className="w-full text-left bg-white rounded-2xl border border-gray-200 overflow-hidden active:bg-gray-50 tap-active"
        >
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Round {index + 1}</span>
            <span className="text-xs text-blue-500 font-medium">Edit</span>
          </div>
          <div className="px-4 py-2 divide-y divide-gray-50">
            {session.players.map((p) => {
              const rs = round.scores.find((s) => s.player === p);
              return (
                <div key={p} className="flex items-center py-1.5">
                  <span className="flex-1 text-sm text-gray-700">{p}</span>
                  <span className="text-sm text-gray-500 w-12 text-right">+{rs?.score ?? 0}</span>
                  <span className="text-sm font-bold text-gray-900 w-14 text-right">{snapshot[p]}</span>
                </div>
              );
            })}
          </div>
        </button>
      ))}
    </div>
  );
}
