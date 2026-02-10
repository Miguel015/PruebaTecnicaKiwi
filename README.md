# kiwi-challenge — README 

**Estado:** Demo lista para presentación. Frontend (Vite + React) y Backend (Express) ejecutables localmente; incluye pruebas unitarias y E2E.

Este README explica cómo instalar, ejecutar el proyecto, ejecutar las pruebas automatizadas, restaurar los datos de demostración y preparar el repositorio para entrega.

**Rutas principales:**
- Servidor: [server](server)
- Cliente: [client](client)

**Resumen rápido de lo añadido**
- Especificación OpenAPI 3.0: `server/openapi.json` (disponible en `/docs`).
- Validación de solicitudes con JSON Schema (AJV) en `server/index.js`.
- Endpoint `POST /reset` para restaurar los datos en memoria a los valores por defecto (`server/data.default.js`).
- Utilidades centralizadas para dinero y tests unitarios en `client/src/utils/amount.*`.
- Pruebas E2E con Playwright (flujo seed y flujo UI) en `client/tests/e2e/`.
- Estilos responsivos y ajustes visuales en `client/src/styles.css`.
- Documento auxiliar `PREPARE_GIT.md` con pasos para preparar commit/push y crear un ZIP de entrega.

**Prerequisitos**
- Node.js (v16+) y npm instalados.
- Recomendado en Windows: PowerShell (los comandos de ejemplo usan PowerShell).

## Instalación (una sola vez)
1. Instalar dependencias del servidor:

```powershell
cd server
npm install
```

2. Instalar dependencias del cliente:

```powershell
cd ../client
npm install
# Si vas a ejecutar las pruebas E2E y no tienes navegadores instalados:
npx playwright install --with-deps
```

## Ejecutar localmente (desarrollo)

1) Iniciar el servidor (puerto 3333):

```powershell
cd server
npm start
```

2) Iniciar el servidor de desarrollo del cliente (Vite). Si el puerto `5173` está en uso, Vite elegirá el siguiente (por ejemplo `5174`):

```powershell
cd client
npm run dev
```

3) Abrir la aplicación en el navegador (ejemplos):

- Frontend: http://localhost:5173/ (si Vite eligió otro puerto, usar ese puerto)
- Swagger UI (documentación API): http://localhost:3333/docs

Consejo: si Vite elige un puerto distinto, actualiza `client/playwright.config.js` `baseURL` para que las pruebas E2E apunten al puerto correcto.

## Restaurar datos de demostración

Para borrar las transacciones en memoria y restaurar el historial mensual incluido en los datos por defecto, llama al endpoint `/reset`:

```powershell
# desde cualquier terminal
Invoke-RestMethod -Method Post -Uri http://localhost:3333/reset
# o con curl
curl -X POST http://localhost:3333/reset
```

Después, puedes comprobar el endpoint de rewards:

```powershell
curl http://localhost:3333/rewards
```

## Pruebas

Pruebas unitarias (Vitest):

```powershell
cd client
npm run test
```

Pruebas E2E (Playwright): asegúrate de que el servidor y el cliente estén ejecutándose, luego:

```powershell
cd client
npm run test:e2e
```

Ejecutar ambas secuencias (unit + e2e):

```powershell
cd client
npm run test:all
```

Notas:
- Hay dos pruebas E2E: una usa `localStorage` para preparar estado (seeded) y otra realiza todo el flujo mediante interacciones UI (sin seed).
- Si Playwright informa un puerto distinto para Vite, actualiza `client/playwright.config.js` `baseURL`.

## Scripts útiles

- `cd server && npm start` — inicia el backend en el puerto 3333
- `cd client && npm run dev` — inicia el frontend (Vite)
- `cd client && npm run test` — ejecuta las pruebas unitarias (Vitest)
- `cd client && npm run test:e2e` — ejecuta las pruebas E2E (Playwright)
- `cd client && npm run test:all` — ejecuta unit + e2e

## Archivos importantes añadidos / cambiados

- `server/openapi.json` — especificación OpenAPI 3.0 (esquemas y ejemplos)
- `server/data.default.js` — datos por defecto usados por `POST /reset`
- `server/index.js` — añadido `POST /reset` y validación con AJV
- `client/src/utils/amount.js` (+ pruebas) — utilidades para manejo/formateo de dinero
- `client/tests/e2e/*` — pruebas Playwright (seeded y UI-driven)
- `client/src/styles.css` — ajustes responsivos y visuales
- `INTERVIEW.md` — resumen del trabajo y puntos para presentar
- `PREPARE_GIT.md` — pasos para preparar commits y exportar ZIP de entrega

## Resolución de problemas (rápido)

- Puerto en uso (servidor 3333 o Vite 5173): detener procesos node y volver a iniciar.

```powershell
# listar procesos node
tasklist /FI "IMAGENAME eq node.exe" /FO TABLE
# terminar proceso por PID
taskkill /PID <pid> /F
```

- Si Playwright no puede conectarse, confirma el puerto que Vite imprimió en la terminal y actualiza `client/playwright.config.js` `baseURL`.

## Entrega / Commits

Pasos rápidos para revisar, commitear y subir:

```powershell
# revisar cambios
git status
# seleccionar cambios
git add -p
# commit
git commit -m "chore: pulido UI, añadir E2E, OpenAPI y endpoint reset"
# push
git push origin <branch>
```

He creado la rama `deliver/kiwi-challenge` y empujé los cambios a `main` en el remoto indicado. Si quieres, abro un Pull Request desde `deliver/kiwi-challenge` hacia `main`.

## Recomendaciones siguientes

- Añadir pipeline CI que ejecute `npm run test` y `npx playwright test` en cada push.
- Añadir snapshots visuales en Playwright para detectar regresiones visuales.
- Opcional: usar la tipografía exacta del Figma (SF Pro) si tienes la licencia.

---

¿Quieres que abra un Pull Request desde `deliver/kiwi-challenge` hacia `main` ahora? 
