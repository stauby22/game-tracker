import type { GameSession } from '../types';

interface Props {
  session: GameSession;
}

export function getRunningTotals(session: GameSession): { player: string; total: number; phase?: number }[] {
  const totals: Record<string, number> = {};
  session.players.forEach((p) => (totals[p] = 0));

  session.rounds.forEach((round) => {
    round.scores.forEach((s) => {
      totals[s.player] = (totals[s.player] ?? 0) + s.score;
    });
  });

  return session.players
    .map((p) => ({
      player: p,
      total: totals[p] ?? 0,
      phase: session.playerPhases?.[p],
    }))
    .sort((a, b) => a.total - b.total);
}

export default function Scoreboard({ session }: Props) {
  const standings = getRunningTotals(session);
  const isSkipBo = session.gameId === 'skip-bo';
  const isPhase10 = session.gameId === 'phase-10';

  if (isSkipBo) {
    const wins = session.skipBoWins ?? {};
    return (
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 py-2.5 flex gap-3 overflow-x-auto">
          {session.players.map((p) => {
            const w = wins[p] ?? 0;
            const actualLeader = session.players.reduce((best, cur) =>
              (wins[cur] ?? 0) > (wins[best] ?? 0) ? cur : best
            );
            const leading = p === actualLeader && w > 0;
            return (
              <div
                key={p}
                className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border ${
                  leading
                    ? 'border-amber-300 bg-amber-50 leader-glow'
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                {leading && <span className="text-xs text-amber-500 font-bold mb-0.5">👑</span>}
                <span className="text-sm font-semibold text-gray-800">{p}</span>
                <span className="text-lg font-bold text-gray-900">{w}</span>
                <span className="text-xs text-gray-400">wins</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="px-4 py-2.5 flex gap-2.5 overflow-x-auto">
        {standings.map((s, i) => {
          const isLeader = i === 0;
          return (
            <div
              key={s.player}
              className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border min-w-[72px] ${
                isLeader
                  ? 'border-amber-300 bg-amber-50 leader-glow'
                  : 'border-gray-100 bg-gray-50'
              }`}
            >
              {isLeader && <span className="text-xs text-amber-500 font-bold mb-0.5">👑</span>}
              <span className="text-xs font-semibold text-gray-700 truncate max-w-[64px] text-center">{s.player}</span>
              <span className="text-xl font-bold text-gray-900">{s.total}</span>
              {isPhase10 && s.phase !== undefined && (
                <span className="text-xs text-blue-500 font-medium text-center leading-tight mt-0.5">
                  P{s.phase}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
