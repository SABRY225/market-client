Frontend (Vite + React)

Quick start (PowerShell):

cd frontend
npm install
npm run dev

If the backend runs on a different origin, set `VITE_API_URL` in your environment when starting Vite, e.g.:

$env:VITE_API_URL = 'http://localhost:4000/api'; npm run dev

Alternatively, edit the `API` constant in `src/App.jsx`.

Add Tailwind CSS
-----------------
This scaffold now includes Tailwind config files. To enable Tailwind locally run:

```powershell
npm install
# If you haven't already installed Tailwind deps (they're in package.json), run:
# npm install -D tailwindcss postcss autoprefixer
# Start dev server:
npm run dev
```

Files added:
- `tailwind.config.cjs` — Tailwind content config
- `postcss.config.cjs` — PostCSS config enabling Tailwind + Autoprefixer
- `src/styles.css` — now contains `@tailwind` directives; keep your custom styles below them

If you prefer to regenerate the Tailwind config via the CLI use:

```powershell
npx tailwindcss init -p
```

