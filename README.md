# PW E-commerce / Impulsa.barrio

Proyecto full-stack de **crowdfunding** (microfinanciación de proyectos comunitarios) para Programación Web 2026 Q1.

**Lenguaje:** JavaScript (React/JSX), sin TypeScript.

## Estado actual

- **E1:** Next.js en raíz, CI en GitHub Actions (lint, build, test), preview por PR vía Vercel (conectar el repo en el dashboard).
- **E2:** Landing y vistas de campañas: `/`, `/campanas`, `/campanas/[slug]` (datos mock en `lib/data/campaigns.js`, reglas de privacidad en listados).
- **E3–E4 (en curso):** formulario de aporte con `fetch` y validación compartida; `POST /api/campanas/[slug]/aporte` valida y devuelve vista previa pública **sin guardar en base de datos** aún.
- **Pendiente (plan):** Supabase + admin (E5), Mercado Pago + webhooks + demo estable (E6). Detalle en el plan y en [decision.md](decision.md).

**Rutas principales:** `/` landing · `/campanas` listado · `/campanas/[slug]` detalle con progreso, aportes (mock) y formulario de aporte.

## Flujo de aporte (antes del pago, E3)

En el detalle de campaña, el formulario envía **POST** a `/api/campanas/[slug]/aporte` con JSON:

| Campo | Tipo | Notas |
| ----- | ---- | ----- |
| `amount` | número | Mínimo $100 ARS (validación compartida cliente/servidor). |
| `displayName` | string | Máx. 120 caracteres; sirve para nombre público o para derivar iniciales. |
| `showPublicName` | boolean | Si es `false`, en la lista pública se muestran **iniciales** (regla en `lib/data/campaigns.js`: primera letra del primer término + del último; un solo término → una inicial) o **“Anónimo”** si no hay texto. |
| `showAmount` | boolean | Si es `false`, en la lista pública el monto se muestra como “Monto oculto”; el valor real se usará en servidor para totales cuando exista persistencia. |

Los listados públicos deben usar solo datos derivados (`getContributorDisplayName`, `getContributionAmountDisplay`), no campos internos innecesarios.

## Cómo clonar e instalar

```bash
git clone <url-del-repo>
cd pw-ecommerce
npm install
```

## Cómo ejecutar

- **Desarrollo:** `npm run dev` — abre [http://localhost:3000](http://localhost:3000)
- **Build:** `npm run build`
- **Producción local:** `npm run start`
- **Lint:** `npm run lint`
- **Tests:** `npm run test`

## Preview por PR

Con el repo conectado a [Vercel](https://vercel.com), cada pull request genera una URL de preview automáticamente. Conectar el repositorio en el dashboard de Vercel es suficiente; no hace falta configuración extra en el repo.

## Fases del proyecto

El desarrollo sigue el plan en [.cursor/plans/plan_pw_e-commerce_2026_c681da85.plan.md](.cursor/plans/plan_pw_e-commerce_2026_c681da85.plan.md). Las decisiones técnicas se documentan en [decision.md](decision.md). Los prompts al asistente (y cuáles fueron clave) están en [prompts.md](prompts.md).
