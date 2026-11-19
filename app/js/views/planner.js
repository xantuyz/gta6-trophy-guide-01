// Next up planner: what to do next, given what is already earned.
// Order: the possibly-missable trophy first, then the counted trophy closest to its
// target, then the earliest unfinished story trophy, then anything else remaining.
// Spoiler rule: a suggested story trophy stays masked (name and description) while
// spoilers are off and it is not earned yet — the planner never leaks the story.
import { displayDescription, displayName, isHiddenBySpoiler } from '../filters.js';
export function nextUpSuggestions(trophies, state) {
  const remaining = trophies.filter((t) => !state.earned[t.id] && t.id !== 1);
  const scored = remaining.map((t) => {
    let score = 100;
    let reason = 'Still to earn.';
    if (t.missable) {
      score = 0;
      reason = 'Possibly missable — do this before the story moves past it.';
    } else if (t.target) {
      const have = state.counters[t.id] ?? 0;
      const frac = Math.min(1, have / t.target);
      score = 10 + (1 - frac) * 80;
      reason = have > 0
        ? `Already ${have} of ${t.target.toLocaleString('en-US')} — closest to done of the counted trophies.`
        : `A counted trophy (${t.target.toLocaleString('en-US')} ${t.target_unit || ''}) you can work on any time.`;
    } else if (t.kind === 'story') {
      score = 90;
      reason = 'Next story step in the roadmap order.';
    }
    return { trophy: t, score, reason };
  });
  scored.sort((a, b) => a.score - b.score || a.trophy.id - b.trophy.id);
  return scored.slice(0, 5);
}

export function renderPlanner(view, trophies, state, ctx) {
  view.replaceChildren();
  const intro = document.createElement('p');
  intro.className = 'page-intro';
  intro.textContent = 'Next up, chosen from what you have not earned yet: the possibly-missable trophy first, then the counted trophy nearest its target, then the next story step. Tick trophies off in the checklist and this list re-sorts itself.';
  view.append(intro);
  const suggestions = nextUpSuggestions(trophies, state);
  if (!suggestions.length) {
    const done = document.createElement('p');
    done.className = 'empty-note';
    done.textContent = 'Everything is earned — the platinum is yours. Leonida Legend.';
    view.append(done);
    return;
  }
  suggestions.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'nextup';
    const rank = document.createElement('span');
    rank.className = 'rank';
    rank.textContent = `#${i + 1}`;
    const body = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = `${displayName(s.trophy, state)} — ${s.trophy.grade}`;
    const desc = document.createElement('div');
    desc.textContent = displayDescription(s.trophy, state);
    const reason = document.createElement('div');
    reason.textContent = isHiddenBySpoiler(s.trophy, state)
      ? 'Next story step in the roadmap order. (Name hidden while spoilers are off.)'
      : s.reason;
    const go = document.createElement('button');
    go.type = 'button';
    go.textContent = 'Open guide';
    go.addEventListener('click', () => {
      ctx.selectedId = s.trophy.id;
      ctx.route = 'checklist';
      location.hash = '#/checklist';
    });
    body.append(name, document.createElement('br'), desc, document.createElement('br'), reason, document.createElement('br'), go);
    card.append(rank, body);
    view.append(card);
  });
}
