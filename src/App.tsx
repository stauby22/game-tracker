import { useState } from 'react';
import type { GameId, HistoryEntry, GameSession } from './types';
import { useGameSession } from './hooks/useGameSession';
import { usePlayerRoster } from './hooks/usePlayerRoster';
import { useGameHistory } from './hooks/useGameHistory';
import HomeScreen from './components/HomeScreen';
import PlayerSetup from './components/PlayerSetup';
import ScoreEntry from './components/ScoreEntry';
import GameOver from './components/GameOver';
import AllTimeStats from './components/AllTimeStats';

type Screen = 'home' | 'setup' | 'game' | 'gameover' | 'stats';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [pendingGameId, setPendingGameId] = useState<GameId | null>(null);
  const [gameOverSession, setGameOverSession] = useState<GameSession | null>(null);

  const { session, startSession, addRound, updateRound, undoLastRound, recordSkipBoWin, endSession } = useGameSession();
  const { roster, addToRoster, removeFromRoster } = usePlayerRoster();
  const { history, addEntry, clearHistory } = useGameHistory();

  function handleSelectGame(gameId: GameId) {
    setPendingGameId(gameId);
    setScreen('setup');
  }

  function handleStartGame(players: string[]) {
    if (!pendingGameId) return;
    startSession(pendingGameId, players);
    setScreen('game');
  }

  function handleEndGame() {
    setGameOverSession(session);
    setScreen('gameover');
  }

  function handleSaveResult(entry: HistoryEntry) {
    addEntry(entry);
    endSession();
    setGameOverSession(null);
    setScreen('home');
  }

  function handleDiscard() {
    endSession();
    setGameOverSession(null);
    setScreen('home');
  }

  function handleBackFromSetup() {
    setPendingGameId(null);
    setScreen('home');
  }

  return (
    <div className="max-w-lg mx-auto w-full min-h-svh">
      {screen === 'home' && (
        <HomeScreen onStartGame={handleSelectGame} onViewStats={() => setScreen('stats')} />
      )}

      {screen === 'setup' && pendingGameId && (
        <PlayerSetup
          gameId={pendingGameId}
          roster={roster}
          onAddToRoster={addToRoster}
          onRemoveFromRoster={removeFromRoster}
          onStart={handleStartGame}
          onBack={handleBackFromSetup}
        />
      )}

      {screen === 'game' && session && (
        <ScoreEntry
          session={session}
          onAddRound={addRound}
          onUpdateRound={updateRound}
          onUndoLastRound={undoLastRound}
          onRecordSkipBoWin={recordSkipBoWin}
          onEndGame={handleEndGame}
          onBack={handleEndGame}
        />
      )}

      {screen === 'gameover' && gameOverSession && (
        <GameOver
          session={gameOverSession}
          onSave={handleSaveResult}
          onDiscard={handleDiscard}
        />
      )}

      {screen === 'stats' && (
        <AllTimeStats
          history={history}
          onClear={clearHistory}
          onBack={() => setScreen('home')}
        />
      )}
    </div>
  );
}
