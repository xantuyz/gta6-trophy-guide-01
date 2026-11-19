// Missables page: the one trophy early guides flag as possibly missable, plus the
// watchlist — trophies that are not flagged missable but deserve doing early anyway,
// each with the reason taken from the official description or the cited source.
export function renderMissables(view, trophies, state) {
  view.replaceChildren();
  const intro = document.createElement('p');
  intro.className = 'page-intro';
  intro.textContent = 'Missables, built from the official descriptions and the early guides that cite them. The honest headline: only one trophy is flagged as possibly missable. Everything else on this page is a watchlist — things to do early so you never have to find out the hard way.';
  view.append(intro);
  const missable = trophies.filter((t) => t.missable);
  for (const t of missable) {
    const card = document.createElement('section');
    card.className = 'missable-card';
    const h = document.createElement('h2');
    h.textContent = `⚠ ${t.name} — possibly missable`;
    const desc = document.createElement('p');
    desc.textContent = `Official description: “${t.description}” (${t.grade}).`;
    const why = document.createElement('p');
    why.textContent = t.missable_reason;
    const guide = document.createElement('p');
    guide.textContent = t.guide;
    const src = document.createElement('p');
    src.textContent = 'Sources: ' + t.sources.map((s) => s.name).join(' · ') + '.';
    card.append(h, desc, why, guide, src);
    view.append(card);
  }
  const watchHead = document.createElement('h2');
  watchHead.textContent = 'Watchlist — do these early, just in case';
  view.append(watchHead);
  const watch = [
    {
      title: 'Stranger strands (Strangers & Freaks, 8 strands)',
      body: 'One source reports that stranger mission chains have windows linked to story progress. Only one source gives that warning, so begin each strand as soon as it unlocks and finish it before the story moves far past it.',
    },
    {
      title: 'Side characters and strangers',
      body: state.spoiler
        ? 'Five side characters each end in a final-mission trophy, and the stranger strands end in their own trophies. Start each strand as soon as it appears rather than leaving it for after the story. (Character names hidden while spoilers are off.)'
        : 'Five side characters (Andy, Kenton, Billy, Randy, Tyrone) each end in a final-mission trophy, and Bret\u2019s hunting strand ends in Fair Game. Start each strand as soon as it appears rather than leaving it for after the story.',
    },
    {
      title: 'Maximum Withdrawal — the Chapter 4 bank mission',
      body: state.spoiler
        ? 'Early guides report this chain needs an optional Chapter 4 mission. Optional missions can be easy to walk past, so take it when it appears in Chapter 4 rather than assuming it waits. (Mission name hidden while spoilers are off.)'
        : 'Early guides report this chain needs the optional Chapter 4 mission “That\u2019s Where The Money Is…”. Optional missions can be easy to walk past, so take it when it appears in Chapter 4 rather than assuming it waits.',
    },
    {
      title: 'Story missions are one-time by nature',
      body: state.spoiler
        ? 'The story-mission trophies each come from a single mission. Missions can be replayed in this series, so they are not flagged missable — but there is no reason to skip one when it appears. (Mission names hidden while spoilers are off.)'
        : 'The twelve story-mission trophies (Gone Fishing through Operation Savage Glory) each come from a single mission. Missions can be replayed in this series, so they are not flagged missable — but there is no reason to skip one when it appears.',
    },
    {
      title: state.spoiler ? 'Choice-tied trophies' : 'Choice-tied trophies (Actions Speak Louder)',
      body: 'PSN tracks 500 profile actions for one story-moment trophy, and one source links it to choices that change your Criminal Profile. Play the story making choices as they come; do not leave every choice for a second playthrough that may never happen.',
    },
  ];
  for (const w of watch) {
    const card = document.createElement('section');
    card.className = 'watch-card';
    const h = document.createElement('h3');
    h.textContent = w.title;
    const body = document.createElement('p');
    body.textContent = w.body;
    card.append(h, body);
    view.append(card);
  }
  const safe = document.createElement('p');
  safe.className = 'page-intro';
  safe.textContent = `Everything else — ${trophies.length - missable.length - 0} trophies — stays available in free roam after the story, by the official descriptions: counters, collectibles, activities and shops can all be finished after the credits.`;
  view.append(safe);
}
