## Analyze

- Objetivo: Entregar un flujo de Rewards → Retiro → Éxito fiel al diseño de Figma, con contrato API documentado y mínima complejidad para demo.
- Supuestos: demo en memoria, usuario fijo (`user-1`), moneda USD y manejo de montos en `amountCents` (enteros).
- Alcance: UI, endpoints mínimos, feedback UX (loading, disabled, success), Spec‑Kit artefactos resumidos.

## Plan

- API first: mantener OpenAPI como fuente de verdad (`server/openapi.json`).
- Implementar validaciones básicas en backend y respuestas consistentes.
- Frontend: componentes reutilizables, util de montos, estados claros y persistencia ligera (localStorage).
- QA: script E2E ligero y pasos para demo local.

## Constitution

- Principios: KISS, API-driven, integer money, componentes pequeños y reutilizables, documentación para la demo.
- Restricciones: no integrar pagos reales, no persistencia en DB por alcance.

## Specify

- Endpoints mínimos:
  - `GET /rewards` -> `{ balanceCents, currency, history[] }`
  - `GET /withdrawal-methods` -> `[]`
  - `GET /accounts?methodId=` -> `[]`
  - `POST /withdrawals` -> crea retiro `{ id, userId, accountId, amountCents, status }`
  - `GET /withdrawals/{id}` -> detalle
  - `POST /topup` -> recarga demo

- Casos de uso (acceptance): retiro exitoso, fondos insuficientes (409), request inválido (400).

## Tasks

1. Añadir/firmar OpenAPI (ya presente).
2. Extraer utilidades de monto en frontend (`cents` ↔ UI).
3. Mejorar mensajes de error y estados loading en frontend.
4. Añadir `SPEC.md` y documentar decisiones (este archivo).
5. Preparar respuestas para la demo (puntos a destacar en `INTERVIEW.md`).
