import { addTask, completeTask, filterByStatus, advanceTask, deleteTask, countByStatus, } from "./model.js";
// Initial state with local storage persistence and friendly starter tasks
const STORAGE_KEY = "typetasks_data_v1";
const defaultInitialTasks = [
    { id: 1, title: "Review TypeScript Task interface and union", status: "done" },
    { id: 2, title: "Wire model functions to UI event handlers", status: "in-progress" },
    { id: 3, title: "Deploy TypeTasks to a live public URL", status: "todo" },
];
function loadTasks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return defaultInitialTasks;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed;
        }
        return defaultInitialTasks;
    }
    catch {
        return defaultInitialTasks;
    }
}
function saveTasks(tasksToSave) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    }
    catch {
        // Graceful fallback for sandboxed storage environments
    }
}
// App State
let tasks = loadTasks();
let currentFilter = "all";
// Typed DOM Element Casts
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-title");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const emptyDesc = document.getElementById("empty-desc");
const metricTotal = document.getElementById("metric-total");
const metricDone = document.getElementById("metric-done");
const countAll = document.getElementById("count-all");
const countTodo = document.getElementById("count-todo");
const countInProgress = document.getElementById("count-in-progress");
const countDone = document.getElementById("count-done");
const filterButtons = document.querySelectorAll(".filter-btn");
/**
 * Returns tasks matching the active filter, strictly utilizing the typed model operations.
 */
function getVisibleTasks() {
    if (currentFilter === "all") {
        return tasks;
    }
    return filterByStatus(tasks, currentFilter);
}
/**
 * Updates UI counter badges and metrics across filters and the header.
 */
function updateMetrics() {
    const total = tasks.length;
    const todoCount = countByStatus(tasks, "todo");
    const inProgressCount = countByStatus(tasks, "in-progress");
    const doneCount = countByStatus(tasks, "done");
    metricTotal.textContent = String(total);
    metricDone.textContent = `${doneCount}/${total}`;
    countAll.textContent = String(total);
    countTodo.textContent = String(todoCount);
    countInProgress.textContent = String(inProgressCount);
    countDone.textContent = String(doneCount);
}
/**
 * Updates the active visual styling of the filter chip buttons.
 */
function updateFilterButtonStyles() {
    filterButtons.forEach((btn) => {
        const filter = btn.getAttribute("data-filter");
        if (filter === currentFilter) {
            btn.classList.add("active");
            btn.setAttribute("aria-pressed", "true");
        }
        else {
            btn.classList.remove("active");
            btn.setAttribute("aria-pressed", "false");
        }
    });
}
/**
 * Formats user-facing status labels.
 */
function formatStatusLabel(status) {
    switch (status) {
        case "todo":
            return "To Do";
        case "in-progress":
            return "In Progress";
        case "done":
            return "Done";
    }
}
/**
 * Renders the visible task list to the DOM.
 */
function render() {
    updateMetrics();
    updateFilterButtonStyles();
    const visibleTasks = getVisibleTasks();
    taskList.innerHTML = "";
    if (visibleTasks.length === 0) {
        emptyState.hidden = false;
        if (currentFilter === "all") {
            emptyDesc.textContent = "You're all clear! Add a new task above to begin.";
        }
        else {
            emptyDesc.textContent = `No tasks currently marked as "${formatStatusLabel(currentFilter)}".`;
        }
        return;
    }
    emptyState.hidden = true;
    visibleTasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = `task-item status-${task.status}`;
        li.setAttribute("data-task-id", String(task.id));
        // Left info (ID, Title, Status badge)
        const leftDiv = document.createElement("div");
        leftDiv.className = "task-left";
        const idSpan = document.createElement("span");
        idSpan.className = "task-id";
        idSpan.textContent = `#${task.id}`;
        const detailsDiv = document.createElement("div");
        detailsDiv.className = "task-details";
        const titleSpan = document.createElement("span");
        titleSpan.className = "task-title";
        titleSpan.textContent = task.title;
        const statusBadge = document.createElement("span");
        statusBadge.className = `status-badge status-${task.status}`;
        const dot = document.createElement("span");
        dot.className = "status-dot";
        const statusText = document.createTextNode(` ${formatStatusLabel(task.status)}`);
        statusBadge.appendChild(dot);
        statusBadge.appendChild(statusText);
        detailsDiv.appendChild(titleSpan);
        detailsDiv.appendChild(statusBadge);
        leftDiv.appendChild(idSpan);
        leftDiv.appendChild(detailsDiv);
        // Right actions
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "task-actions";
        // Advance button (todo -> in-progress -> done)
        if (task.status !== "done") {
            const advanceBtn = document.createElement("button");
            advanceBtn.className = "action-btn btn-advance";
            advanceBtn.title = task.status === "todo" ? "Move to In Progress" : "Mark as Done";
            advanceBtn.setAttribute("aria-label", advanceBtn.title);
            advanceBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      `;
            advanceBtn.addEventListener("click", () => {
                tasks = advanceTask(tasks, task.id);
                saveTasks(tasks);
                render();
            });
            actionsDiv.appendChild(advanceBtn);
        }
        // Complete button (direct to done)
        if (task.status !== "done") {
            const completeBtn = document.createElement("button");
            completeBtn.className = "action-btn btn-complete";
            completeBtn.title = "Complete Task";
            completeBtn.setAttribute("aria-label", "Complete Task");
            completeBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
            completeBtn.addEventListener("click", () => {
                tasks = completeTask(tasks, task.id);
                saveTasks(tasks);
                render();
            });
            actionsDiv.appendChild(completeBtn);
        }
        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "action-btn btn-delete";
        deleteBtn.title = "Delete Task";
        deleteBtn.setAttribute("aria-label", "Delete Task");
        deleteBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;
        deleteBtn.addEventListener("click", () => {
            tasks = deleteTask(tasks, task.id);
            saveTasks(tasks);
            render();
        });
        actionsDiv.appendChild(deleteBtn);
        li.appendChild(leftDiv);
        li.appendChild(actionsDiv);
        taskList.appendChild(li);
    });
}
// Event Listeners
// 1. Task submission form
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title)
        return;
    tasks = addTask(tasks, title);
    saveTasks(tasks);
    taskInput.value = "";
    taskInput.focus();
    render();
});
// 2. Filter buttons
filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");
        if (filter) {
            currentFilter = filter;
            render();
        }
    });
});
// Initial boot render
render();
//# sourceMappingURL=app.js.map