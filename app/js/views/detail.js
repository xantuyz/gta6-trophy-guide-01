// Detail pane: the full guide for one trophy — official name, description and grade,
// our own-words guide, the missable note, a PSN counter when the trophy has one,
// a personal note, and the Sources list. Links open only when the reader follows them;
// the app never fetches a source.
import { isHiddenBySpoiler } from '../filters.js';
import { saveState, setCounter, setNote, toggleEarned } from '../store.js';

function sourceLink(source) {
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = source.url;
  a.textContent = source.name;
  a.target = '_blank';
  a.rel = 'noopener';
  li.append(a);
  // What each source backs: Exophase the official name/description/grade,
  // PSNProfiles the PSN count where the trophy has one, EGamers the early-guide
  // detail summarised from GTABase and PowerPyx. All three were opened 19 Nov 2026.
  const supports = source.name.startsWith('PSNProfiles')
    ? ' — PSN count where the trophy has one'
    : source.name.startsWith('EGamers')
      ? ' — early-guide detail (GTABase, PowerPyx)'
      : ' — official name, description, grade';
  li.append(document.createTextNode(supports));
  return li;
}

// Honest missability label, in the guide's own words. Only one trophy is flagged
// as potentially missable by the cited guides; everything else is either a plain
// "no signal" or an unconfirmed trigger, and the label says which.
export function missabilityLabel(trophy) {
  if (trophy.missable) return 'Potential missable — inferred from the official description. Replay availability and recovery conditions have not been verified in-game.';
  if (trophy.id === 7) return 'Ending-related requirement. Whether this conflicts with another trophy or requires an additional playthrough is unverified.';
  if (trophy.guide.includes('still unconfirmed')) return 'Trigger unconfirmed — no specific missability signal in the description. Post-story availability remains unverified.';
  return 'No specific missability signal in the description. Post-story availability remains unverified.';
}

export function renderDetailPane(container, trophy, state, onChange) {
  container.replaceChildren();
  const pane = document.createElement('aside');
  pane.className = 'detail-pane';
  if (!trophy) {
    pane.innerHTML = '<h2>Pick a trophy</h2><p class="official-desc">Click any trophy in the list to see its guide, its sources, and your counter and notes for it.</p>';
    container.append(pane);
    return;
  }
  const hidden = isHiddenBySpoiler(trophy, state);
  const h2 = document.createElement('h2');
  h2.textContent = hidden ? 'Hidden story trophy' : trophy.name;
  pane.append(h2);
  const badges = document.createElement('div');
  badges.className = 'trophy-meta';
  for (const [text, cls] of [
    [trophy.grade, trophy.grade],
    [trophy.kind, 'kind'],
    ...(trophy.hidden ? [['hidden on PSN', 'hidden-flag']] : []),
    ...(trophy.missable ? [['MISSABLE', 'missable']] : []),
  ]) {
    const b = document.createElement('span');
    b.className = `badge ${cls}`;
    b.textContent = text;
    badges.append(b);
  }
  pane.append(badges);
  const desc = document.createElement('p');
  desc.className = 'official-desc';
  desc.textContent = hidden
    ? 'Spoilers are off: this story trophy stays hidden until you earn it. Tick it earned to reveal its name and description.'
    : `Official description: “${trophy.description}”`;
  pane.append(desc);
  if (!hidden) {
    const guideHead = document.createElement('h3');
    guideHead.textContent = 'Guide — our own words';
    pane.append(guideHead);
    const guide = document.createElement('p');
    guide.className = 'guide-text';
    guide.textContent = trophy.guide;
    pane.append(guide);
    if (trophy.missable) {
      const note = document.createElement('p');
      note.className = 'missable-note';
      note.textContent = trophy.missable_reason;
      pane.append(note);
    }
    const srcHead = document.createElement('h3');
    srcHead.textContent = 'Sources';
    pane.append(srcHead);
    const list = document.createElement('ul');
    list.className = 'sources-list';
    for (const s of trophy.sources) list.append(sourceLink(s));
    pane.append(list);
    const honest = document.createElement('p');
    honest.className = 'official-desc';
    honest.textContent = 'Derived from the official description, not yet verified in-game.';
    pane.append(honest);
    const label = document.createElement('p');
    label.className = 'official-desc';
    label.textContent = missabilityLabel(trophy);
    pane.append(label);
    if (trophy.hidden) {
      const hid = document.createElement('p');
      hid.className = 'official-desc';
      hid.textContent = 'Hidden on PlayStation until earned (28 of 55 are hidden; the flags follow the hidden table checked 19 Nov 2026).';
      pane.append(hid);
    }
  }
  if (trophy.target) {
    const head = document.createElement('h3');
    head.textContent = `Your progress — PSN tracks 0/${trophy.target.toLocaleString('en-US')} ${trophy.target_unit || ''}`;
    pane.append(head);
    const row = document.createElement('div');
    row.className = 'counter-row';
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.max = String(trophy.target);
    input.value = String(state.counters[trophy.id] ?? 0);
    input.setAttribute('aria-label', `Your count for ${trophy.name}`);
    input.addEventListener('change', () => {
      setCounter(state, trophy.id, input.value);
      onChange();
    });
    const of = document.createElement('span');
    of.textContent = `of ${trophy.target.toLocaleString('en-US')} ${trophy.target_unit || ''}`;
    row.append(input, of);
    pane.append(row);
  }
  const noteHead = document.createElement('h3');
  noteHead.textContent = 'Your note';
  pane.append(noteHead);
  const note = document.createElement('textarea');
  note.placeholder = 'Your own note for this trophy — saved in this browser only.';
  note.value = state.notes[trophy.id] ?? '';
  note.addEventListener('change', () => {
    setNote(state, trophy.id, note.value);
    onChange();
  });
  pane.append(note);
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'primary earned-toggle';
  toggle.textContent = state.earned[trophy.id] ? '✓ Earned — click to unmark' : 'Mark as earned';
  toggle.addEventListener('click', () => {
    toggleEarned(state, trophy.id);
    saveState(state);
    onChange();
  });
  pane.append(toggle);
  container.append(pane);
}
