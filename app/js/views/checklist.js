// Checklist view: filters, search, the 55-trophy list and the guide pane beside it.
// The selected trophy stays selected across re-renders so the cover shot can show
// the list and an open guide at the same time.
import { KIND_FILTERS, applyFilters, displayDescription, displayName, isHiddenBySpoiler } from '../filters.js';
import { saveState, toggleEarned } from '../store.js';
import { renderDetailPane } from './detail.js';

export function renderChecklist(view, trophies, state, ctx) {
  view.replaceChildren();
  const layout = document.createElement('div');
  layout.className = 'checklist-layout';
  const left = document.createElement('div');
  const filters = document.createElement('div');
  filters.className = 'filters';
  const search = document.createElement('input');
  search.type = 'text';
  search.id = 'searchInput';
  search.placeholder = 'Search trophies…  ( / )';
  search.value = ctx.filters.search;
  search.setAttribute('aria-label', 'Search trophies');
  search.addEventListener('input', () => {
    ctx.filters.search = search.value;
    renderChecklist(view, trophies, state, ctx);
    const again = view.querySelector('#searchInput');
    again.focus();
    again.setSelectionRange(again.value.length, again.value.length);
  });
  filters.append(search);
  for (const kind of KIND_FILTERS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `kind-btn${ctx.filters.kind === kind.id ? ' active' : ''}`;
    b.textContent = kind.label;
    b.addEventListener('click', () => {
      ctx.filters.kind = kind.id;
      renderChecklist(view, trophies, state, ctx);
    });
    filters.append(b);
  }
  const grade = document.createElement('select');
  grade.setAttribute('aria-label', 'Filter by grade');
  for (const [value, label] of [['all', 'All grades'], ['platinum', 'Platinum'], ['gold', 'Gold'], ['silver', 'Silver'], ['bronze', 'Bronze']]) {
    const o = document.createElement('option');
    o.value = value;
    o.textContent = label;
    if (ctx.filters.grade === value) o.selected = true;
    grade.append(o);
  }
  grade.addEventListener('change', () => {
    ctx.filters.grade = grade.value;
    renderChecklist(view, trophies, state, ctx);
  });
  const status = document.createElement('select');
  status.setAttribute('aria-label', 'Filter by status');
  for (const [value, label] of [['all', 'Earned + remaining'], ['remaining', 'Remaining only'], ['earned', 'Earned only']]) {
    const o = document.createElement('option');
    o.value = value;
    o.textContent = label;
    if (ctx.filters.status === value) o.selected = true;
    status.append(o);
  }
  status.addEventListener('change', () => {
    ctx.filters.status = status.value;
    renderChecklist(view, trophies, state, ctx);
  });
  filters.append(grade, status);
  left.append(filters);
  const shown = applyFilters(trophies, state, ctx.filters);
  const count = document.createElement('p');
  count.className = 'page-intro';
  count.textContent = `Showing ${shown.length} of 55 trophies. Click a trophy to read its guide and sources.`;
  left.append(count);
  const list = document.createElement('ul');
  list.className = 'trophy-list';
  for (const t of shown) {
    const li = document.createElement('li');
    const row = document.createElement('button');
    row.type = 'button';
    row.className = `trophy-row${state.earned[t.id] ? ' earned' : ''}${ctx.selectedId === t.id ? ' selected' : ''}`;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = !!state.earned[t.id];
    box.setAttribute('aria-label', `Mark ${t.name} earned`);
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleEarned(state, t.id);
      ctx.refresh();
    });
    const main = document.createElement('span');
    const hidden = isHiddenBySpoiler(t, state);
    const name = document.createElement('span');
    name.className = 'trophy-name';
    name.textContent = displayName(t, state);
    if (state.earned[t.id]) {
      const mark = document.createElement('span');
      mark.className = 'earned-mark';
      mark.textContent = ' ✓';
      name.append(mark);
    }
    const desc = document.createElement('span');
    desc.className = 'trophy-desc';
    desc.textContent = displayDescription(t, state);
    const meta = document.createElement('span');
    meta.className = 'trophy-meta';
    for (const [text, cls] of [
      [t.grade, t.grade],
      [t.kind, 'kind'],
      ...(t.missable ? [['MISSABLE', 'missable']] : []),
    ]) {
      const b = document.createElement('span');
      b.className = `badge ${cls}`;
      b.textContent = text;
      meta.append(b);
    }
    if (t.target) {
      const c = document.createElement('span');
      c.className = 'counter-chip';
      c.textContent = `${state.counters[t.id] ?? 0} / ${t.target.toLocaleString('en-US')} ${t.target_unit || ''}`;
      meta.append(c);
    }
    main.append(name, document.createElement('br'), desc, document.createElement('br'), meta);
    const gradeBadge = document.createElement('span');
    gradeBadge.className = `badge ${t.grade}`;
    gradeBadge.textContent = t.grade;
    row.append(box, main, gradeBadge);
    row.addEventListener('click', () => {
      ctx.selectedId = t.id;
      renderChecklist(view, trophies, state, ctx);
    });
    li.append(row);
    list.append(li);
  }
  if (!shown.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-note';
    empty.textContent = 'No trophies match these filters. Clear the search or pick another kind.';
    left.append(empty);
  }
  left.append(list);
  const right = document.createElement('div');
  const selected = trophies.find((t) => t.id === ctx.selectedId) ?? shown[0];
  renderDetailPane(right, selected, state, () => ctx.refresh());
  layout.append(left, right);
  view.append(layout);
}
