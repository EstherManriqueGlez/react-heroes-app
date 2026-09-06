# Superhero Universe

A Single Page Application to discover, explore, and manage a catalog of superheroes and villains. Built with React and TypeScript, it consumes an external hero API and persists favorites locally in the browser.

## Features

- **Home dashboard**: summary stats (total characters, favorites percentage, strongest and smartest heroes), tabs for *All Characters*, *Favorites*, *Heroes*, and *Villains*, and a paginated, responsive character grid.
- **Favorites**: mark any hero or villain as favorite from the grid or the detail page. Favorites persist in `localStorage` and a badge in the header shows the current count.
- **Search & filters**: search by name (debounced), and combine advanced filters such as team, category, universe, status, and minimum strength. Results can be sorted alphabetically (A-Z / Z-A) and toggled between grid and list views.
- **Hero detail page**: full profile with stats, powers, team affiliation, universe information, a power-level indicator, breadcrumbs, and a favorite toggle.
- **Responsive UI**: mobile-first layout with skeleton loading states, a sticky header, empty states, and accessible controls.

## Tech Stack

| Layer      | Technology                                                        |
|------------|-------------------------------------------------------------------|
| Framework  | React 19 + TypeScript                                             |
| Build tool | Vite 7                                                            |
| Styling    | Tailwind CSS v4 + shadcn/ui (Radix primitives)                    |
| Data       | TanStack Query v5, axios                                          |
| Routing    | React Router 7 (hash router)                                      |
| State      | React Context (favorites, persisted in `localStorage`)            |
| Testing    | Vitest + Testing Library + jsdom                                  |

## Getting Started

> The app needs a running hero API. Adjust `VITE_API_URL` to point to your backend instance.

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure the environment**

   ```bash
   cp .env.template .env
   ```

   | Variable      | Description                    | Default                 |
   |---------------|--------------------------------|--------------------------|
   | `VITE_API_URL`| Base URL of the hero API       | `http://localhost:3000`  |

3. **Start the backend API** on the configured port (e.g. port `3000`).

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open the URL printed by Vite (the project uses a hash router, so navigation works on any static host).

## Available Scripts

| Script            | Description                                                       |
|-------------------|-------------------------------------------------------------------|
| `npm run dev`     | Start the Vite development server                                 |
| `npm run build`   | Type-check (`tsc -b`) and build (`vite build`)                    |
| `npm run typecheck` | Type-check the project with `tsc -b`                              |
| `npm run preview` | Preview the production build locally                              |
| `npm run lint`    | Run ESLint over the project                                       |
| `npm test`        | Run the test suite in watch mode                                  |
| `npm run test:ui` | Run tests in the Vitest UI                                        |
| `npm run coverage`| Run tests with coverage report                                    |

## Deployment

The frontend is continuously deployed to **Netlify** from the `main` branch (build command `npm run build`, publish directory `dist`). The backend API runs on **Render**.

Netlify build-time environment variable:

| Variable       | Description                 | Example                              |
|----------------|-----------------------------|--------------------------------------|
| `VITE_API_URL` | Base URL of the hero API (Render) | `https://your-backend.onrender.com`   |

The app uses a hash router, so no server-side redirects or rewrites are required.

## Project Structure

```
src/
├── admin/                 # Admin module (placeholder layout and page)
├── components/
│   ├── custom/            # App-specific components (menu, breadcrumbs, pagination, empty state)
│   └── ui/                # shadcn/ui primitives
├── heroes/
│   ├── actions/           # API calls (get heroes, summary, search, ...)
│   ├── api/               # Shared axios client
│   ├── components/        # Grid, cards, stats, skeletons
│   ├── constants/         # Color/status mappings
│   ├── context/           # Favorites context (localStorage persistence)
│   ├── hooks/             # TanStack Query data hooks
│   ├── layouts/           # Heroes layout (sticky header + main)
│   ├── pages/             # Home, hero detail, and search pages
│   └── types/             # Domain types
├── hooks/                 # Generic hooks (e.g. useDocumentTitle)
└── router/                # Hash router configuration
```

## Testing Notes

- Tests run with Vitest in a jsdom environment. Component snapshots are committed; regenerate them with `npx vitest run <file> -u` when markup intentionally changes.
- The action tests for the live API (`get-hero`, `get-summary`) perform real HTTP requests, so they require the backend to be running on the port defined in the environment used by the test runner (`.env.test`, e.g. `http://localhost:3001`).

## Notes

- This project was created for learning purposes, following a Udemy course on React development to put React, TypeScript, and modern frontend tooling into practice.
