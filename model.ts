export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

/**
 * Returns a new array with a new task appended.
 * The new task has a unique id and starts with status "todo".
 */
export function addTask(tasks: Task[], title: string): Task[] {
  const nextId = tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
  const newTask: Task = {
    id: nextId,
    title,
    status: "todo",
  };
  return [...tasks, newTask];
}

/**
 * Returns a new array where the task with the matching id has its status set to "done".
 */
export function completeTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, status: "done" } : task
  );
}

/**
 * Returns only the tasks whose status matches the specified TaskStatus.
 */
export function filterByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task) => task.status === status);
}

// --- Extra Typed Operations (Make It Yours) ---

/**
 * Returns a new array without the task matching the specified id.
 */
export function deleteTask(tasks: Task[], id: number): Task[] {
  return tasks.filter((task) => task.id !== id);
}

/**
 * Advances a task's status forward:
 * "todo" -> "in-progress" -> "done"
 * If already "done", status remains "done".
 */
export function advanceTask(tasks: Task[], id: number): Task[] {
  const nextStatusMap: Record<TaskStatus, TaskStatus> = {
    "todo": "in-progress",
    "in-progress": "done",
    "done": "done",
  };

  return tasks.map((task) =>
    task.id === id ? { ...task, status: nextStatusMap[task.status] } : task
  );
}

/**
 * Returns the total count of tasks matching a given status.
 */
export function countByStatus(tasks: Task[], status: TaskStatus): number {
  return filterByStatus(tasks, status).length;
}
