// Loads the trophy list (app/data/trophies.json) at run time. The file is data, not code:
// it is fetched from the same folder the app is served from, never from the network.
export async function loadTrophies() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('Could not load data/trophies.json');
  const doc = await response.json();
  return doc.trophies;
}

export function gradeOrder(grade) {
  return { platinum: 0, gold: 1, silver: 2, bronze: 3 }[grade] ?? 4;
}

export function isStoryTrophy(trophy) {
  return trophy.kind === 'story';
}
