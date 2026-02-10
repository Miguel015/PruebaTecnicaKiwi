# Notas para la entrevista — Kiwi Rewards / Withdraw Flow

Resumen corto
- Implementado flujo mínimo end-to-end: `RewardsOverview` -> `SelectMethod` -> `SelectAccount` -> `WithdrawConfirm` -> `WithdrawSuccess`.
- Backend: Express in-memory (seeded) con OpenAPI servido en `GET /docs`.
- Frontend: Vite + React con rutas en `client/src`.

Puntos técnicos para explicar
- Decisions: KISS, API-first, integer cents (`amountCents`) to avoid floating money issues.
- Security: demo app, auth simulated via fixed `user-1`. In production explicaría tokens + RBAC.
- Error handling: backend devuelve 400/404/409 según casos; frontend muestra message.
- Tests: included `scripts/test_e2e.js` to exercise API flow automatically.

Archivos clave
- `server/index.js` — endpoints y Swagger mounting (`/docs`).
- `server/openapi.json` — OpenAPI spec.
- `client/src/*` — páginas React que cubren el flujo.
- `scripts/test_e2e.js` — pequeño script Node para pruebas automatizadas del API.

Cómo correr localmente (Windows PowerShell)
```
cd server
npm install
npm start

# en otra terminal
cd client
npm install
npm run dev

# opcional: ejecutar test e2e rápido
node scripts/test_e2e.js
```

Preguntas esperables y respuestas breves
- ¿Por qué `amountCents`? — Evita errores de redondeo; integer atomic.
- ¿Por qué in-memory? — Requerimiento demo; fácil de explicar y sustituir por DB.
- ¿Qué validarías adicionalmente? — Rate limits, idempotency, auditing, retries para integración bancarias.

Notas para demo en entrevista
- Abrir `http://localhost:5173` y mostrar flujo. Mostrar `http://localhost:3333/docs` (Swagger) para enseñar contrato.
- Explicar trade-offs: tiempo, scope, seguridad.
