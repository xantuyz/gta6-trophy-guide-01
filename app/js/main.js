// Sunset Platinum boot: loads the trophy data, wires the header (spoiler + theme),
// routes between the five views, updates the progress bar, and handles keyboard
// shortcuts — / for search, 1–5 for the kind filter, Esc to clear the search.
import { loadTrophies } from './data.js';
import { loadState, saveState } from './store.js';
import { gradeBreakdown } from './filters.js';
import { renderChecklist } from './views/checklist.js';
import { renderRoadmap } from './views/roadmap.js';
import { renderMissables } from './views/missables.js';
import { renderPlanner } from './views/planner.js';
import { renderSettings } from './views/settings.js';

// Screenshot seed: ?seed=13 marks 13 trophies earned and seeds a few counters, so
// the progress bar and counters look lived-in. Only when nothing is saved yet, and
// never after the reader has started tracking — a saved state always wins.
const SEED_EARNED = [2, 3, 4, 8, 15, 16, 20, 21, 33, 35, 41, 46, 53];
const SEED_COUNTERS = { 15: 87, 31: 34, 35: 41, 42: 19, 52: 62000 };

const state = loadState();
if (new URLSearchParams(location.search).has('seed') && !localStorage.getItem('sunset-platinum-v1')) {
  for (const id of SEED_EARNED) state.earned[id] = true;
  state.counters = { ...SEED_COUNTERS };
  saveState(state);
}

const ctx = {
  route: 'checklist',
  selectedId: 15,
  filters: { kind: 'all', grade: 'all', status: 'all', search: '' },
  refresh,
};

let trophies = [];
const view = document.getElementById('view');

function updateProgress() {
  const earned = trophies.filter((t) => state.earned[t.id]).length;
  document.getElementById('progressText').textContent = `${earned} of ${trophies.length} earned`;
  document.getElementById('gradeBreakdown').textContent = gradeBreakdown(trophies, state);
  const fill = document.getElementById('progressFill');
  fill.style.width = `${(earned / trophies.length) * 100}%`;
  const bar = document.getElementById('progressBar');
  bar.setAttribute('aria-valuenow', String(earned));
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  document.getElementById('themeToggle').textContent = state.theme === 'dark' ? 'Light theme' : 'Dark theme';
}

function applySpoiler() {
  document.getElementById('spoilerToggle').checked = state.spoiler;
}

function render() {
  document.querySelectorAll('.tabs a').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === ctx.route);
  });
  if (ctx.route === 'roadmap') renderRoadmap(view, trophies, state);
  else if (ctx.route === 'missables') renderMissables(view, trophies, state);
  else if (ctx.route === 'planner') renderPlanner(view, trophies, state, ctx);
  else if (ctx.route === 'settings') renderSettings(view, trophies, state, ctx);
  else renderChecklist(view, trophies, state, ctx);
  updateProgress();
}

function refresh() {
  applyTheme();
  applySpoiler();
  saveState(state);
  render();
}

function routeFromHash() {
  const name = location.hash.replace('#/', '').split('?')[0];
  ctx.route = ['checklist', 'roadmap', 'missables', 'planner', 'settings'].includes(name) ? name : 'checklist';
}

window.addEventListener('hashchange', () => {
  routeFromHash();
  render();
});

document.getElementById('spoilerToggle').addEventListener('change', (e) => {
  state.spoiler = e.target.checked;
  refresh();
});
document.getElementById('themeToggle').addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  refresh();
});

// Keyboard shortcuts: / focuses search, 1–5 pick a kind filter, Esc clears search.
document.addEventListener('keydown', (e) => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName ?? '');
  if (e.key === '/' && !typing) {
    e.preventDefault();
    ctx.route = 'checklist';
    location.hash = '#/checklist';
    document.getElementById('searchInput')?.focus();
  } else if (e.key === 'Escape' && typing) {
    document.activeElement.blur();
    ctx.filters.search = '';
    render();
  } else if (!typing && ['1', '2', '3', '4', '5'].includes(e.key)) {
    ctx.route = 'checklist';
    ctx.filters.kind = ['all', 'story', 'missable', 'collectible', 'activity'][Number(e.key) - 1];
    location.hash = '#/checklist';
    render();
  }
});

try {
  trophies = await loadTrophies();
} catch (err) {
  view.innerHTML = `<p class="empty-note">Could not load the trophy list: ${err.message}</p>`;
  throw err;
}
routeFromHash();
refresh();
