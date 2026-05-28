const taskInput = document.getElementById("task-input");

const addBtn = document.getElementById("add-btn");

const taskList = document.getElementById("task-list");

const filterButtons =
  document.querySelectorAll(".filter-btn");

/* =========================
   STATE
========================= */

let tasks =
  JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

/* =========================
   SAVE TO LOCAL STORAGE
========================= */

function saveTasks() {

  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );

}

/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {

    filteredTasks =
      tasks.filter(task => !task.completed);

  }

  if (currentFilter === "completed") {

    filteredTasks =
      tasks.filter(task => task.completed);

  }

  filteredTasks.forEach(task => {

    const li = document.createElement("li");

    li.className =
      task.completed
        ? "task completed"
        : "task";

    li.dataset.id = task.id;

    li.innerHTML = `
      <span>${task.text}</span>

      <div class="task-actions">

        <button class="complete-btn">
          ✓
        </button>

        <button class="edit-btn">
          Edit
        </button>

        <button class="delete-btn">
          Delete
        </button>

      </div>
    `;

    taskList.appendChild(li);

  });

}

/* =========================
   ADD TASK
========================= */

function addTask() {

  const text = taskInput.value.trim();

  if (!text) return;

  const newTask = {

    id: Date.now(),

    text,

    completed: false

  };

  tasks.push(newTask);

  saveTasks();

  renderTasks();

  taskInput.value = "";

}

/* =========================
   EVENT: ADD BUTTON
========================= */

addBtn.addEventListener("click", addTask);

/* ENTER KEY */

taskInput.addEventListener("keypress", e => {

  if (e.key === "Enter") {

    addTask();

  }

});

/* =========================
   EVENT DELEGATION
========================= */

taskList.addEventListener("click", e => {

  const li = e.target.closest(".task");

  const id = Number(li.dataset.id);

  /* DELETE */

  if (e.target.classList.contains("delete-btn")) {

    tasks =
      tasks.filter(task => task.id !== id);

  }

  /* COMPLETE */

  if (e.target.classList.contains("complete-btn")) {

    tasks = tasks.map(task => {

      if (task.id === id) {

        task.completed = !task.completed;

      }

      return task;

    });

  }

  /* EDIT */

  if (e.target.classList.contains("edit-btn")) {

    const task = tasks.find(
      task => task.id === id
    );

    const updatedText =
      prompt("Edit task:", task.text);

    if (updatedText !== null) {

      task.text = updatedText.trim();

    }

  }

  saveTasks();

  renderTasks();

});

/* =========================
   FILTER BUTTONS
========================= */

filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    currentFilter =
      button.dataset.filter;

    filterButtons.forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    renderTasks();

  });

});

/* INITIAL RENDER */

renderTasks();