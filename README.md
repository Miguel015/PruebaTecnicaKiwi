# kiwi-challenge — README

**Status:** Demo-ready. Frontend (Vite + React) and Backend (Express) running locally, unit and E2E tests included.

This README explains how to run the project, run tests, reset demo data, and prepare the repository for delivery.

**Paths:**
- Server: [server](server)
- Client: [client](client)

**Quick summary of what's been added**
- OpenAPI 3.0 spec: `server/openapi.json` (served at `/docs`).
- JSON Schema validation using AJV in `server/index.js`.
- `POST /reset` endpoint to restore in-memory data to defaults (uses `server/data.default.js`).
- Centralized money utilities and unit tests (`client/src/utils/amount.*`).
- Playwright E2E tests (seeded and UI-driven) in `client/tests/e2e/`.
- Responsive styles and minor UI polish in `client/src/styles.css`.
- Helper: `PREPARE_GIT.md` with steps to commit/push and create a ZIP for delivery.

**Prerequisites**
- Node.js (v16+) and npm installed.
- Recommended: PowerShell on Windows (commands below assume PowerShell).

## Setup (one-time)
1. Install server dependencies:

```powershell
cd server
npm install
```

2. Install client dependencies:

```powershell
cd ../client
npm install
# If you plan to run Playwright tests and browsers are not installed:
npx playwright install --with-deps
```

## Run locally (development)

1) Start the server (port 3333):

```powershell
cd server
npm start
```

2) Start the client dev server (Vite). If `5173` is busy Vite will pick the next port (e.g. `5174`):

```powershell
cd client
npm run dev
```

3) Open the app in browser (example):

- Frontend: http://localhost:5173/ (if Vite chose another port, use that one)
- Swagger UI (API docs): http://localhost:3333/docs

Tip: If Vite chooses a different port, Playwright config uses `client/playwright.config.js` which is currently set to the port observed during development. You can update `baseURL` there if needed.

## Reset demo data (restore default transactions)

To clear runtime transactions and restore the monthly demo history, call the reset endpoint:

```powershell
# from any terminal
Invoke-RestMethod -Method Post -Uri http://localhost:3333/reset
# or with curl
curl -X POST http://localhost:3333/reset
```

After reset, check the rewards endpoint:

```powershell
curl http://localhost:3333/rewards
```

## Tests

Unit tests (Vitest):

```powershell
cd client
npm run test
```

E2E tests (Playwright): ensure server + client are running, then:

```powershell
cd client
npm run test:e2e
```

Run both sequentially:

```powershell
cd client
npm run test:all
```

Notes:
- Playwright includes two E2E tests: a seeded flow (uses `localStorage`) and a UI-driven flow (no `localStorage`).
- If Playwright reports a different dev server port, update `client/playwright.config.js` `baseURL` to match the port printed by Vite.

## Scripts (summary)

- `cd server && npm start` — start backend on port 3333
- `cd client && npm run dev` — start frontend (Vite)
- `cd client && npm run test` — run unit tests (Vitest)
- `cd client && npm run test:e2e` — run Playwright E2E
- `cd client && npm run test:all` — run unit + e2e

## Important files changed / added (overview)

- `server/openapi.json` — OpenAPI 3.0 spec (schemas + examples)
- `server/data.default.js` — default seeded data used by `POST /reset`
- `server/index.js` — added `POST /reset`, AJV validation
- `client/src/utils/amount.js` (+tests) — money helpers
- `client/tests/e2e/*` — Playwright tests (seeded + UI-driven)
- `client/src/styles.css` — responsive adjustments and visual polish
- `INTERVIEW.md` — summary of work and talking points
- `PREPARE_GIT.md` — helper to prepare commits and delivery ZIP

## Troubleshooting

- Port in use (server 3333 or Vite 5173): stop node processes and restart.

```powershell
# list node processes
tasklist /FI "IMAGENAME eq node.exe" /FO TABLE
# kill process
taskkill /PID <pid> /F
```

- If Playwright cannot connect to dev server, confirm Vite's port and update `client/playwright.config.js` `baseURL` accordingly.

## Delivery / Commit

When ready to deliver, follow `PREPARE_GIT.md`. Quick steps:

```powershell
# review and stage
git status
git add -p
# commit
git commit -m "chore: polish UI, add E2E tests, OpenAPI and reset endpoint"
# push
git push origin <branch>
```

If you prefer, I can create the commit and push for you — tell me the branch name and commit message.

## Next recommendations

- Add CI pipeline to run `npm run test` and `npx playwright test` on push.
- Add visual snapshots in Playwright for regression detection.
- Optionally swap `Inter` to the exact font used in Figma (SF Pro) if you have licensing.

---

If you want, I can now: create the git commit and push to `main`, or push to a feature branch. Which do you prefer? 
