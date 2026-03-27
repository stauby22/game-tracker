import { useState, useCallback } from 'react';
import type { GameSession, Round, GameId } from '../types';

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

export function useGameSession() {
  const [session, setSession] = useState<GameSession | null>(null);

  const startSession = useCallback((gameId: GameId, players: string[]) => {
    const phases: Record<string, number> = {};
    const wins: Record<string, number> = {};
    players.forEach((p) => {
      phases[p] = 1;
      wins[p] = 0;
    });
    setSession({
      gameId,
      players,
      rounds: [],
      playerPhases: gameId === 'phase-10' ? phases : undefined,
      skipBoWins: gameId === 'skip-bo' ? wins : undefined,
      startedAt: new Date().toISOString(),
    });
  }, []);

  const addRound = useCallback((round: Omit<Round, 'id'>) => {
    setSession((prev) => {
      if (!prev) return prev;
      const newRound: Round = { ...round, id: makeId() };
      let updatedPhases = prev.playerPhases ? { ...prev.playerPhases } : undefined;

      // advance phases for phase-10
      if (prev.gameId === 'phase-10' && updatedPhases) {
        newRound.scores.forEach((s) => {
          if (s.phaseCompleted && updatedPhases![s.player] < 10) {
            updatedPhases![s.player] += 1;
          }
        });
      }

      return {
        ...prev,
        rounds: [...prev.rounds, newRound],
        playerPhases: updatedPhases,
      };
    });
  }, []);

  const updateRound = useCallback((roundId: string, scores: Round['scores']) => {
    setSession((prev) => {
      if (!prev) return prev;
      const rounds = prev.rounds.map((r) =>
        r.id === roundId ? { ...r, scores } : r
      );
      // Recompute phases for phase-10
      let updatedPhases: Record<string, number> | undefined;
      if (prev.gameId === 'phase-10') {
        updatedPhases = {};
        prev.players.forEach((p) => (updatedPhases![p] = 1));
        rounds.forEach((r) => {
          r.scores.forEach((s) => {
            if (s.phaseCompleted && updatedPhases![s.player] < 10) {
              updatedPhases![s.player] += 1;
            }
          });
        });
      }
      return { ...prev, rounds, playerPhases: updatedPhases ?? prev.playerPhases };
    });
  }, []);

  const undoLastRound = useCallback(() => {
    setSession((prev) => {
      if (!prev || prev.rounds.length === 0) return prev;
      const rounds = prev.rounds.slice(0, -1);
      let updatedPhases: Record<string, number> | undefined;
      if (prev.gameId === 'phase-10') {
        updatedPhases = {};
        prev.players.forEach((p) => (updatedPhases![p] = 1));
        rounds.forEach((r) => {
          r.scores.forEach((s) => {
            if (s.phaseCompleted && updatedPhases![s.player] < 10) {
              updatedPhases![s.player] += 1;
            }
          });
        });
      }
      return { ...prev, rounds, playerPhases: updatedPhases ?? prev.playerPhases };
    });
  }, []);

  const recordSkipBoWin = useCallback((player: string) => {
    setSession((prev) => {
      if (!prev || !prev.skipBoWins) return prev;
      return {
        ...prev,
        skipBoWins: {
          ...prev.skipBoWins,
          [player]: (prev.skipBoWins[player] ?? 0) + 1,
        },
      };
    });
  }, []);

  const endSession = useCallback(() => {
    setSession(null);
  }, []);

  return {
    session,
    startSession,
    addRound,
    updateRound,
    undoLastRound,
    recordSkipBoWin,
    endSession,
  };
}
