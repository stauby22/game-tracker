import { useState, useRef } from 'react';
import type { GameId } from '../types';
import { GAMES } from '../types';

interface Props {
  gameId: GameId;
  roster: string[];
  onAddToRoster: (name: string) => void;
  onRemoveFromRoster: (name: string) => void;
  onStart: (players: string[]) => void;
  onBack: () => void;
}

export default function PlayerSetup({ gameId, roster, onAddToRoster, onRemoveFromRoster, onStart, onBack }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [orderMode, setOrderMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const game = GAMES.find((g) => g.id === gameId)!;

  function togglePlayer(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  }

  function addNew() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onAddToRoster(trimmed);
    if (!selected.includes(trimmed)) {
      setSelected((prev) => [...prev, trimmed]);
    }
    setNewName('');
    inputRef.current?.focus();
  }

  function moveUp(i: number) {
    if (i === 0) return;
    setSelected((prev) => {
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  }

  function moveDown(i: number) {
    setSelected((prev) => {
      if (i === prev.length - 1) return prev;
      const next = [...prev];
      [next[i], next[i + 1]] = [next[i + 1], next[i]];
      return next;
    });
  }

  const canStart = selected.length >= 2 && selected.length <= 8;

  return (
    <div className="flex flex-col min-h-svh bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 pt-10 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2 rounded-xl active:bg-gray-100 tap-active">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">{game.name}</h1>
          <p className="text-xs text-gray-500">Set up players</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Add new player */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Add New Player</p>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addNew()}
              placeholder="Player name…"
              className="flex-1 px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <button
              onClick={addNew}
              disabled={!newName.trim()}
              className="px-4 py-3 bg-blue-500 text-white rounded-xl font-medium disabled:opacity-40 active:bg-blue-600 tap-active"
            >
              Add
            </button>
          </div>
        </div>

        {/* Saved roster */}
        {roster.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Saved Players</p>
              <button
                onClick={() => setEditMode((v) => !v)}
                className="text-xs text-blue-500 font-medium active:text-blue-700"
              >
                {editMode ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {roster.map((name) => {
                const isSelected = selected.includes(name);
                return (
                  <div key={name} className="flex items-center gap-1">
                    {editMode ? (
                      <button
                        onClick={() => {
                          onRemoveFromRoster(name);
                          setSelected((prev) => prev.filter((p) => p !== name));
                        }}
                        className="flex items-center gap-1 px-3 py-2 rounded-full bg-red-50 border border-red-200 text-red-600 text-sm font-medium active:bg-red-100 tap-active"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {name}
                      </button>
                    ) : (
                      <button
                        onClick={() => togglePlayer(name)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all tap-active ${
                          isSelected
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'bg-gray-50 border-gray-200 text-gray-700 active:bg-gray-100'
                        }`}
                      >
                        {name}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected players & order */}
        {selected.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Play Order ({selected.length})
              </p>
              <button
                onClick={() => setOrderMode((v) => !v)}
                className="text-xs text-blue-500 font-medium active:text-blue-700"
              >
                {orderMode ? 'Done' : 'Reorder'}
              </button>
            </div>
            <div className="space-y-2">
              {selected.map((name, i) => (
                <div
                  key={name}
                  className="flex items-center gap-3 py-2 px-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <span className="text-xs font-bold text-gray-400 w-4 text-center">{i + 1}</span>
                  <span className="flex-1 text-sm font-medium text-gray-800">{name}</span>
                  {orderMode && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => moveUp(i)}
                        disabled={i === 0}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center disabled:opacity-30 active:bg-gray-100 tap-active"
                      >
                        <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => moveDown(i)}
                        disabled={i === selected.length - 1}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center disabled:opacity-30 active:bg-gray-100 tap-active"
                      >
                        <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {!orderMode && (
                    <button
                      onClick={() => togglePlayer(name)}
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center active:bg-gray-300 tap-active"
                    >
                      <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selected.length === 0 && roster.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-4xl mb-2">👥</p>
            <p className="text-sm">Add players to get started</p>
          </div>
        )}
      </div>

      {/* Start button */}
      <div className="px-4 pb-8 pt-3 bg-gray-50 border-t border-gray-100">
        {selected.length < 2 && (
          <p className="text-center text-xs text-gray-400 mb-2">Select at least 2 players</p>
        )}
        <button
          onClick={() => canStart && onStart(selected)}
          disabled={!canStart}
          className="w-full py-4 bg-blue-500 text-white font-semibold rounded-2xl text-base disabled:opacity-40 active:bg-blue-600 transition-colors tap-active"
        >
          Start Game →
        </button>
      </div>
    </div>
  );
}
