/* ============================================
   TABLETOP QUEST ACADEMY - APP
   ============================================ */

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

// ---- Progress (localStorage) ----
function getProgress() {
  try { return JSON.parse(localStorage.getItem('tqa-progress') || '{}'); }
  catch { return {}; }
}
function setProgress(data) { localStorage.setItem('tqa-progress', JSON.stringify(data)); }
function toggleItem(key) {
  const p = getProgress();
  p[key] = !p[key];
  setProgress(p);
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

  // Nav checks
  for (const m of MODULES) {
    const { done: mDone, total: mTotal } = countModuleProgress(m.id);
    const check = document.getElementById(`check-mod-${m.id}`);
    if (check) {
      if (mDone === mTotal) { check.classList.add('done'); }
      else { check.classList.remove('done'); }
    }
  }
}

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
function navigate(page, extra) {
  // Close sidebar on mobile
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const btn = document.getElementById('menu-btn');
  sidebar.classList.remove('open');
  overlay.classList.remove('open');
  btn.classList.remove('open');

  // Update active nav
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');

  // Hide all pages
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
  }

  // Scroll to top
  window.scrollTo(0, 0);
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const btn = document.getElementById('menu-btn');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('open');
  btn.classList.toggle('open');
}

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

  // Phase timeline
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

  // Set accent color as CSS var
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

  // Mark complete button
  const key = `mod-${mod.id}-${currentTab}`;
  const isDone = isComplete(key);
  html += `
    <div style="margin-top:16px;text-align:center;">
      <button onclick="toggleItem('${key}'); renderModule();"
        style="padding:10px 24px;border-radius:8px;border:2px solid ${mod.color};
        background:${isDone ? mod.color : 'transparent'};
        color:${isDone ? '#fff' : mod.color};font-weight:700;cursor:pointer;
        font-family:inherit;font-size:0.85rem;transition:all 0.2s;">
        ${isDone ? '&#10003; Completed' : 'Mark as Complete'}
      </button>
    </div>
  `;

  el.innerHTML = html;

  // Load markdown
  const path = `modules/${mod.dir}/${currentTab}.md`;
  const text = await loadMd(path);
  document.getElementById('md-area').innerHTML = renderMd(text);
}

function switchTab(tab) {
  currentTab = tab;
  renderModule();
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

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  updateAllProgress();
  navigate('home');
});
