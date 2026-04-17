import { useState, useEffect, useCallback } from 'react';
import { defaultAppState } from '../data/defaults';

const STORAGE_KEY = 'notre_budget_v1';

export function useAppState() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with defaults to handle new fields
        const def = defaultAppState();
        return {
          ...def,
          ...parsed,
          alex: { ...def.alex, ...parsed.alex },
          aurelie: { ...def.aurelie, ...parsed.aurelie },
          commun: { ...def.commun, ...parsed.commun },
        };
      }
    } catch (e) {}
    return defaultAppState();
  });

  const save = useCallback((newState) => {
    const updated = { ...newState, lastUpdated: new Date().toISOString() };
    setState(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  }, []);

  const updatePerson = useCallback((person, updates) => {
    save(prev => ({ ...prev, [person]: { ...prev[person], ...updates } }));
  }, [save]);

  // Save wrapper that works with functional updates
  const safeSave = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const updated = { ...next, lastUpdated: new Date().toISOString() };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  return { state, save: safeSave, updatePerson };
}
