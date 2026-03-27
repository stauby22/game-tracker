import { useState, useCallback } from 'react';

const ROSTER_KEY = 'gameTracker_playerRoster';

function loadRoster(): string[] {
  try {
    const raw = localStorage.getItem(ROSTER_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRoster(roster: string[]) {
  localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
}

export function usePlayerRoster() {
  const [roster, setRoster] = useState<string[]>(loadRoster);

  const addToRoster = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setRoster((prev) => {
      if (prev.includes(trimmed)) return prev;
      const next = [...prev, trimmed];
      saveRoster(next);
      return next;
    });
  }, []);

  const removeFromRoster = useCallback((name: string) => {
    setRoster((prev) => {
      const next = prev.filter((p) => p !== name);
      saveRoster(next);
      return next;
    });
  }, []);

  const reorderRoster = useCallback((newOrder: string[]) => {
    setRoster(newOrder);
    saveRoster(newOrder);
  }, []);

  return { roster, addToRoster, removeFromRoster, reorderRoster };
}
