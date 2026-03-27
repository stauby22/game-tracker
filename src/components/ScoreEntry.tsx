import { useState } from 'react';
import type { GameSession, Round } from '../types';
import { DIRTY_DEUCE_ROUNDS, getRoundLabel } from '../games/dirtyDeuce';
import Scoreboard from './Scoreboard';
import RoundHistory from './RoundHistory';
import RulesReference from './RulesReference';
import NumberPad from './NumberPad';

interface Props {
  session: GameSession;
  onAddRound: (round: Omit<Round, 'id'>) => void;
  onUpdateRound: (roundId: string, scores: Round['scores']) => void;
  onUndoLastRound: () => void;
  onRecordSkipBoWin: (player: string) => void;
  onEndGame: () => void;
  onBack: () => void;
}

type Tab = 'entry' | 'history';

export default function ScoreEntry({
  session,
  onAddRound,
  onUpdateRound,
  onUndoLastRound,
  onRecordSkipBoWin,
  onEndGame,
  onBack,
}: Props) {
  const [scores, setScores] = useState<Record<string, string>>({});
  const [phaseCompleted, setPhaseCompleted] = useState<Record<string, boolean>>({});
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showUndoConfirm, setShowUndoConfirm] = useState(false);
  const [editingRound, setEditingRound] = useState<Round | null>(null);
  const [tab, setTab] = useState<Tab>('entry');
  const [editScores, setEditScores] = useState<Record<string, string>>({});
  const [editPhases, setEditPhases] = useState<Record<string, boolean>>({});
  const [editActiveInput, setEditActiveInput] = useState<string | null>(null);

  const isPhase10 = session.gameId === 'phase-10';
  const isDirtyDeuce = session.gameId === 'dirty-deuce';
  const isSkipBo = session.gameId === 'skip-bo';

  const roundIndex = session.rounds.length;
  const isLastDirtyDeuceRound = isDirtyDeuce && roundIndex === DIRTY_DEUCE_ROUNDS - 1;
  const isDirtyDeuceComplete = isDirtyDeuce && roundIndex >= DIRTY_DEUCE_ROUNDS;

  const allFilled = session.players.every((p) => scores[p] !== undefined && scores[p] !== '');

  function submitRound() {
    if (!allFilled) return;
    const roundScores = session.players.map((p) => ({
      player: p,
      score: parseInt(scores[p], 10) || 0,
      phaseCompleted: isPhase10 ? (phaseCompleted[p] ?? false) : undefined,
    }));
    onAddRound({ scores: roundScores });
    setScores({});
    setPhaseCompleted({});
    setActiveInput(null);

    // Auto-end for dirty deuce after round 8
    if (isDirtyDeuce && roundIndex === DIRTY_DEUCE_ROUNDS - 1) {
      setTimeout(() => setShowEndConfirm(true), 300);
    }
  }

  function handleEditRound(round: Round) {
    setEditingRound(round);
    const s: Record<string, string> = {};
    const p: Record<string, boolean> = {};
    round.scores.forEach((rs) => {
      s[rs.player] = String(rs.score);
      p[rs.player] = rs.phaseCompleted ?? false;
    });
    setEditScores(s);
    setEditPhases(p);
    setEditActiveInput(null);
    setTab('history');
  }

  function saveEditRound() {
    if (!editingRound) return;
    const roundScores = session.players.map((p) => ({
      player: p,
      score: parseInt(editScores[p] ?? '0', 10) || 0,
      phaseCompleted: isPhase10 ? (editPhases[p] ?? false) : undefined,
    }));
    onUpdateRound(editingRound.id, roundScores);
    setEditingRound(null);
    setEditActiveInput(null);
  }

  const gameTitles: Record<string, string> = {
    'dirty-deuce': 'Dirty Deuce',
    'phase-10': 'Phase 10',
    'mexican-train': 'Mexican Train',
    'skip-bo': 'Skip-Bo',
  };

  // Skip-Bo win tracker UI
  if (isSkipBo) {
    return (
      <div className="flex flex-col min-h-svh bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-3 flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-xl active:bg-gray-100 tap-active">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold text-gray-900">Skip-Bo</h1>
            <p className="text-xs text-gray-500">Win tracker</p>
          </div>
          <button onClick={() => setShowRules(true)} className="p-2 rounded-xl active:bg-gray-100 tap-active">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        <Scoreboard session={session} />

        <div className="flex-1 px-4 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Record a Win</p>
          <div className="grid grid-cols-2 gap-3">
            {session.players.map((p) => (
              <button
                key={p}
                onClick={() => onRecordSkipBoWin(p)}
                className="py-5 rounded-2xl bg-white border border-gray-200 font-semibold text-gray-800 text-sm active:bg-purple-50 active:border-purple-300 tap-active"
              >
                <div className="text-2xl mb-1">🏆</div>
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-8 pt-2 space-y-2">
          <button
            onClick={() => setShowEndConfirm(true)}
            className="w-full py-3.5 rounded-2xl border border-red-200 text-red-500 font-medium text-sm active:bg-red-50 tap-active"
          >
            End Session
          </button>
        </div>

        {showRules && <RulesReference gameId={session.gameId} onClose={() => setShowRules(false)} />}
        {showEndConfirm && (
          <ConfirmDialog
            title="End Skip-Bo Session?"
            message="This will save the session results and return to home."
            confirmLabel="End Session"
            onConfirm={() => { setShowEndConfirm(false); onEndGame(); }}
            onCancel={() => setShowEndConfirm(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-svh bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl active:bg-gray-100 tap-active">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-gray-900">{gameTitles[session.gameId]}</h1>
          <p className="text-xs text-gray-500">
            {isDirtyDeuce
              ? getRoundLabel(roundIndex)
              : `Round ${roundIndex + 1}`}
          </p>
        </div>
        <button onClick={() => setShowRules(true)} className="p-2 rounded-xl active:bg-gray-100 tap-active">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Sticky scoreboard */}
      <div className="sticky top-0 z-10">
        <Scoreboard session={session} />
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-100">
        {(['entry', 'history'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setEditingRound(null); }}
            className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400'
            }`}
          >
            {t === 'entry' ? 'Score Entry' : 'History'}
          </button>
        ))}
      </div>

      {tab === 'entry' && (
        <div className="flex-1 flex flex-col">
          {isDirtyDeuceComplete ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <p className="text-4xl mb-3">🎉</p>
              <p className="text-lg font-bold text-gray-900 mb-1">All 8 rounds complete!</p>
              <p className="text-sm text-gray-500 mb-6">Ready to see the final standings?</p>
              <button
                onClick={onEndGame}
                className="w-full max-w-xs py-4 bg-blue-500 text-white font-semibold rounded-2xl active:bg-blue-600 tap-active"
              >
                See Final Results
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                {session.players.map((player) => {
                  const isActive = activeInput === player;
                  const val = scores[player] ?? '';
                  const hasScore = val !== '';
                  const phase = session.playerPhases?.[player];

                  return (
                    <div key={player}>
                      <button
                        onClick={() => setActiveInput(isActive ? null : player)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all tap-active ${
                          isActive
                            ? 'border-blue-400 bg-blue-50'
                            : hasScore
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-gray-900 text-sm">{player}</div>
                          {isPhase10 && phase !== undefined && (
                            <div className="text-xs text-blue-500">Phase {phase}</div>
                          )}
                        </div>
                        <div className={`text-2xl font-bold tabular-nums ${hasScore ? 'text-gray-900' : 'text-gray-300'}`}>
                          {hasScore ? val : '—'}
                        </div>
                        {hasScore && (
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      {isActive && (
                        <div className="mt-2 slide-up">
                          {isPhase10 && (
                            <button
                              onClick={() => setPhaseCompleted((prev) => ({ ...prev, [player]: !prev[player] }))}
                              className={`w-full mb-2 py-2.5 rounded-xl border text-sm font-medium transition-colors tap-active ${
                                phaseCompleted[player]
                                  ? 'bg-blue-500 border-blue-500 text-white'
                                  : 'bg-white border-gray-200 text-gray-700'
                              }`}
                            >
                              {phaseCompleted[player] ? '✓ Completed phase' : 'Completed phase?'}
                            </button>
                          )}
                          <NumberPad
                            value={val}
                            onChange={(v) => setScores((prev) => ({ ...prev, [player]: v }))}
                            onDone={() => {
                              const next = session.players.indexOf(player) + 1;
                              setActiveInput(next < session.players.length ? session.players[next] : null);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom actions */}
              <div className="px-4 pb-8 pt-3 bg-gray-50 border-t border-gray-100 space-y-2">
                <button
                  onClick={submitRound}
                  disabled={!allFilled}
                  className="w-full py-4 bg-blue-500 text-white font-semibold rounded-2xl text-base disabled:opacity-40 active:bg-blue-600 tap-active"
                >
                  {isLastDirtyDeuceRound ? 'Submit Final Round' : 'Submit Round'}
                </button>
                <div className="flex gap-2">
                  {session.rounds.length > 0 && (
                    <button
                      onClick={() => setShowUndoConfirm(true)}
                      className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium active:bg-gray-100 tap-active"
                    >
                      Undo Last
                    </button>
                  )}
                  <button
                    onClick={() => setShowEndConfirm(true)}
                    className="flex-1 py-3 rounded-xl border border-red-200 text-red-500 text-sm font-medium active:bg-red-50 tap-active"
                  >
                    End Game
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'history' && (
        <div className="flex-1 overflow-y-auto">
          {editingRound ? (
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-700">Editing Round</p>
                <button onClick={() => { setEditingRound(null); setEditActiveInput(null); }} className="text-xs text-gray-400">Cancel</button>
              </div>
              {session.players.map((player) => {
                const isActive = editActiveInput === player;
                const val = editScores[player] ?? '';
                return (
                  <div key={player}>
                    <button
                      onClick={() => setEditActiveInput(isActive ? null : player)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all tap-active ${
                        isActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex-1 text-left font-semibold text-gray-900 text-sm">{player}</div>
                      <div className="text-2xl font-bold text-gray-900 tabular-nums">{val || '—'}</div>
                    </button>
                    {isActive && (
                      <div className="mt-2 slide-up">
                        {isPhase10 && (
                          <button
                            onClick={() => setEditPhases((prev) => ({ ...prev, [player]: !prev[player] }))}
                            className={`w-full mb-2 py-2.5 rounded-xl border text-sm font-medium transition-colors tap-active ${
                              editPhases[player] ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-200 text-gray-700'
                            }`}
                          >
                            {editPhases[player] ? '✓ Completed phase' : 'Completed phase?'}
                          </button>
                        )}
                        <NumberPad
                          value={val}
                          onChange={(v) => setEditScores((prev) => ({ ...prev, [player]: v }))}
                          onDone={() => {
                            const next = session.players.indexOf(player) + 1;
                            setEditActiveInput(next < session.players.length ? session.players[next] : null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              <button
                onClick={saveEditRound}
                className="w-full py-4 bg-blue-500 text-white font-semibold rounded-2xl active:bg-blue-600 tap-active"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <RoundHistory session={session} onEditRound={handleEditRound} />
          )}
        </div>
      )}

      {showRules && <RulesReference gameId={session.gameId} onClose={() => setShowRules(false)} />}

      {showEndConfirm && (
        <ConfirmDialog
          title="End Game?"
          message="This will take you to the final standings screen."
          confirmLabel="End Game"
          onConfirm={() => { setShowEndConfirm(false); onEndGame(); }}
          onCancel={() => setShowEndConfirm(false)}
        />
      )}

      {showUndoConfirm && (
        <ConfirmDialog
          title="Undo Last Round?"
          message="The last round's scores will be removed."
          confirmLabel="Undo"
          onConfirm={() => { setShowUndoConfirm(false); onUndoLastRound(); }}
          onCancel={() => setShowUndoConfirm(false)}
        />
      )}
    </div>
  );
}

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl w-full max-w-sm p-5 slide-up">
        <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-5">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm active:bg-gray-50 tap-active"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm active:bg-red-600 tap-active"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
