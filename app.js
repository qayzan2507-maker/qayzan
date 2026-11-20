/* =====================================================
   APP.JS — My Start Page
   
   MVP features:
     • Greeting with live clock
     • Focus Timer (25 min, start / stop / reset)
     • To-Do List (add, edit, done, delete, localStorage)
     • Quick Links (add, open, delete, localStorage)

   Challenges implemented (all 5):
     1. Light / Dark mode toggle
     2. Custom name in greeting
     3. Change Pomodoro time
     4. Prevent duplicate tasks
     5. Sort tasks
   ===================================================== */


/* ─────────────────────────────────────────────────────
   HELPERS — LocalStorage wrappers
───────────────────────────────────────────────────── */
function lsGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

function lsSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}


/* ─────────────────────────────────────────────────────
   SECTION 1 — LIVE CLOCK & GREETING
───────────────────────────────────────────────────── */
const elGreeting = document.getElementById('greeting');
const elDatetime = document.getElementById('datetime');
const elNameTag  = document.getElementById('name-tag');

function getTimeOfDayGreeting(hour) {
  if (hour >= 5  && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

function updateClock() {
  const now    = new Date();
  const hour   = now.getHours();
  const name   = lsGet('userName', '');

  // Greeting — appends name if one is set
  const base = getTimeOfDayGreeting(hour);
  elGreeting.textContent = name ? `${base}, ${name}!` : `${base}!`;

  // Date + time
  const datePart = now.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const timePart = now.toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  elDatetime.textContent = `${datePart}  ·  ${timePart}`;
}

// Tick every second
updateClock();
setInterval(updateClock, 1000);


/* ─────────────────────────────────────────────────────
   SECTION 2 — CHALLENGE 2: CUSTOM NAME IN GREETING
───────────────────────────────────────────────────── */
const btnSetName    = document.getElementById('btn-set-name');
const modalName     = document.getElementById('modal-name');
const inpName       = document.getElementById('inp-name');
const btnNameSave   = document.getElementById('btn-name-save');
const btnNameCancel = document.getElementById('btn-name-cancel');

function refreshNameTag() {
  const name = lsGet('userName', '');
  elNameTag.textContent = name ? `👋 ${name}` : '';
  btnSetName.textContent = name ? '✏️ Edit name' : '✏️ Set name';
}

function openNameModal() {
  inpName.value = lsGet('userName', '');
  modalName.classList.add('open');
  modalName.setAttribute('aria-hidden', 'false');
  inpName.focus();
}

function closeNameModal() {
  modalName.classList.remove('open');
  modalName.setAttribute('aria-hidden', 'true');
}

btnSetName.addEventListener('click', openNameModal);

btnNameSave.addEventListener('click', () => {
  lsSet('userName', inpName.value.trim());
  refreshNameTag();
  updateClock();
  closeNameModal();
});

btnNameCancel.addEventListener('click', closeNameModal);

inpName.addEventListener('keydown', e => {
  if (e.key === 'Enter')  btnNameSave.click();
  if (e.key === 'Escape') closeNameModal();
});

refreshNameTag();


/* ─────────────────────────────────────────────────────
   SECTION 3 — CHALLENGE 1: LIGHT / DARK MODE
───────────────────────────────────────────────────── */
const btnTheme = document.getElementById('btn-theme');
const htmlEl   = document.documentElement;

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  btnTheme.textContent = theme === 'dark' ? '🌙' : '☀️';
  btnTheme.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
}

// Load saved preference, default dark
applyTheme(lsGet('theme', 'dark'));

btnTheme.addEventListener('click', () => {
  const next = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  lsSet('theme', next);
  applyTheme(next);
});


/* ─────────────────────────────────────────────────────
   SECTION 4 — FOCUS TIMER
   Challenge 3: configurable duration
───────────────────────────────────────────────────── */
const elTimerFace  = document.getElementById('timer-face');
const inpMinutes   = document.getElementById('inp-minutes');
const btnApply     = document.getElementById('btn-apply');
const btnStart     = document.getElementById('btn-start');
const btnStop      = document.getElementById('btn-stop');
const btnReset     = document.getElementById('btn-reset');

let timerInterval  = null;
let isRunning      = false;
let totalSecs      = lsGet('pomDuration', 25) * 60;
let remainingSecs  = totalSecs;

// Restore saved duration into the input
inpMinutes.value = lsGet('pomDuration', 25);

function pad(n) { return String(n).padStart(2, '0'); }

function renderTimer() {
  const m = Math.floor(remainingSecs / 60);
  const s = remainingSecs % 60;
  elTimerFace.textContent = `${pad(m)}:${pad(s)}`;
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning     = false;
  elTimerFace.classList.remove('running');
}

// Start
btnStart.addEventListener('click', () => {
  if (isRunning) return;
  // Restart from full duration if already at 0
  if (remainingSecs <= 0) remainingSecs = totalSecs;
  isRunning = true;
  elTimerFace.classList.add('running');
  timerInterval = setInterval(() => {
    remainingSecs--;
    renderTimer();
    if (remainingSecs <= 0) {
      stopTimer();
      elTimerFace.textContent = '00:00';
      // Use setTimeout so the DOM updates before the alert blocks
      setTimeout(() => alert('⏰ Time\'s up! Great focus session!'), 50);
    }
  }, 1000);
});

// Stop (pause)
btnStop.addEventListener('click', () => {
  if (!isRunning) return;
  stopTimer();
});

// Reset
btnReset.addEventListener('click', () => {
  stopTimer();
  remainingSecs = totalSecs;
  renderTimer();
});

// Challenge 3 — Apply custom duration
btnApply.addEventListener('click', () => {
  let mins = parseInt(inpMinutes.value, 10);
  if (!mins || mins < 1)   mins = 1;
  if (mins > 120)          mins = 120;
  inpMinutes.value = mins;

  stopTimer();
  totalSecs     = mins * 60;
  remainingSecs = totalSecs;
  lsSet('pomDuration', mins);
  renderTimer();
});

inpMinutes.addEventListener('keydown', e => { if (e.key === 'Enter') btnApply.click(); });

renderTimer();


/* ─────────────────────────────────────────────────────
   SECTION 5 — TO-DO LIST
   Challenge 4: prevent duplicates
   Challenge 5: sort tasks
───────────────────────────────────────────────────── */
let tasks = lsGet('tasks', []);

const inpTask       = document.getElementById('inp-task');
const btnAddTask    = document.getElementById('btn-add-task');
const taskListEl    = document.getElementById('task-list');
const taskEmptyEl   = document.getElementById('task-empty');
const selSort       = document.getElementById('sel-sort');

// Edit-task modal
const modalEdit     = document.getElementById('modal-edit');
const inpEditTask   = document.getElementById('inp-edit-task');
const btnEditSave   = document.getElementById('btn-edit-save');
const btnEditCancel = document.getElementById('btn-edit-cancel');
let   editingTaskId = null;

function saveTasks() { lsSet('tasks', tasks); }

/* Return a sorted copy of tasks without mutating the array */
function getSortedTasks() {
  const mode = selSort.value;
  return [...tasks].sort((a, b) => {
    if (mode === 'newest') return b.id - a.id;
    if (mode === 'oldest') return a.id - b.id;
    if (mode === 'az')     return a.text.localeCompare(b.text);
    if (mode === 'done')   return Number(a.done) - Number(b.done);
    return 0;
  });
}

function renderTasks() {
  const sorted = getSortedTasks();
  taskListEl.innerHTML = '';
  taskEmptyEl.style.display = sorted.length ? 'none' : 'block';

  sorted.forEach(task => {
    const li = document.createElement('li');
    li.className  = 'task-item' + (task.done ? ' is-done' : '');
    li.dataset.id = task.id;

    // Checkbox
    const chk = document.createElement('input');
    chk.type      = 'checkbox';
    chk.className = 'task-check';
    chk.checked   = task.done;
    chk.setAttribute('aria-label', `Mark "${task.text}" as done`);
    chk.addEventListener('change', () => {
      const t = tasks.find(t => t.id === task.id);
      if (t) t.done = chk.checked;
      saveTasks();
      renderTasks();
    });

    // Text
    const span = document.createElement('span');
    span.className   = 'task-text';
    span.textContent = task.text;

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className   = 'task-btn';
    editBtn.textContent = '✏️';
    editBtn.title       = 'Edit task';
    editBtn.addEventListener('click', () => openEditModal(task.id, task.text));

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className   = 'task-btn';
    delBtn.textContent = '🗑️';
    delBtn.title       = 'Delete task';
    delBtn.addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    // Assemble
    const actions = document.createElement('div');
    actions.className = 'task-actions';
    actions.append(editBtn, delBtn);

    li.append(chk, span, actions);
    taskListEl.appendChild(li);
  });
}

/* Challenge 4 — duplicate check (case-insensitive, trims whitespace) */
function isDuplicate(text, excludeId = null) {
  const normalised = text.trim().toLowerCase();
  return tasks.some(t => t.id !== excludeId && t.text.toLowerCase() === normalised);
}

function highlightDuplicate(inputEl) {
  inputEl.style.borderColor = 'var(--danger)';
  setTimeout(() => { inputEl.style.borderColor = ''; }, 1600);
}

function addTask() {
  const text = inpTask.value.trim();
  if (!text) return;

  if (isDuplicate(text)) {
    highlightDuplicate(inpTask);
    alert('⚠️ That task already exists!');
    inpTask.select();
    return;
  }

  tasks.push({ id: Date.now(), text, done: false });
  saveTasks();
  renderTasks();
  inpTask.value = '';
  inpTask.focus();
}

btnAddTask.addEventListener('click', addTask);
inpTask.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

// Challenge 5 — re-render on sort change
selSort.addEventListener('change', renderTasks);

/* Edit-task modal */
function openEditModal(id, currentText) {
  editingTaskId     = id;
  inpEditTask.value = currentText;
  modalEdit.classList.add('open');
  modalEdit.setAttribute('aria-hidden', 'false');
  inpEditTask.focus();
  inpEditTask.select();
}

function closeEditModal() {
  modalEdit.classList.remove('open');
  modalEdit.setAttribute('aria-hidden', 'true');
  editingTaskId = null;
}

btnEditSave.addEventListener('click', () => {
  const newText = inpEditTask.value.trim();
  if (!newText) return;

  // Duplicate check — ignore the task currently being edited
  if (isDuplicate(newText, editingTaskId)) {
    highlightDuplicate(inpEditTask);
    alert('⚠️ A task with that name already exists!');
    inpEditTask.select();
    return;
  }

  const task = tasks.find(t => t.id === editingTaskId);
  if (task) task.text = newText;
  saveTasks();
  renderTasks();
  closeEditModal();
});

btnEditCancel.addEventListener('click', closeEditModal);

inpEditTask.addEventListener('keydown', e => {
  if (e.key === 'Enter')  btnEditSave.click();
  if (e.key === 'Escape') closeEditModal();
});

renderTasks();


/* ─────────────────────────────────────────────────────
   SECTION 6 — QUICK LINKS
───────────────────────────────────────────────────── */
let links = lsGet('links', []);

const inpLinkLabel = document.getElementById('inp-link-label');
const inpLinkUrl   = document.getElementById('inp-link-url');
const btnAddLink   = document.getElementById('btn-add-link');
const linkGridEl   = document.getElementById('link-grid');
const linkEmptyEl  = document.getElementById('link-empty');

function saveLinks() { lsSet('links', links); }

function renderLinks() {
  linkGridEl.innerHTML = '';
  linkEmptyEl.style.display = links.length ? 'none' : 'block';

  links.forEach(link => {
    const pill = document.createElement('div');
    pill.className = 'link-pill';

    const a = document.createElement('a');
    a.href      = link.url;
    a.target    = '_blank';
    a.rel       = 'noopener noreferrer';
    a.className = 'link-anchor';
    a.textContent = link.label;

    const del = document.createElement('button');
    del.className   = 'link-del';
    del.textContent = '✕';
    del.title       = `Remove ${link.label}`;
    del.addEventListener('click', () => {
      links = links.filter(l => l.id !== link.id);
      saveLinks();
      renderLinks();
    });

    pill.append(a, del);
    linkGridEl.appendChild(pill);
  });
}

function addLink() {
  const label = inpLinkLabel.value.trim();
  let   url   = inpLinkUrl.value.trim();
  if (!label || !url) return;

  // Auto-prefix https:// when user forgets the scheme
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  links.push({ id: Date.now(), label, url });
  saveLinks();
  renderLinks();

  inpLinkLabel.value = '';
  inpLinkUrl.value   = '';
  inpLinkLabel.focus();
}

btnAddLink.addEventListener('click', addLink);
inpLinkUrl.addEventListener('keydown', e => { if (e.key === 'Enter') addLink(); });

renderLinks();


/* ─────────────────────────────────────────────────────
   SECTION 7 — GLOBAL MODAL CLOSE (click backdrop)
───────────────────────────────────────────────────── */
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => {
    // Only close when clicking the backdrop itself, not the box
    if (e.target === modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
});
