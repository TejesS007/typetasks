# TaskPulse (TypeTasks)

A modern, type-safe task tracker built with pure TypeScript, semantic HTML5, and responsive CSS.

- **Part 1**: Typed Logic Layer (`model.ts`)
- **Part 2**: UI & Deployment Layer (`index.html`, `style.css`, `app.ts`)

---

## Live Demo

- **Live URL**: [https://tejess007.github.io/typetasks/](https://tejess007.github.io/typetasks/) *(deployed via GitHub Pages)*
- **Repository**: [https://github.com/TejesS007/typetasks](https://github.com/TejesS007/typetasks)

---

## Features

- **Strict Type Safety**: Driven entirely by the `Task` interface and `TaskStatus` literal union (`"todo" | "in-progress" | "done"`).
- **Zero `any` / Zero Untyped Logic**: Every DOM node interaction and event payload is strictly typed with proper HTML element casts.
- **Pure Functional State Operations**:
  - `addTask(tasks, title)`: Appends an immutable task with an autoincrement unique `id`.
  - `completeTask(tasks, id)`: Transitions task status directly to `"done"`.
  - `advanceTask(tasks, id)`: Cycles task status (`"todo"` ➔ `"in-progress"` ➔ `"done"`).
  - `deleteTask(tasks, id)`: Immutably removes a task.
  - `filterByStatus(tasks, status)`: Strict filtering with compile-time check against invalid statuses.
  - `countByStatus(tasks, status)`: Fast status count derivation.
- **Modern UI & Aesthetic**:
  - Dark glassmorphism card design with radial background glow.
  - Interactive filter chips with live counter badges.
  - Micro-animations, responsive layout down to mobile viewports, and keyboard support.
  - LocalStorage persistence across browser reloads.

---

## Project Structure

```
├── index.html        # Semantic HTML5 UI layout
├── style.css         # Modern responsive CSS design system
├── model.ts          # Core typed data model & pure operations
├── app.ts            # UI controller wiring model functions to DOM
├── model.js          # Compiled ESM JavaScript (served by static host)
├── app.js            # Compiled ESM JavaScript (served by static host)
├── tsconfig.json     # TypeScript compiler configuration ("strict": true)
└── package.json      # Project dependencies & scripts
```

---

## Local Development & Compilation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Compile TypeScript**:
   ```bash
   npm run build
   # or
   npx tsc
   ```

3. **Type-check without emit**:
   ```bash
   npm run check
   ```

4. **Run locally**:
   ```bash
   npx serve .
   # or
   python -m http.server 8080
   ```
   Open `http://localhost:8080` in any browser.
