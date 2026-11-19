// Saved progress for Sunset Platinum: earned trophies, PSN counters, per-trophy notes,
// spoiler setting and theme. Everything lives in localStorage; nothing leaves the browser.
// Export writes a JSON file, import reads one back and validates it before applying.
const STORAGE_KEY = 'sunset-platinum-v1';

export const defaultState = {
  earned: {},
  counters: {},
  notes: {},
  spoiler: true,
  theme: 'dark',
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState, earned: {}, counters: {}, notes: {} };
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      earned: parsed.earned ?? {},
      counters: parsed.counters ?? {},
      notes: parsed.notes ?? {},
    };
  } catch {
    return { ...defaultState, earned: {}, counters: {}, notes: {} };
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function toggleEarned(state, trophyId) {
  state.earned[trophyId] = !state.earned[trophyId];
  if (!state.earned[trophyId]) delete state.earned[trophyId];
  saveState(state);
}

export function setCounter(state, trophyId, value) {
  const n = Math.max(0, Math.floor(Number(value) || 0));
  if (n === 0) delete state.counters[trophyId];
  else state.counters[trophyId] = n;
  saveState(state);
}

export function setNote(state, trophyId, text) {
  if (!text.trim()) delete state.notes[trophyId];
  else state.notes[trophyId] = text;
  saveState(state);
}

export function exportProgress(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sunset-platinum-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function validateImport(doc) {
  if (!doc || typeof doc !== 'object') return 'Not a progress file: expected a JSON object.';
  if (doc.earned && typeof doc.earned !== 'object') return 'Bad progress file: earned must be an object.';
  if (doc.counters && typeof doc.counters !== 'object') return 'Bad progress file: counters must be an object.';
  if (doc.notes && typeof doc.notes !== 'object') return 'Bad progress file: notes must be an object.';
  return null;
}

export function importProgress(state, doc) {
  const error = validateImport(doc);
  if (error) return error;
  state.earned = doc.earned ?? {};
  state.counters = doc.counters ?? {};
  state.notes = doc.notes ?? {};
  if (typeof doc.spoiler === 'boolean') state.spoiler = doc.spoiler;
  if (doc.theme === 'light' || doc.theme === 'dark') state.theme = doc.theme;
  saveState(state);
  return null;
}

export function resetProgress(state) {
  state.earned = {};
  state.counters = {};
  state.notes = {};
  saveState(state);
}
