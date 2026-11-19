// Filtering, search and the spoiler rule for the checklist.
// Spoiler rule: while spoilers are off, a story trophy that is not earned yet shows as
// "Hidden story trophy" — its name and description stay hidden until it is earned.
export const KIND_FILTERS = [
  { id: 'all', label: 'All kinds' },
  { id: 'story', label: 'Story' },
  { id: 'missable', label: 'Missable' },
  { id: 'collectible', label: 'Collectibles' },
  { id: 'activity', label: 'Activities' },
];

export function isHiddenBySpoiler(trophy, state) {
  return state.spoiler && trophy.kind === 'story' && !state.earned[trophy.id];
}

// Spoiler-safe display text: story trophies stay masked everywhere they appear —
// checklist, roadmap, planner, missables and search — until they are earned.
// The rule keys off the story kind, not the official hidden flag.
export function displayName(trophy, state) {
  return isHiddenBySpoiler(trophy, state) ? 'Hidden story trophy' : trophy.name;
}

export function displayDescription(trophy, state) {
  return isHiddenBySpoiler(trophy, state)
    ? 'Spoilers are off — earn it to reveal.'
    : trophy.description;
}

export function visibleText(trophy, state) {
  if (isHiddenBySpoiler(trophy, state)) return 'hidden story trophy';
  return `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
}

export function applyFilters(trophies, state, filters) {
  const q = (filters.search || '').trim().toLowerCase();
  return trophies.filter((t) => {
    if (filters.kind === 'missable' && !t.missable) return false;
    if (filters.kind !== 'all' && filters.kind !== 'missable' && t.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (filters.status === 'earned' && !state.earned[t.id]) return false;
    if (filters.status === 'remaining' && state.earned[t.id]) return false;
    if (q && !visibleText(t, state).includes(q)) return false;
    return true;
  });
}

export function gradeBreakdown(trophies, state) {
  const parts = [];
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const total = trophies.filter((t) => t.grade === grade).length;
    const got = trophies.filter((t) => t.grade === grade && state.earned[t.id]).length;
    parts.push(`${grade} ${got}/${total}`);
  }
  return parts.join(' · ');
}
