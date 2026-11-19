// Platinum roadmap: the order to earn the 55 trophies in, built from the official
// descriptions — which story chapters and missions, which collectibles and counts,
// in what order. Honest about its limits: the game had just released, so the order
// follows the descriptions and the cited early guides, not a verified playthrough.
// Spoiler rule: story trophies stay masked in the stage lists while spoilers are off.
import { displayDescription, displayName } from '../filters.js';

const STAGES = [
  {
    title: 'Stage 1 — Story first: Chapters 1–4 and the final mission',
    body: 'Play the story in order. Chapters 1–4 each carry a trophy (Paradise Lost, T**s Ass Drug Money, Vice City, Baby!, Top Of The World, Ma), the opening mission Gone Fishing carries Just Like Paradise, and the final mission carries the gold You Gotta Know When to Get Off. Along the way, the named story missions each carry a trophy: Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory.',
    bodySafe: 'Play the story in order. Chapters 1–4 each carry a chapter trophy, the opening mission carries its own trophy, and the final mission carries a gold trophy. Along the way, six named story missions each carry a trophy. (Mission and chapter names hidden while spoilers are off.)',
    pick: (t) => [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].includes(t.id),
  },
  {
    title: 'Stage 2 — Do the possibly-missable thing first: meditate in Chapter 1',
    body: 'Positive Mental Attitude is the only trophy early guides flag as possibly missable: the first meditation, Lucia\u2019s on the balcony at Jason\u2019s house in Chapter 1, is reported to disappear once Chapter 1 ends. Do it in Chapter 1, before the chapter closes. The other 17 meditation spots can wait — but this one cannot, if the report is right.',
    bodySafe: 'One meditation trophy is the only trophy early guides flag as possibly missable: its first meditation spot, in Chapter 1, is reported to disappear once Chapter 1 ends. Do that meditation in Chapter 1, before the chapter closes. The other meditation spots can wait — but this one cannot, if the report is right. (Details on the Missables page.)',
    pick: (t) => t.id === 28,
  },
  {
    title: 'Stage 3 — Side characters and strangers, as they unlock',
    body: 'Five side characters each end in a final-mission trophy: Andy, Kenton, Billy, Randy and Tyrone. Strangers & Freaks wants 8 stranger strands finished, and Bret\u2019s hunting strand ends in Fair Game. Start each strand as soon as it appears — one source warns stranger chains may have windows tied to story progress, though that is unconfirmed — and finish each chain before moving on.',
    bodySafe: 'Five side characters each end in a final-mission trophy, and 8 stranger strands end in their own silver trophy, including a hunting strand. Start each strand as soon as it appears — one source warns stranger chains may have windows tied to story progress, though that is unconfirmed — and finish each chain before moving on. (Character names hidden while spoilers are off.)',
    pick: (t) => [22, 23, 24, 25, 26, 27, 29].includes(t.id),
  },
  {
    title: 'Stage 4 — Partner trophies and one-off stunts',
    body: 'While both protagonists are playable together: lose a 4-star wanted level with your partner (Hot Together) and rob 3 shops back-to-back without losing the wanted level (Retail Therapy). Then the one-off stunts: an unscheduled departure at VCIA (Catch Me If You Can), a Rhino tank (Challenging Tank), a jewelry store robbery without being detected (Sneakthief), 5 enemies in one Combat Focus (Gunslinger), an armored truck robbery (A Classic Blitz Play), a cocktail on Ocean Beach (In The Beginning…), smashing out of a vehicle showroom (Capital Offense), bowling at Kolt & Associates (Let\u2019s Go Bowling), and a melee drive-by (Ten Pin).',
    bodySafe: 'While both protagonists are playable together: lose a 4-star wanted level with your partner, and rob 3 shops back-to-back without losing the wanted level. Then the one-off stunts: an unscheduled departure at the airport, a Rhino tank, a jewelry store robbery without being detected, 5 enemies in one Combat Focus, an armored truck robbery, a cocktail on Ocean Beach, smashing out of a vehicle showroom, bowling, and a melee drive-by. (Trophy names hidden while spoilers are off.)',
    pick: (t) => [33, 34, 36, 37, 38, 39, 41, 44, 45, 46, 51].includes(t.id),
  },
  {
    title: 'Stage 5 — The long grind: collectibles, activities, money',
    body: 'After the story, free roam stays open for everything counted: 250 stunts, 42 shooting-range golds, 14 drone-race locations, 20 different race wins, 8 stranger strands, 18 meditation spots, 3 card sets, 100 WAiNK locations, 50 challenges, 100 vehicles discovered, 5 bank vaults, all 52 areas of Leonida, one illegal operation per each of 9 gangs, $250,000 laundered, $100,000 spent, 8 garages, 10 vehicles registered, and 500 profile actions. Then the last gold: A Long Road, 100% completion — and with it, the platinum Vice Got a Price!',
    bodySafe: 'After the story, free roam stays open for everything counted: 250 stunts, 42 shooting-range golds, 14 drone-race locations, 20 different race wins, 8 stranger strands, 18 meditation spots, 3 card sets, 100 WAiNK locations, 50 challenges, 100 vehicles discovered, 5 bank vaults, all 52 areas of Leonida, one illegal operation per each of 9 gangs, $250,000 laundered, $100,000 spent, 8 garages, 10 vehicles registered, and 500 profile actions. Then the last gold, 100% completion — and with it, the platinum.',
    pick: (t) => [1, 14, 15, 16, 17, 18, 19, 20, 21, 30, 31, 32, 35, 40, 42, 43, 47, 48, 49, 50, 52, 53, 54, 55].includes(t.id),
  },
];

export function renderRoadmap(view, trophies, state) {
  view.replaceChildren();
  const intro = document.createElement('p');
  intro.className = 'page-intro';
  intro.innerHTML = '';
  intro.textContent = 'Roadmap to the platinum, built from the official trophy descriptions — which story chapters and missions come first, which collectibles and counts follow, and in what order. Early guides put the platinum at roughly 200 hours: 60–80 hours of story, about 100 hours of checklist, and cleanup after. The order below is derived from the descriptions and the cited guides; it has not been verified inside the game yet.' + (state.spoiler ? ' Spoilers are off, so story trophies below are masked until you earn them.' : '');
  view.append(intro);
  for (const stage of STAGES) {
    const box = document.createElement('section');
    box.className = 'stage';
    const items = trophies.filter(stage.pick);
    const done = items.filter((t) => state.earned[t.id]).length;
    const h = document.createElement('h2');
    h.textContent = stage.title;
    const prog = document.createElement('p');
    prog.className = 'stage-progress';
    prog.textContent = `${done} of ${items.length} earned in this stage`;
    const body = document.createElement('p');
    body.textContent = state.spoiler && stage.bodySafe ? stage.bodySafe : stage.body;
    const ul = document.createElement('ul');
    for (const t of items) {
      const li = document.createElement('li');
      li.textContent = `${state.earned[t.id] ? '✓ ' : ''}${displayName(t, state)} — ${t.grade} — ${displayDescription(t, state)}`;
      ul.append(li);
    }
    box.append(h, prog, body, ul);
    view.append(box);
  }
}
