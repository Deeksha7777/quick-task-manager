// Basic localStorage key
const STORAGE_KEY = 'quick_tasks_v1';

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const countSpan = document.getElementById('count');
const clearBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter');

let tasks = []; // {id, title, completed, createdAt}

// load from localStorage
function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading tasks from storage', e);
    tasks = [];
  }
}

// save to localStorage
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// simple id generator
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,7);
}

let currentFilter = 'all';

function renderTasks() {
  taskList.innerHTML = '';
  const visible = tasks.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  visible.forEach(t => {
    const li = document.createElement('li');
    li.className = 'task-item' + (t.completed ? ' completed' : '');
    li.dataset.id = t.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = t.completed;
    checkbox.addEventListener('change', () => toggleComplete(t.id));

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = t.title;

    const created = document.createElement('div');
    created.className = 'muted';
    created.style.fontSize = '11px';
    created.style.color = 'var(--muted)';
    const dt = new Date(t.createdAt);
    created.textContent = dt.toLocaleString();

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.title = 'Delete';
    delBtn.textContent = '🗑';
    delBtn.addEventListener('click', () => deleteTask(t.id));

    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(created);
    li.appendChild(delBtn);

    taskList.appendChild(li);
  });

  countSpan.textContent = `${tasks.length} tasks`;
}

function addTaskFromInput() {
  const text = taskInput.value.trim();
  if (!text) return alert('Please type a task.');
  const newTask = {
    id: uid(),
    title: text,
    completed: false,
    createdAt: Date.now()
  };
  tasks.unshift(newTask); // newest first
  saveTasks();
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

function toggleComplete(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.completed = !t.completed;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(x => x.id !== id);
  saveTasks();
  renderTasks();
}

addBtn.addEventListener('click', addTaskFromInput);

// allow Enter to add
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTaskFromInput();
});

// clear completed
clearBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
});

// filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// init
loadTasks();
renderTasks();

