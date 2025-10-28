# Copilot instructions for this repo

These notes help AI coding agents be productive quickly in this codebase. They capture how the app is wired, expected workflows, and project-specific patterns to follow.

## Big picture
- Single-page app built with React 18 + Vite 6 + TailwindCSS 3.
- Entry: `index.html` -> `src/main.jsx` (React StrictMode) -> `src/App.jsx` (all UI + logic lives here).
- Purpose: fetch current weather for a user-entered city (OpenWeatherMap API) and render a gradient UI that reflects the weather condition.
- No global state manager, router, or API client library; plain React state + `fetch` in `App.jsx`.

## Local workflows
- Dev server: `npm run dev` (Vite at http://localhost:5173).
- Build: `npm run build` (outputs `dist/`). Preview: `npm run preview`.
- Lint: `npm run lint`. ESLint ignores `dist/`.
- Node: Use Node 18+ (Vite 6 requires modern Node). Package manager: npm.

## Environment & API integration
- Env variables use Vite prefix and `import.meta.env`:
  - `VITE_OPENWEATHER_API_KEY` (string)
  - `VITE_DEMO_MODE` ('true' enables local demo data)
  - `VITE_ENABLE_GEO` ('true' auto-prompts for geolocation on load)
- Template: `.env.example`; copy to `.env` at repo root.
- API endpoint: `https://api.openweathermap.org/data/2.5/weather` with metric units.
- Error handling conventions (keep consistent): 404 => "City not found", 401 => "Invalid API key...", else => generic failure.
- Demo mode is auto-enabled when the API key is missing; it simulates latency and returns canned data keyed by city keywords. This is the preferred fast path for UI work.
- Geolocation: A "Use my location" button fetches by `lat/lon`. In demo mode, coordinates map to a canned condition. When `VITE_ENABLE_GEO` is true, the app auto-requests geolocation on load.

## Data flow and state
- `App.jsx` holds all state: `city`, `weather`, `loading`, `error`, `fadeIn`, `theme`.
- Submit -> `fetchWeather(e)`: validates input, toggles loading, fetches or demos, sets `weather` and triggers `fadeIn`.
- Geolocation -> `handleUseMyLocation()` -> `fetchWeatherByCoords(lat, lon)`: mirrors the same error conventions and demo behavior.
- Rendering guards: shows error banner; shows instructional text when no data; shows a card when `weather` exists.
- Gradients: computed via `getCurrentGradient()` using `weather.weather[0].main`.

## Styling and UI patterns
- Tailwind-first. Global directives in `src/index.css` and minimal component CSS in `src/App.css`.
- Background gradients are mapped in `App.jsx`:
  - `weatherGradients` keys must match OpenWeather `main` values (e.g., Clear, Clouds, Rain...). If you add conditions, update this map.
- Icons are loaded from OpenWeather (`getWeatherIcon(iconCode)`). Alt text is the provided description.
- Theme toggle: Light/Dark via Tailwind `darkMode: 'class'`; state persisted in `localStorage` and applied to `document.documentElement`.

## Linting conventions
- ESLint config: `eslint.config.js` with `@eslint/js`, `eslint-plugin-react`, `react-hooks`, and `react-refresh`.
- Notable rules:
  - Extends React recommended + JSX runtime rules.
  - `react-refresh/only-export-components`: warn (OK to export constants).
  - `react/jsx-no-target-blank`: off.

## Dependencies and integration points
- Core: `react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`.
- Animations: `framer-motion` is installed but not used yet—OK to use for subtle transitions if needed. Prefer lightweight usage.
  - Used for enter/exit transitions on the weather card and a subtle icon scale/fade.

## AI behavior
When generating or editing code:
- Keep logic in `App.jsx` unless a new component clearly improves clarity.
- Use Tailwind utility classes over raw CSS.
- For new animations, prefer `framer-motion` (already installed).
- Preserve the current weather data structure and error-handling conventions.
- Avoid introducing unnecessary dependencies (Axios, Zustand, Redux, etc.).

## How to extend safely (follow current patterns)
- Keep API calls simple and colocated (or extract to a small helper in `src/` if logic grows). Stick with `fetch` and the current error messages.
- When adding new UI, compose inside `App.jsx` or create small components in `src/` without introducing routing unless required.
- Preserve Tailwind approach; add utilities instead of bespoke CSS. If adding many styles, prefer component-level CSS files alongside components.
- Respect demo mode: ensure new features work without a real API key (provide mocked/demo branches like the existing `DEMO_MODE`).

## Quick references
- Entry: `src/main.jsx`
- App + logic: `src/App.jsx`
- Styles: `src/index.css`, `src/App.css`
- Config: `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`
- Setup: `README.md` (install, run, env vars)
