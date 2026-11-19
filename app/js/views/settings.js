// Settings page: spoiler switch, theme switch, export/import/reset, and the honest
// about box — where the facts come from and what is still unverified.
import { exportProgress, importProgress, resetProgress } from '../store.js';

export function renderSettings(view, trophies, state, ctx) {
  view.replaceChildren();
  const intro = document.createElement('p');
  intro.className = 'page-intro';
  intro.textContent = 'Settings and your saved progress. Everything is stored in this browser only (localStorage); export a file to back it up or move it to another browser.';
  view.append(intro);
  const display = document.createElement('section');
  display.className = 'settings-block';
  const dh = document.createElement('h2');
  dh.textContent = 'Display';
  const spoilerLabel = document.createElement('label');
  const spoilerBox = document.createElement('input');
  spoilerBox.type = 'checkbox';
  spoilerBox.checked = state.spoiler;
  spoilerBox.addEventListener('change', () => {
    state.spoiler = spoilerBox.checked;
    ctx.refresh();
  });
  spoilerLabel.append(spoilerBox, ' Spoilers off — hide story trophy names and descriptions until earned');
  const themeLabel = document.createElement('label');
  const themeBox = document.createElement('input');
  themeBox.type = 'checkbox';
  themeBox.checked = state.theme === 'light';
  themeBox.addEventListener('change', () => {
    state.theme = themeBox.checked ? 'light' : 'dark';
    ctx.refresh();
  });
  themeLabel.append(themeBox, ' Light theme (dark is the default)');
  display.append(dh, spoilerLabel, themeLabel);
  view.append(display);
  const data = document.createElement('section');
  data.className = 'settings-block';
  const dataH = document.createElement('h2');
  dataH.textContent = 'Your progress';
  const summary = document.createElement('p');
  const earnedCount = Object.keys(state.earned).length;
  summary.textContent = `${earnedCount} of ${trophies.length} trophies earned · ${Object.keys(state.counters).length} counters tracked · ${Object.keys(state.notes).length} notes written.`;
  const exportBtn = document.createElement('button');
  exportBtn.type = 'button';
  exportBtn.className = 'primary';
  exportBtn.textContent = 'Export progress (JSON)';
  exportBtn.addEventListener('click', () => exportProgress(state));
  const importLabel = document.createElement('label');
  importLabel.textContent = 'Import progress: ';
  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.accept = 'application/json';
  const importMsg = document.createElement('p');
  importInput.addEventListener('change', async () => {
    const file = importInput.files[0];
    if (!file) return;
    try {
      const error = importProgress(state, JSON.parse(await file.text()));
      importMsg.textContent = error ?? 'Progress imported.';
    } catch {
      importMsg.textContent = 'That file is not valid JSON progress.';
    }
    ctx.refresh();
  });
  importLabel.append(importInput);
  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.textContent = 'Reset all progress';
  resetBtn.addEventListener('click', () => {
    if (confirm('Clear all earned trophies, counters and notes?')) {
      resetProgress(state);
      ctx.refresh();
    }
  });
  data.append(dataH, summary, exportBtn, document.createElement('br'), document.createElement('br'), importLabel, importMsg, resetBtn);
  view.append(data);
  const about = document.createElement('section');
  about.className = 'settings-block';
  const aboutH = document.createElement('h2');
  aboutH.textContent = 'About this guide';
  const aboutBody = document.createElement('p');
  aboutBody.textContent = 'Sunset Platinum covers all 55 PlayStation 5 trophies for Grand Theft Auto VI: 1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden on PlayStation. Names, descriptions and grades are the official list as Exophase and PSNProfiles published it, checked on 19 November 2026; PSN counter targets (250 stunts, 42 shooting-range golds, 100 WAiNK locations and the rest) come from PSNProfiles. Step-by-step detail is drawn from the early guides summarised by EGamers.io (GTABase and PowerPyx) and is cited per trophy. Pre-release planning guide: instructions are derived from published trophy descriptions and cited sources. Gameplay, replay access, missability and completion time have not been verified in-game. Where a trigger is unconfirmed, the guide says so instead of inventing one. Discrepancies we found and did not silently resolve: meditation spots are counted 18 by one source and 15 by the 100% checklist; the animal for Fair Game and the triggers for In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There and Ten Pin are still unconfirmed. No Rockstar logo, artwork or game screenshot is used. No online trophies exist: all 55 are single-player and offline. Cheats disable trophies and saving, so leave them off for a trophy run.';
  about.append(aboutH, aboutBody);
  view.append(about);
}
