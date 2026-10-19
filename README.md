# TypeTasks (Part 1: The Typed Model Layer)

A type-safe task tracker built with TypeScript.

## Overview

TypeTasks defines the data model and pure typed operations that form the bedrock of the task tracking application.

### Data Types

- **`TaskStatus`**: A literal union representing the allowed lifecycle stages of a task:
  ```ts
  type TaskStatus = "todo" | "in-progress" | "done";
  ```
- **`Task`**: The exact shape required for every task item:
  ```ts
  interface Task {
    id: number;
    title: string;
    status: TaskStatus;
  }
  ```

### Core Operations

- **`addTask(tasks: Task[], title: string): Task[]`**
  Appends a new task with a unique incremental ID and `"todo"` status without mutating the original list.
- **`completeTask(tasks: Task[], id: number): Task[]`**
  Updates the status of the task matching `id` to `"done"`.
- **`filterByStatus(tasks: Task[], status: TaskStatus): Task[]`**
  Filters tasks strictly matching the specified `TaskStatus`.

### Custom Operations ("Make It Yours")

- **`deleteTask(tasks: Task[], id: number): Task[]`**
  Removes a task by its ID immutably.
- **`advanceTask(tasks: Task[], id: number): Task[]`**
  Advances a task's status sequentially (`"todo"` -> `"in-progress"` -> `"done"`).
- **`countByStatus(tasks: Task[], status: TaskStatus): number`**
  Returns the exact count of tasks currently in a given status.

## Verification & Type Checks

Run the TypeScript compiler with zero errors:

```bash
npm run check
# or
npx tsc --noEmit
```
