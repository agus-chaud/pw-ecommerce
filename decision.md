# Decisiones técnicas — Fase 1 (E1: Repo + CI/CD + preview)

Registro de decisiones tomadas en la Fase 1 del plan agent-teams-lite: justificación, alternativas consideradas, impacto y aprendizaje.

---

## D1. Next.js en la raíz del repositorio

| Campo | Detalle |
|-------|--------|
| **Decisión** | Estructura base del proyecto con Next.js en la raíz del repo (no en un subdirectorio). |
| **Por qué** | El plan recomienda explícitamente "Next.js en raíz del repo"; alinea con el stack oficial del curso (Next.js, Vercel, Supabase) y evita una capa extra de rutas o monorepos en esta etapa. |
| **Alternativas** | (1) Next.js en subcarpeta `app-web/`: rechazado porque complica CI y Vercel sin beneficio para un solo front. (2) Mantener solo HTML estático: rechazado porque las fases 4–6 requieren API Routes y SSR. (3) Otro framework (Remix, SvelteKit): no indicado en la rúbrica. |
| **Impacto** | Rutas y comandos estándar (`npm run dev`, `next build`); Vercel detecta Next.js sin configuración extra; toda la app vive en `app/`, `components/`, etc. |
| **Aprendido** | Para entregables E1–E6, tener Next.js desde Fase 1 evita migraciones posteriores y deja el pipeline (lint/build/test) alineado desde el inicio. |

---

## D2. App Router (Next.js 14) y JavaScript

| Campo | Detalle |
|-------|--------|
| **Decisión** | Usar App Router (`app/layout.jsx`, `app/page.jsx`, etc.) y **JavaScript** (`.jsx` / `.js`) en todo el código del proyecto. |
| **Por qué** | Consigna del curso: no se puede programar en TypeScript. Next.js soporta App Router en JS sin pérdida de funcionalidad; `jsconfig.json` mantiene el alias `@/*` para imports. |
| **Alternativas** | TypeScript: descartado por requisito académico. Pages Router: menos alineado con el plan y la documentación actual de Next.js. |
| **Impacto** | Sin `tsconfig.json` ni tipos estáticos; documentación de formas de datos con comentarios JSDoc donde aporta (p. ej. en `lib/data/campaigns.js`). |
| **Aprendido** | El stack sigue siendo mantenible con ESLint y tests; convenciones claras de nombres sustituyen parte del valor que daban los tipos. |

---

## D3. Pipeline CI: GitHub Actions con lint, build y test

| Campo | Detalle |
|-------|--------|
| **Decisión** | Un único workflow en `.github/workflows/ci.yml` que en cada push/PR a `main`/`master` ejecuta: `npm ci` → `npm run lint` → `npm run build` → `npm run test`. |
| **Por qué** | El plan exige "lint, build, tests básicos" para nivel Excelente en E1; un solo job reduce duración y complejidad; `npm ci` garantiza builds reproducibles. |
| **Alternativas** | (1) Jobs separados (lint / build / test): mejor paralelización pero más configuración; para un repo pequeño un solo job es suficiente. (2) Otro CI (GitLab CI, CircleCI): el plan menciona "GitHub Actions (o el CI del curso)", se eligió GitHub Actions por integración con PRs y Vercel. (3) Solo build sin tests: no cumple "tests básicos". |
| **Impacto** | Cada PR debe pasar lint, build y tests para poder mergear (si se activa branch protection). Node 20 LTS y cache `npm` para tiempos razonables. |
| **Aprendido** | Incluir un test mínimo (p. ej. smoke del home) desde Fase 1 obliga a mantener la suite y evita un pipeline que solo haga build sin verificación funcional. |

---

## D4. Herramientas de testing: Jest + React Testing Library

| Campo | Detalle |
|-------|--------|
| **Decisión** | Jest con `jest-environment-jsdom`, `@testing-library/react` y `@testing-library/jest-dom`; configuración vía `next/jest` y `jest.setup.js`. |
| **Por qué** | Next.js documenta y soporta Jest con `next/jest`; RTL encaja con componentes React y accesibilidad; un test de humo en la home cumple "tests básicos" y da confianza al CI. |
| **Alternativas** | (1) Vitest: más rápido y ESM-friendly, pero el plan no lo exige y la integración con Next.js es más manual. (2) Solo E2E (Playwright/Cypress): mejor para fases posteriores; para Fase 1 los tests unitarios/smoke son suficientes y más rápidos en CI. |
| **Impacto** | `jest.config.mjs`, `jest.setup.js`, script `test` en `package.json`; tests en `app/page.test.jsx` y `lib/data/campaigns.test.js`. |
| **Aprendido** | `next/jest` resuelve alias `@/` y transpila JSX; la config del runner sigue en `jest.config.mjs` (sin TypeScript en el proyecto). |

---

## D5. Preview por PR con Vercel (solo documentación en repo)

| Campo | Detalle |
|-------|--------|
| **Decisión** | No añadir `vercel.json` ni scripts específicos; documentar en README que hay que conectar el repo a Vercel para obtener preview por PR. |
| **Por qué** | Vercel detecta Next.js y genera previews por PR al conectar el repo; no hace falta configuración en el código para ese comportamiento. Documentar en README cumple "configurar preview por PR" a nivel de instrucciones y evita archivos innecesarios. |
| **Alternativas** | (1) Añadir `vercel.json` con `buildCommand`/`outputDirectory`: redundante con detección automática. (2) GitHub Pages u otro host: el plan recomienda Vercel y es el estándar del curso. (3) Deploy manual por PR: no escalable. |
| **Impacto** | Usuario debe vincular el repo en vercel.com; cada PR obtendrá una URL de preview sin cambios en el código. README explica el paso. |
| **Aprendido** | Para stacks estándar (Next.js + Vercel), la "configuración" de preview puede ser solo documentación; el valor está en que el equipo sepa cómo activarlo. |

---

## D6. README mínimo y un PR por cambio significativo

| Campo | Detalle |
|-------|--------|
| **Decisión** | README con: qué es el proyecto, cómo clonar/instalar/ejecutar, comandos (dev, build, start, lint, test), cómo obtener preview por PR y referencia al plan y a `decision.md`. Sin secciones extensas de API o diseño en Fase 1. |
| **Por qué** | El plan pide "README mínimo: qué es el proyecto, cómo clonar, instalar y ejecutar"; añadir lint/test y preview cubre criterios de documentación inicial y despliegue. Referenciar `decision.md` deja trazabilidad de decisiones. |
| **Alternativas** | (1) README muy largo con toda la rúbrica: desaconsejado para "mínimo". (2) Sin mención a preview: no cumpliría la parte de "configurar preview por PR" a nivel documental. |
| **Impacto** | Cualquier persona que clone el repo puede levantar el proyecto y entender el flujo de trabajo; los criterios transversales de Documentación (inicial) y Despliegue (base) quedan cubiertos. |
| **Aprendido** | "Un PR por cada cambio significativo" es convención de proceso; no se implementa en código pero se deja explícito en el plan y en este documento para futuras fases. |

---

## D7. Reemplazo del `index.html` estático por la app Next.js

| Campo | Detalle |
|-------|--------|
| **Decisión** | La entrada de la aplicación pasa a ser la raíz servida por Next.js (`app/page.jsx`); el `index.html` previo ("Hola Mundo") deja de ser la página principal y puede eliminarse o conservarse como referencia. |
| **Por qué** | Con Next.js en la raíz, la ruta `/` la sirve el App Router; un `index.html` en la raíz no es usado por `next dev` ni por el build. Mantenerlo genera confusión sobre qué es la "home". |
| **Alternativas** | (1) Conservar `index.html` en raíz: Next ignora ese archivo en dev/build; podría usarse para redirección estática pero no es necesario. (2) Mover a `public/`: se serviría en `/index.html`, no en `/`. |
| **Impacto** | La única página de entrada es la generada por `app/page.jsx`; el contenido "Hola Mundo" se sustituye por el contenido de la Fase 1 (título PW E-commerce y mensaje de Fase 1). |
| **Aprendido** | En un proyecto Next.js, la raíz de contenido es `app/`; los estáticos van en `public/`. Eliminar o archivar el HTML inicial evita dudas en las siguientes fases. |

---

## Resumen de impacto Fase 1

- **Estructura:** Next.js 14 (App Router) + JavaScript en raíz; `app/`, `jsconfig.json`, `.gitignore` adecuado.
- **CI/CD:** Un workflow de GitHub Actions (lint → build → test) en cada push/PR.
- **Preview:** Documentado uso de Vercel; preview por PR al conectar el repo.
- **Documentación:** README mínimo + `decision.md` para trazabilidad de decisiones.

Las decisiones se irán ampliando en fases posteriores (por ejemplo, convenciones de carpetas en Fase 4, modelo de datos en Fase 5, flujo de pago en Fase 6). Este archivo se puede extender con nuevas secciones D8, D9, … por fase.

---

## Fase 2 — E2 (Landing + vistas clave)

### D8. Dirección visual “editorial cálida” (Fraunces + Source Sans 3)

| Campo | Detalle |
|-------|--------|
| **Decisión** | Tipografías vía `next/font/google`: **Fraunces** (display) y **Source Sans 3** (cuerpo); paleta crema / tinta / terracota con variables CSS. |
| **Por qué** | Cumple la skill frontend-design: evitar Inter y gradientes violeta genéricos; tono acorde a crowdfunding comunitario y legibilidad para rúbrica de interfaz. |
| **Alternativas** | Solo sistema UI; o una sola fuente: más rápido pero menos distintivo. |
| **Impacto** | Variables `--font-display` / `--font-sans` en `html`; `globals.css` centraliza tema. |
| **Aprendido** | No redefinir `--font-display` en `:root` (riesgo de referencia circular); usar `var(--font-sans), system-ui, …` como respaldo. |

### D9. Datos mock en `lib/data/campaigns.js`

| Campo | Detalle |
|-------|--------|
| **Decisión** | Tres campañas con `slug`, metas, aportes y funciones puras `getContributorDisplayName` / `getContributionAmountDisplay` para la vista pública. |
| **Por qué** | E2 no exige API; permite probar privacidad (nombre/iniciales/anónimo; monto oculto) antes de Supabase. |
| **Alternativas** | JSON estático importado sin helpers: menos testeable. |
| **Impacto** | Tests unitarios en `campaigns.test.js`; migración futura sustituye el array por fetch. |

### D10. Layout único con `main` y skip link

| Campo | Detalle |
|-------|--------|
| **Decisión** | `SiteHeader` + `main#contenido-principal` + `SiteFooter` en `app/layout.jsx`; enlace “Saltar al contenido” visible al foco. |
| **Por qué** | WCAG: punto de salto; un solo `main` por documento; foco visible en `:focus-visible`. |
| **Alternativas** | `main` en cada página: duplicaría landmark. |
| **Impacto** | Las páginas solo usan `section` / `article` dentro del `main` global. |

### D11. Imágenes SVG en `public/campaigns/`

| Campo | Detalle |
|-------|--------|
| **Decisión** | Placeholders vectoriales locales servidos con `next/image` (build OK en Next 14). |
| **Por qué** | Sin dependencia de CDN ni `remotePatterns`; demo reproducible en CI. |
| **Alternativas** | Fotos reales de promotores: mejor para demo final; en E2 el plan permite maquetado con contenido mock. |
| **Impacto** | Sustituir rutas por assets reales cuando existan las 2–3 campañas acordadas. |

### D12. Orquestación agent-teams-lite (artefactos en `docs/agent-orchestration/fase-2/`)

| Campo | Detalle |
|-------|--------|
| **Decisión** | Secuencia explorer → proposal → spec → design → tasks → implementación → verificación → archivo, documentada en Markdown. |
| **Por qué** | El usuario pidió flujo tipo orquestador con sub-agentes; deja trazabilidad sin mezclar spec con código. |
| **Alternativas** | Implementar directo: más rápido pero peor para defensa y revisiones. |
| **Impacto** | `06-verification.md` y `07-archive.md` cierran el cambio E2. |

---

## Migración a JavaScript (consigna curso)

### D13. Eliminación de TypeScript del repositorio

| Campo | Detalle |
|-------|--------|
| **Decisión** | Todo el código fuente pasó a `.js` / `.jsx`; se eliminaron `typescript`, paquetes `@types/*`, `tsconfig.json` y `next-env.d.ts`. Se añadió `jsconfig.json` con paths `@/*`. |
| **Por qué** | La consigna obliga a programar en JavaScript, no TypeScript. |
| **Alternativas** | Mantener TS: incumple la consigna. Usar `.js` sin JSX: posible pero verboso con React. |
| **Impacto** | `npm run build` ya no ejecuta el checker de tipos de TypeScript; hay que confiar en ESLint, tests y revisiones. |
| **Aprendido** | Los metadatos de Next (`export const metadata`) y los Server Components siguen igual en `.jsx`; solo se quitan anotaciones de tipo e imports `import type`. |

---

## Fase 3 — E3 (formularios dinámicos, primera parte)

### D14. Formulario de aporte con DOM vivo y reglas de privacidad compartidas

| Campo | Detalle |
|-------|--------|
| **Decisión** | Componente cliente `components/campaign/ContributionForm.jsx` en la página `app/campanas/[slug]/page.jsx`, con resumen en vivo (`aria-live`), vista previa de fila pública, validación (monto mínimo $100 ARS, nombre obligatorio si “Mostrar mi nombre públicamente”), y envío simulado con mensaje de estado. |
| **Por qué** | Cumple el plan E3: el DOM cambia con la interacción (no solo HTML estático). La vista previa reutiliza `getContributorDisplayName` y `getContributionAmountDisplay` para alinearse con `ContributionsList`. |
| **Alternativas** | Solo HTML5 sin feedback dinámico: no alcanza “Excelente” en E3. Duplicar reglas de privacidad en el componente: riesgo de divergencia con la lista. |
| **Impacto** | Nueva función `deriveInitialsFallback` en `lib/data/campaigns.js` (iniciales para nombre oculto); estilos en `app/globals.css` bajo `.contribution-form`. |
| **Aprendido** | El botón indica “simulación” hasta conectar pago/API en fases posteriores; el contrato de UX queda listo. |

### D15. Validación tipo “smart-testing” (comportamiento + CI)

| Campo | Detalle |
|-------|--------|
| **Decisión** | Tests con React Testing Library centrados en **comportamiento observable** (etiquetas, roles, texto en vista previa), no en detalles de implementación interna del componente. Archivo `components/campaign/ContributionForm.test.jsx` cubre: título y campaña, actualización de preview con monto/nombre, cambio a iniciales al desmarcar nombre público, y mensaje de error al enviar con monto inválido. |
| **Por qué** | La skill referenciada como `smart-testing` en `~/.agents/skills/agents.md` prioriza pruebas por comportamiento real y evita sobre-mocking; en este entorno el archivo `smart-testing/SKILL.md` no estaba presente, así que se aplicó ese criterio explícitamente. |
| **Alternativas** | Solo tests de funciones en `campaigns.test.js`: no protegen la integración UI. E2E (Playwright): útil más adelante; para E3 la pirámide sugiere unit + smoke de componente en CI. |
| **Impacto** | Suite Jest: `lib/data/campaigns.test.js`, `app/page.test.jsx`, `components/campaign/ContributionForm.test.jsx` (13 tests en total al documentar). |
| **Aprendido** | Verificación completa alineada al workflow de Fase 1: `npm run test` → `npm run lint` → `npm run build` (todos OK tras estos cambios). |

### Verificación registrada (pipeline local)

| Comando | Resultado |
|---------|-----------|
| `npm run test` | OK (13 tests) |
| `npm run lint` | Sin advertencias ni errores |
| `npm run build` | Compilación y páginas estáticas OK |
