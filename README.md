# Kiwi — Prueba técnica: Rewards → Withdraw

1) Descripción
----------------
Este repositorio implementa, en formato de demo técnica, el flujo "Rewards → Withdraw → Success" definido en el Figma de la prueba. Su objetivo es demostrar criterio técnico, decisiones justificadas y cobertura de pruebas; no es una solución productiva.

Qué problema resuelve
- Simula el flujo por el cual un usuario consulta su saldo de rewards, selecciona un método y una cuenta para retirar fondos, confirma la operación y obtiene una pantalla de éxito.

Qué NO intenta resolver
- Integración con pasarelas de pago reales, persistencia en base de datos en producción, ni control de acceso completo.

2) Alcance
----------------
- Pantallas implementadas: Balance/Historial (Rewards), Select Method, Select Account, Withdraw Confirm, Withdraw Success.
- La interfaz y el comportamiento se han alineado con el diseño de Figma dentro de las limitaciones de la demo (sin integración externa).

3) Stack técnico
----------------
- Frontend: React + Vite, JavaScript, CSS
- Backend: Node.js + Express (datos en memoria)
- API: OpenAPI 3.0 (Swagger UI disponible en `/docs`)
- Pruebas: Vitest (unit), Playwright (E2E)
- Herramientas: Spec‑Kit (workflow de especificación), Copilot como asistente de productividad

4) Decisiones técnicas (resumen)
----------------
- Enfoque minimalista y reproducible: datos en memoria para mantener determinismo en pruebas y foco en el flujo.
- Montos representados en centavos (`amountCents`) y procesados por utilidades centralizadas (`client/src/utils/amount.js`) para evitar errores de precisión.
- Validación server‑side mediante JSON Schema para mantener contratos estables entre cliente y API.
- Pruebas: unitarias para utilidades críticas y E2E para validar la experiencia completa.
- No se sobreingenierizó: no se añadieron bases de datos, colas o integraciones innecesarias que no aportan al objetivo de la prueba.

5) Uso de Spec‑Kit
----------------
- Analyze: recopilación de ambigüedades y definición de criterios de aceptación.
- Plan/Constitution: establecimiento de límites de alcance (sin integraciones externas).
- Specify/Tasks: descomposición del trabajo en tareas pequeñas y priorizadas (API, utilidades, pruebas, UI).

6) Cómo ejecutar (comandos exactos)
----------------
Prerequisitos: Node.js v16+ y npm

Instalación:
```powershell
# servidor
cd server
npm install

# cliente
cd ../client
npm install
```

Instalar navegadores para Playwright (si ejecutarás E2E):
```powershell
npx playwright install --with-deps
```

Ejecución en desarrollo:
```powershell
# iniciar API (puerto 3333)
cd server
npm start

# en otra terminal: iniciar cliente (Vite)
cd client
npm run dev
```

URLs relevantes:
- Aplicación: http://localhost:5173/ (Vite)
- Swagger UI (API docs): http://localhost:3333/docs

Restaurar datos de demostración:
```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3333/reset
# o
curl -X POST http://localhost:3333/reset
```

Pruebas:
```powershell
# unit tests
cd client
npm run test

# e2e (server + client corriendo)
cd client
npm run test:e2e

# ambos
cd client
npm run test:all
```

7) Backend / API
----------------
Endpoints implementados (resumen):
- `GET /rewards` — devuelve `{ balanceCents, currency, history }`
- `GET /accounts` — lista de cuentas vinculadas
- `GET /withdrawal-methods` — métodos disponibles
- `POST /withdrawals` — crea un retiro (request body validado)
- `GET /withdrawals/:id` — recuperar retiro por id
- `POST /reset` — restaura `server/data.default.js` en memoria (solo demo)

Swagger UI disponible en `/docs` cuando el servidor esté en ejecución.

8) Supuestos y limitaciones
----------------
- Datos en memoria para facilitar pruebas deterministas.
- No hay autenticación/autorization en las rutas (fuera de alcance para la prueba).
- No se integró con servicios externos (bancos, pasarelas de pago).

9) Posibles mejoras (priorizadas)
----------------
- Añadir persistencia (Postgres/SQLite) y migraciones.
- Añadir autenticación y permisos para rutas sensibles.
- Configurar CI (GitHub Actions) que ejecute lint, unit tests y Playwright E2E.
- Añadir pruebas visuales (snapshots) para detectar regresiones de UI.
- Dockerizar la aplicación para reproducibilidad en CI y local.

Contribución y mantenimiento
----------------
- Mantener la lógica del negocio separada de la UI y cubrir utilidades críticas con unit tests.
- Usar ramas `feature/*` y PRs para cambios; los PRs deben incluir pasos para reproducir localmente y pruebas que cubran lo modificado.

Contacto / próximos pasos
----------------
Si deseas que deje el repositorio limpio con solo la rama `main` y que configure CI básico que ejecute las pruebas, indícalo y procedo.

