/* ============================================
   TABLETOP QUEST ACADEMY - APP
   ES Module with Firebase Firestore sync
   ============================================ */

// ---- Firebase imports (CDN) ----
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ---- Firebase config ----
// REPLACE THIS with your Firebase project config (see SETUP.md)
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyADM0028-N1OBDjvCmbl9i99gaXIfJXG-I",
  authDomain: "tabletop-quest.firebaseapp.com",
  projectId: "tabletop-quest",
  storageBucket: "tabletop-quest.firebasestorage.app",
  messagingSenderId: "990562651380",
  appId: "1:990562651380:web:e39b41c8aca866ffeb62a1"
};

// ---- Firebase init ----
let db = null;
let unsubscribe = null;
let syncCode = localStorage.getItem('tqa-sync-code') || '';
let firebaseReady = false;

function initFirebase() {
  if (!FIREBASE_CONFIG.apiKey) return false;
  try {
    const app = initializeApp(FIREBASE_CONFIG);
    db = getFirestore(app);
    firebaseReady = true;
    return true;
  } catch (e) {
    console.warn('Firebase init failed:', e);
    return false;
  }
}

// ---- Data constants ----
const MODULES = [
  { id: '01', dir: '01-unreal-basics', name: 'Unreal Basics', desc: 'Editor layout, viewport navigation, actors, landscapes, packaging builds.', color: 'var(--c1)', phase: 'Phase 1' },
  { id: '02', dir: '02-blueprints', name: 'Blueprints', desc: 'Visual scripting, events, variables, functions, interactive objects.', color: 'var(--c2)', phase: 'Phase 1' },
  { id: '03', dir: '03-cpp-in-unreal', name: 'C++ in Unreal', desc: 'UPROPERTY, UFUNCTION, components, delegates, memory management.', color: 'var(--c3)', phase: 'Phase 1' },
  { id: '04', dir: '04-gameplay-ability-system', name: 'Gameplay Ability System', desc: 'The combat framework: abilities, effects, tags, attributes.', color: 'var(--c4)', phase: 'Phase 1' },
  { id: '05', dir: '05-materials-and-rendering', name: 'Materials & Rendering', desc: 'PBR, material instances, render-to-texture, Nanite, Lumen.', color: 'var(--c5)', phase: 'Phase 2' },
  { id: '06', dir: '06-cameras-and-input', name: 'Cameras & Input', desc: 'Spring arms, camera modes, Enhanced Input, camera director.', color: 'var(--c6)', phase: 'Phase 2' },
  { id: '07', dir: '07-ai-behavior-trees', name: 'AI & Behavior Trees', desc: 'AI controllers, blackboards, tasks, EQS, party AI.', color: 'var(--c7)', phase: 'Phase 4' },
  { id: '08', dir: '08-ui-with-umg', name: 'UI with UMG', desc: 'Widget Blueprints, HUDs, menus, data binding, animations.', color: 'var(--c8)', phase: 'Phase 3' },
  { id: '09', dir: '09-level-streaming-world-partition', name: 'World Partition', desc: 'Level streaming, sub-levels, LODs, fog of war.', color: 'var(--c9)', phase: 'Phase 2' },
  { id: '10', dir: '10-audio-systems', name: 'Audio Systems', desc: 'Sound Cues, attenuation, MetaSounds, crossfades, dynamic music.', color: 'var(--c10)', phase: 'Phase 6' },
];

const TABS = ['lesson', 'exercises', 'quiz', 'resources'];
const CHEATSHEETS = [
  { file: 'blueprint-nodes.md', name: 'Blueprint Nodes', icon: '&#9881;', desc: 'Common nodes by category with use cases.', color: 'var(--c2)' },
  { file: 'cpp-patterns.md', name: 'C++ Patterns', icon: '&#128736;', desc: 'UPROPERTY, UFUNCTION, macros, naming, memory.', color: 'var(--c3)' },
  { file: 'gas-reference.md', name: 'GAS Reference', icon: '&#9889;', desc: 'Abilities, effects, tags, cues, damage pipeline.', color: 'var(--c4)' },
  { file: 'material-nodes.md', name: 'Material Nodes', icon: '&#127912;', desc: 'Math, texture, parameter, PBR output nodes.', color: 'var(--c5)' },
  { file: 'essential-code.md', name: 'Essential Code', icon: '&#128293;', desc: 'The functions you will use every day. Blueprint, C++, and GAS.', color: 'var(--c1)' },
  { file: 'debugging.md', name: 'Debugging', icon: '&#128027;', desc: 'Output Log, breakpoints, visual debug, GAS/AI debug, crash recovery.', color: 'var(--c4)' },
];
const BIBLE = [
  { file: 'game-design-doc.md', name: 'Game Design Document', icon: '&#128220;', desc: 'Full GDD: concept, systems, phases, timeline.', color: 'var(--c1)' },
  { file: 'class-abilities.md', name: 'Classes & Abilities', icon: '&#9876;', desc: 'All 6 classes, abilities, subclasses.', color: 'var(--c4)' },
  { file: 'enemy-bestiary.md', name: 'Enemy Bestiary', icon: '&#128126;', desc: '25 enemies across 3 tiers, plus bosses.', color: 'var(--c7)' },
  { file: 'loot-tables.md', name: 'Loot Tables', icon: '&#128176;', desc: 'Weapons, armor, accessories, drop rates.', color: 'var(--c8)' },
];

const PHASES = [
  { name: 'Phase 0: Learning', desc: 'UE5 fundamentals, Blueprints, C++, GAS.', time: '2-3 months', active: true, difficulty: 'easy' },
  { name: 'Phase 1: Core Combat', desc: 'Dungeon room, Warrior class, turn-based combat, dice rolls.', time: '4-6 months', difficulty: 'medium' },
  { name: 'Phase 2: The Tabletop', desc: 'Tabletop environment, zoom transition, connected rooms.', time: '3-4 months', difficulty: 'hard' },
  { name: 'Phase 3: RPG Systems', desc: 'All stats/classes/races, leveling, inventory, quests.', time: '3-4 months', difficulty: 'medium' },
  { name: 'Phase 4: Real-Time Combat', desc: 'Action combat, party AI, mode switching, boss fights.', time: '4-5 months', difficulty: 'hard' },
  { name: 'Phase 5: AI Dungeon Master', desc: 'Ollama integration, narrative, encounters, quest gen.', time: '2-3 months', difficulty: 'medium' },
  { name: 'Phase 6: Polish & Content', desc: 'Campaign chapter, final art, audio, tutorial, local co-op.', time: '3-4 months', difficulty: 'medium' },
];

// ---- State ----
let currentPage = 'home';
let currentModule = null;
let currentTab = 'lesson';
let mdCache = {};

// ---- Progress (localStorage + Firestore) ----
function getProgress() {
  try { return JSON.parse(localStorage.getItem('tqa-progress') || '{}'); }
  catch { return {}; }
}

function setProgressLocal(data) {
  localStorage.setItem('tqa-progress', JSON.stringify(data));
}

async function setProgress(data) {
  setProgressLocal(data);
  // Sync to Firestore if connected
  if (firebaseReady && syncCode) {
    setSyncStatus('syncing');
    try {
      await setDoc(doc(db, 'progress', syncCode), {
        data: data,
        updatedAt: new Date().toISOString(),
        device: navigator.userAgent.substring(0, 80)
      });
      setSyncStatus('connected');
    } catch (e) {
      console.warn('Firestore write failed:', e);
      setSyncStatus('error');
    }
  }
}

async function toggleItem(key) {
  const p = getProgress();
  p[key] = !p[key];
  if (!p[key]) delete p[key]; // clean up false values
  await setProgress(p);
  updateAllProgress();
}

function isComplete(key) { return !!getProgress()[key]; }

function countModuleProgress(modId) {
  const p = getProgress();
  let done = 0, total = 0;
  for (const tab of TABS) {
    total++;
    if (p[`mod-${modId}-${tab}`]) done++;
  }
  return { done, total };
}

function countTotalProgress() {
  const p = getProgress();
  let done = 0, total = MODULES.length * TABS.length;
  for (const m of MODULES) {
    for (const tab of TABS) {
      if (p[`mod-${m.id}-${tab}`]) done++;
    }
  }
  return { done, total };
}

function updateAllProgress() {
  const { done, total } = countTotalProgress();
  const pct = total ? Math.round((done / total) * 100) : 0;
  const barInner = document.getElementById('progress-bar-inner');
  const pctEl = document.getElementById('progress-pct');
  const detailEl = document.getElementById('progress-detail');
  const mobileRing = document.getElementById('mobile-ring');
  const mobilePct = document.getElementById('mobile-pct');
  if (barInner) barInner.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
  if (detailEl) detailEl.textContent = `${done} / ${total} items complete`;
  if (mobileRing) mobileRing.setAttribute('stroke-dasharray', `${pct}, 100`);
  if (mobilePct) mobilePct.textContent = pct + '%';

  for (const m of MODULES) {
    const { done: mDone, total: mTotal } = countModuleProgress(m.id);
    const check = document.getElementById(`check-mod-${m.id}`);
    if (check) {
      if (mDone === mTotal) { check.classList.add('done'); }
      else { check.classList.remove('done'); }
    }
  }
}

// ---- Sync UI ----
function setSyncStatus(state) {
  const el = document.getElementById('sync-status');
  const btn = document.getElementById('sync-btn');
  if (!el) return;

  el.classList.remove('connected', 'syncing');

  if (state === 'connected') {
    el.classList.add('connected');
    el.textContent = `Synced: ${syncCode}`;
    btn.textContent = 'Change Code';
  } else if (state === 'syncing') {
    el.classList.add('syncing');
    el.textContent = 'Syncing...';
  } else if (state === 'error') {
    el.textContent = 'Sync error';
    btn.textContent = 'Retry';
  } else if (state === 'no-firebase') {
    el.textContent = 'Setup needed';
    btn.textContent = 'See SETUP.md';
  } else {
    el.textContent = 'Offline (local only)';
    btn.textContent = 'Set Sync Code';
  }
}

function startRealtimeSync() {
  if (unsubscribe) unsubscribe();
  if (!firebaseReady || !syncCode) return;

  unsubscribe = onSnapshot(doc(db, 'progress', syncCode), (snapshot) => {
    if (snapshot.exists()) {
      const remote = snapshot.data().data || {};
      const local = getProgress();
      // Merge: take the union of completed items (if either device marked it done, it's done)
      const merged = { ...remote };
      for (const key of Object.keys(local)) {
        if (local[key]) merged[key] = true;
      }
      setProgressLocal(merged);
      updateAllProgress();
      // Re-render current view if it shows progress
      if (currentPage === 'home') renderDashboard();
      else if (currentPage === 'module') renderModule();
    }
    setSyncStatus('connected');
  }, (err) => {
    console.warn('Realtime sync error:', err);
    setSyncStatus('error');
  });
}

// Exposed to window for onclick handlers
window.showSyncModal = function() {
  if (!firebaseReady) {
    alert('Firebase is not configured yet. See SETUP.md in the repo for the 5-step setup guide.');
    return;
  }
  const modal = document.getElementById('sync-modal');
  const input = document.getElementById('sync-input');
  modal.classList.add('open');
  input.value = syncCode;
  input.focus();
  document.getElementById('sync-error').textContent = '';
};

window.closeSyncModal = function() {
  document.getElementById('sync-modal').classList.remove('open');
};

window.connectSync = async function() {
  const input = document.getElementById('sync-input');
  const code = input.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
  const errEl = document.getElementById('sync-error');

  if (!code || code.length < 2) {
    errEl.textContent = 'Enter at least 2 characters (letters, numbers, dashes).';
    return;
  }

  syncCode = code;
  localStorage.setItem('tqa-sync-code', code);
  closeSyncModal();
  setSyncStatus('syncing');

  try {
    // Check if remote data exists
    const snap = await getDoc(doc(db, 'progress', code));
    if (snap.exists()) {
      // Merge remote into local
      const remote = snap.data().data || {};
      const local = getProgress();
      const merged = { ...remote };
      for (const key of Object.keys(local)) {
        if (local[key]) merged[key] = true;
      }
      await setProgress(merged);
    } else {
      // Push local to remote
      await setProgress(getProgress());
    }
    updateAllProgress();
    if (currentPage === 'home') renderDashboard();
    startRealtimeSync();
  } catch (e) {
    console.error('Sync connect failed:', e);
    setSyncStatus('error');
  }
};

// ---- Markdown loading ----
async function loadMd(path) {
  if (mdCache[path]) return mdCache[path];
  try {
    const resp = await fetch(path);
    if (!resp.ok) return `*Could not load ${path}*`;
    const text = await resp.text();
    mdCache[path] = text;
    return text;
  } catch (e) {
    return `*Error loading ${path}: ${e.message}*`;
  }
}

function renderMd(text) {
  return marked.parse(text);
}

// ---- Navigation ----
window.navigate = function(page, extra) {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const btn = document.getElementById('menu-btn');
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
  btn.classList.remove('open');

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  if (page === 'home') {
    currentPage = 'home';
    renderDashboard();
    document.getElementById('page-home').classList.add('active');
  } else if (page.startsWith('mod-')) {
    currentPage = 'module';
    currentModule = page.replace('mod-', '');
    currentTab = extra || 'lesson';
    renderModule();
    document.getElementById('page-module').classList.add('active');
  } else if (page === 'cheatsheets') {
    currentPage = 'cheatsheets';
    renderCheatsheets();
    document.getElementById('page-cheatsheets').classList.add('active');
  } else if (page === 'bible') {
    currentPage = 'bible';
    renderBible();
    document.getElementById('page-bible').classList.add('active');
  } else if (page === 'cheatsheet-detail') {
    currentPage = 'cheatsheets';
    renderCheatsheetDetail(extra);
    document.getElementById('page-cheatsheets').classList.add('active');
  } else if (page === 'bible-detail') {
    currentPage = 'bible';
    renderBibleDetail(extra);
    document.getElementById('page-bible').classList.add('active');
  } else if (page === 'vs2026') {
    currentPage = 'vs2026';
    renderRefPage('vs2026', 'Visual Studio 2026', 'Settings, configuration, and shortcuts for UE5 C++ development.', 'var(--c3)', 'reference/vs2026.md');
    document.getElementById('page-vs2026').classList.add('active');
  } else if (page === 'ue57') {
    currentPage = 'ue57';
    renderRefPage('ue57', 'Unreal Engine 5.7', 'Editor preferences, project settings, viewport controls, and console commands.', 'var(--c2)', 'reference/ue57.md');
    document.getElementById('page-ue57').classList.add('active');
  }

  window.scrollTo(0, 0);
};

window.toggleSidebar = function() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const btn = document.getElementById('menu-btn');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
  btn.classList.toggle('open');
};

window.toggleItem = toggleItem;
window.switchTab = function(tab) {
  currentTab = tab;
  renderModule();
};

// ---- Render: Dashboard ----
function renderDashboard() {
  const el = document.getElementById('page-home');
  let html = `
    <div class="dash-hero">
      <h1>Tabletop Quest Academy</h1>
      <p>Your path from zero to a DnD tabletop RPG in Unreal Engine 5</p>
    </div>
    <div class="dash-grid">
  `;
  for (const m of MODULES) {
    const { done, total } = countModuleProgress(m.id);
    const pct = total ? Math.round((done / total) * 100) : 0;
    html += `
      <div class="mod-card" style="--accent:${m.color}" onclick="navigate('mod-${m.id}')">
        <div class="mod-card-num">Module ${m.id} / ${m.phase}</div>
        <h3>${m.name}</h3>
        <p>${m.desc}</p>
        <div class="mod-card-progress">
          <div class="mod-card-bar"><div class="mod-card-bar-fill" style="width:${pct}%;background:${m.color}"></div></div>
          <span class="mod-card-pct" style="color:${m.color}">${pct}%</span>
        </div>
      </div>
    `;
  }
  html += '</div>';

  html += '<div class="phase-timeline"><h2>Development Roadmap</h2>';
  for (let i = 0; i < PHASES.length; i++) {
    const p = PHASES[i];
    const isLast = i === PHASES.length - 1;
    html += `
      <div class="phase-item">
        <div class="phase-line">
          <div class="phase-dot ${p.active ? 'active' : ''}"></div>
          ${!isLast ? '<div class="phase-stem"></div>' : ''}
        </div>
        <div class="phase-content">
          <h4>${p.name} <span class="difficulty ${p.difficulty}">${p.difficulty}</span></h4>
          <p>${p.desc}</p>
          <span class="phase-badge ${p.active ? 'current' : 'upcoming'}">${p.active ? 'Current' : p.time}</span>
        </div>
      </div>
    `;
  }
  html += '</div>';
  el.innerHTML = html;
}

// ---- Render: Module ----
async function renderModule() {
  const mod = MODULES.find(m => m.id === currentModule);
  if (!mod) return;
  const el = document.getElementById('page-module');

  document.documentElement.style.setProperty('--accent', mod.color);

  const { done, total } = countModuleProgress(mod.id);
  const pct = total ? Math.round((done / total) * 100) : 0;

  let html = `
    <div class="mod-header" style="--accent:${mod.color}">
      <div class="mod-header-label">Module ${mod.id}</div>
      <h1>${mod.name}</h1>
      <p>${mod.desc}</p>
      <div class="mod-header-progress">
        <div class="mod-header-bar"><div class="mod-header-bar-fill" style="background:${mod.color};width:${pct}%"></div></div>
        <span class="mod-header-pct" style="color:${mod.color}">${pct}%</span>
      </div>
    </div>
    <div class="tab-bar">
  `;
  for (const tab of TABS) {
    const label = tab.charAt(0).toUpperCase() + tab.slice(1);
    const key = `mod-${mod.id}-${tab}`;
    const check = isComplete(key) ? ' &#10003;' : '';
    html += `<button class="tab-btn ${tab === currentTab ? 'active' : ''}" style="${tab === currentTab ? 'background:' + mod.color : ''}" onclick="switchTab('${tab}')">${label}${check}</button>`;
  }
  html += '</div>';
  html += '<div class="md-content" id="md-area"><div class="loading-spinner"></div></div>';

  const key = `mod-${mod.id}-${currentTab}`;
  const isDone = isComplete(key);
  html += `
    <div style="margin-top:16px;text-align:center;">
      <button onclick="toggleItem('${key}').then(()=>{navigate('mod-${mod.id}','${currentTab}')})"
        style="padding:10px 24px;border-radius:8px;border:2px solid ${mod.color};
        background:${isDone ? mod.color : 'transparent'};
        color:${isDone ? '#fff' : mod.color};font-weight:700;cursor:pointer;
        font-family:inherit;font-size:0.85rem;transition:all 0.2s;">
        ${isDone ? '&#10003; Completed' : 'Mark as Complete'}
      </button>
    </div>
  `;

  el.innerHTML = html;

  const path = `modules/${mod.dir}/${currentTab}.md`;
  const text = await loadMd(path);
  document.getElementById('md-area').innerHTML = renderMd(text);
}

// ---- Render: Cheatsheets ----
function renderCheatsheets() {
  const el = document.getElementById('page-cheatsheets');
  let html = `
    <div class="mod-header" style="--accent:var(--c9)">
      <div class="mod-header-label">Reference</div>
      <h1>Cheatsheets</h1>
      <p>Quick reference cards for common patterns and nodes.</p>
    </div>
    <div class="ref-grid">
  `;
  for (const cs of CHEATSHEETS) {
    html += `
      <div class="ref-card" style="--accent:${cs.color}" onclick="navigate('cheatsheet-detail','${cs.file}')">
        <div class="ref-card-icon">${cs.icon}</div>
        <h3>${cs.name}</h3>
        <p>${cs.desc}</p>
      </div>
    `;
  }
  html += '</div>';
  el.innerHTML = html;
}

async function renderCheatsheetDetail(file) {
  const cs = CHEATSHEETS.find(c => c.file === file);
  if (!cs) return;
  const el = document.getElementById('page-cheatsheets');
  document.documentElement.style.setProperty('--accent', cs.color);
  let html = `
    <button class="back-btn" onclick="navigate('cheatsheets')">&#8592; Back to Cheatsheets</button>
    <div class="md-content" id="md-area"><div class="loading-spinner"></div></div>
  `;
  el.innerHTML = html;
  const text = await loadMd(`cheatsheets/${file}`);
  document.getElementById('md-area').innerHTML = renderMd(text);
}

// ---- Render: Project Bible ----
function renderBible() {
  const el = document.getElementById('page-bible');
  let html = `
    <div class="mod-header" style="--accent:var(--c1)">
      <div class="mod-header-label">Reference</div>
      <h1>Project Bible</h1>
      <p>Game design documents, class tables, enemies, and loot.</p>
    </div>
    <div class="ref-grid">
  `;
  for (const b of BIBLE) {
    html += `
      <div class="ref-card" style="--accent:${b.color}" onclick="navigate('bible-detail','${b.file}')">
        <div class="ref-card-icon">${b.icon}</div>
        <h3>${b.name}</h3>
        <p>${b.desc}</p>
      </div>
    `;
  }
  html += '</div>';
  el.innerHTML = html;
}

async function renderBibleDetail(file) {
  const b = BIBLE.find(x => x.file === file);
  if (!b) return;
  const el = document.getElementById('page-bible');
  document.documentElement.style.setProperty('--accent', b.color);
  let html = `
    <button class="back-btn" onclick="navigate('bible')">&#8592; Back to Project Bible</button>
    <div class="md-content" id="md-area"><div class="loading-spinner"></div></div>
  `;
  el.innerHTML = html;
  const text = await loadMd(`project-bible/${file}`);
  document.getElementById('md-area').innerHTML = renderMd(text);
}

// ---- Render: Searchable Reference Page (VS2026 / UE5.7) ----
let refRawText = {};
let refRenderedSections = {};

async function renderRefPage(id, title, desc, color, mdPath) {
  const el = document.getElementById(`page-${id}`);
  document.documentElement.style.setProperty('--accent', color);

  let html = `
    <div class="mod-header" style="--accent:${color}">
      <div class="mod-header-label">Tools Reference</div>
      <h1>${title}</h1>
      <p>${desc}</p>
    </div>
    <div class="search-bar">
      <input type="text" id="ref-search-${id}" placeholder="Search settings, shortcuts, configurations..." oninput="searchRef('${id}')" autocomplete="off" spellcheck="false">
      <span class="search-icon">&#128269;</span>
      <span class="search-count" id="search-count-${id}"></span>
    </div>
    <div class="md-content" id="ref-content-${id}"><div class="loading-spinner"></div></div>
  `;
  el.innerHTML = html;

  const text = await loadMd(mdPath);
  refRawText[id] = text;

  // Parse into sections (split by ## headings)
  const lines = text.split('\n');
  const sections = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) sections.push(current);
      current = { heading: line, lines: [line] };
    } else if (line.startsWith('# ') && !line.startsWith('## ')) {
      if (current) sections.push(current);
      current = { heading: line, lines: [line] };
    } else {
      if (!current) current = { heading: '', lines: [] };
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  refRenderedSections[id] = sections;

  document.getElementById(`ref-content-${id}`).innerHTML = renderMd(text);
}

window.searchRef = function(id) {
  const input = document.getElementById(`ref-search-${id}`);
  const query = input.value.trim().toLowerCase();
  const countEl = document.getElementById(`search-count-${id}`);
  const contentEl = document.getElementById(`ref-content-${id}`);
  const sections = refRenderedSections[id];

  if (!query || query.length < 2) {
    contentEl.innerHTML = renderMd(refRawText[id]);
    countEl.textContent = '';
    return;
  }

  // Filter sections that contain the query
  const matched = sections.filter(s => {
    const text = s.lines.join('\n').toLowerCase();
    return text.includes(query);
  });

  if (matched.length === 0) {
    contentEl.innerHTML = `<div style="padding:32px;text-align:center;color:var(--text-dim);">No results for "<strong>${query}</strong>". Try a different term.</div>`;
    countEl.textContent = '0 results';
    return;
  }

  const filteredMd = matched.map(s => s.lines.join('\n')).join('\n\n');
  let html = renderMd(filteredMd);

  // Highlight matches in the rendered HTML (skip inside tags)
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  html = html.replace(/>([^<]+)</g, (match, text) => {
    return '>' + text.replace(regex, '<mark class="search-highlight">$1</mark>') + '<';
  });

  contentEl.innerHTML = html;
  countEl.textContent = `${matched.length} section${matched.length !== 1 ? 's' : ''} found`;
};

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  const fbOk = initFirebase();

  if (fbOk && syncCode) {
    setSyncStatus('syncing');
    startRealtimeSync();
  } else if (!fbOk) {
    setSyncStatus('no-firebase');
  } else {
    setSyncStatus('offline');
  }

  updateAllProgress();
  navigate('home');
});
