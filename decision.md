# Decisiones técnicas — PW Crowdfunding (plan agent-teams-lite)

Registro de decisiones por fase (E1 en adelante): justificación, alternativas consideradas, impacto y aprendizaje.

## Estado actual del proyecto (abril 2026)

| Fase | Entregable (plan) | Estado en el repo |
|------|-------------------|-------------------|
| E1 | Repo + CI/CD + preview | Hecho: Next.js en raíz, workflow `.github/workflows/ci.yml`, README y documentación de Vercel. |
| E2 | Landing + vistas responsivas | Hecho: rutas `/`, `/campanas`, `/campanas/[slug]`, layout accesible, tema editorial, mock en `lib/data/campaigns.js`. |
| E3 | Formularios dinámicos + fetch + validación servidor | **Cerrado (trámite):** mismo alcance que antes; verificación y archivo en [docs/agent-orchestration/fase-3-e3/](docs/agent-orchestration/fase-3-e3/); D14–D15 y D16. |
| E4 | Catálogo + API pública coherente | En curso: catálogo y API de aporte a nivel validación/contrato; persistencia y listados 100 % vía API aún no. |
| E5 | Supabase + admin | Pendiente. |
| E6 | Pago + webhook + demo | Pendiente. |

El bloque **“Estado actual”** del plan en `.cursor/plans/plan_pw_e-commerce_2026_c681da85.plan.md` se mantiene alineado con esta tabla.

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
| **Decisión** | La entrada de la aplicación pasa a ser la raíz servida por Next.js (`app/page.jsx`); el `index.html` previo ("Hola Mundo") deja de ser la página principal y se **eliminó del repo** para evitar ambigüedad. |
| **Por qué** | Con Next.js en la raíz, la ruta `/` la sirve el App Router; un `index.html` en la raíz no es usado por `next dev` ni por el build. Mantenerlo genera confusión sobre qué es la "home". |
| **Alternativas** | (1) Conservar `index.html` en raíz: Next ignora ese archivo en dev/build; podría usarse para redirección estática pero no es necesario. (2) Mover a `public/`: se serviría en `/index.html`, no en `/`. |
| **Impacto** | La única página de entrada es la generada por `app/page.jsx`; el `index.html` inicial dejó de usarse y **fue eliminado del repositorio** una vez estabilizada la app Next.js. |
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

## Fase 3 — E3 (formularios dinámicos + API de validación)

### D14. Formulario de aporte, validación compartida y POST a API (antes de Mercado Pago)

| Campo | Detalle |
|-------|--------|
| **Decisión** | `ContributionForm` (cliente) en `app/campanas/[slug]/page.jsx` recibe `campaignSlug` y envía **POST** a `/api/campanas/[slug]/aporte` con JSON `{ amount, displayName, showPublicName, showAmount }`. La validación duplicada se evita con `lib/contribution/validate.js` (`validateContributionBody`, `buildPublicPreviewRow`), usada en el cliente y en `app/api/campanas/[slug]/aporte/route.js`. Resumen en vivo (`aria-live`), vista previa de fila pública, estados de envío y error de red/servidor. |
| **Por qué** | El plan E3 pide DOM dinámico, validación HTML5 + JS, **fetch** y **validación en servidor** cuando exista backend. Así el contrato del aporte queda cerrado antes de MP/Supabase; la API hoy solo valida y devuelve `publicPreview` derivado (sin persistencia). |
| **Alternativas** | Solo mensaje local sin `fetch`: no cumple el ítem de fetch del plan. Validar solo en cliente: mismo mensaje para el usuario pero peor defensa en profundidad. |
| **Impacto** | README sección “Flujo de aporte”; región accesible `role="region"` + `aria-labelledby` en la vista previa para tests y lectores de pantalla. |
| **Aprendido** | Mantener mensajes de error idénticos en cliente y API reduce sorpresas cuando el front y el back divergen en versiones. |

### D15. Smart-testing (skill en repo + pirámide de pruebas)

| Campo | Detalle |
|-------|--------|
| **Decisión** | Documentar y aplicar la skill **`.cursor/skills/smart-testing/SKILL.md`**: prioridad negocio puro → UI crítica → mock solo en el **borde** (p. ej. `fetch`). En tests de formulario: `@testing-library/user-event` para interacciones realistas; consultas por **rol** y **región** con nombre accesible (`getByRole("region", { name: /Vista previa/ })`), sin acoplar a clases BEM. Tests de `validateContributionBody` en `lib/contribution/validate.test.js` describen reglas de negocio y copy visible. |
| **Por qué** | El registro global (`~/.agents/skills/agents.md`) apunta a `smart-testing` en rutas que en esta máquina no existían; versionar la skill en el proyecto asegura que Cursor y el equipo lean el mismo criterio. |
| **Alternativas** | Solo `fireEvent` y selectores por clase: más frágil y menos fiel al uso real. Mockear internals de React además de `fetch`: sobre-mocking (evitar). |
| **Impacto** | Suite Jest: `lib/data/campaigns.test.js`, `lib/contribution/validate.test.js`, `app/page.test.jsx`, `components/campaign/ContributionForm.test.jsx`. |
| **Aprendido** | Un `section` con nombre accesible sirve doble filo: mejor semántica y anclaje estable para RTL sin `data-testid`. |

### Verificación registrada (pipeline local, 2026-03-30)

| Comando | Resultado |
|---------|-----------|
| `npm run test` | OK (20 tests) |
| `npm run lint` | Sin advertencias ni errores |
| `npm run build` | OK; ruta dinámica `ƒ /api/campanas/[slug]/aporte` incluida |

---

### D16. Cierre de trámite E3 (agent-teams-lite)

| Campo | Detalle |
|-------|--------|
| **Decisión** | Registrar **verificación** y **archivo** del entregable E3 en el repo: `docs/agent-orchestration/fase-3-e3/06-verification.md` y `07-archive.md`. |
| **Por qué** | D12 exige trazabilidad del ciclo (incl. verificación y cierre); antes no existía carpeta `docs/agent-orchestration/` en el árbol. Cierra el “trámite” sin cambiar el alcance técnico de E3. |
| **Alternativas** | Solo memoria oral o Engram: peor para defensa académica y para quien clone el repo. |
| **Impacto** | Estado E3 explícito en la tabla superior; criterios V1–V7 y comandos documentados en `06-verification.md`. |
| **Aprendido** | Si `npm run build` falla con `EISDIR` bajo `node_modules/next`, conviene `rm -rf node_modules` + `npm ci` (o equivalente en Windows) antes de repetir la verificación. |

---

## Ajustes de imágenes y rendimiento (abril 2026)

### D17. LCP en home: `priority` solo para una card + SVG sin optimización

| Campo | Detalle |
|-------|--------|
| **Decisión** | En home (`app/page.jsx`) pasar `priority` solo a la **primera** `CampaignCard` (`index === 0`), dejando el resto en lazy-load. En `CampaignCard.jsx` se agrega prop `priority` (default `false`) y `unoptimized` condicional para `.svg` de `public/`. En detalle (`app/campanas/[slug]/page.jsx`) se mantiene `priority` de la imagen principal. |
| **Por qué** | Tener múltiples imágenes con `priority` en el primer viewport aumenta competencia por red y empeora el LCP percibido. Además, para SVG locales conviene servir el asset estático sin pipeline de optimización para evitar fallos por XML estricto y simplificar carga. |
| **Alternativas** | (1) Mantener `priority` en todas las destacadas: más agresivo y peor concurrencia de carga. (2) Migrar todos los SVG a WebP/PNG: válido, pero implica regenerar assets y no era necesario para resolver el bug inmediato. |
| **Impacto** | Menos presión en el render inicial de `/`; mejora esperada de tiempo de carga percibido en home. Rutas tocadas: `app/page.jsx`, `components/campaign/CampaignCard.jsx`, `app/campanas/[slug]/page.jsx`, `public/campaigns/*.svg`, `next.config.mjs` (`images.minimumCacheTTL`). |
| **Aprendido** | `priority` debe reservarse para elementos candidatos reales a LCP; no para todas las imágenes destacadas. Para SVG en `public/`, `next/image` con `unoptimized` es una solución pragmática cuando hay sensibilidad a parseo/optimización. |

## Fase 4 — E4 (Landing visual upgrade)

### D16. Mejora visual de landing: stats decorativos en hero + CTA dual

| Campo | Detalle |
|-------|--------|
| **Decisión** | Reemplazar el hero__visual vacío (solo blob) por tres stat-cards decorativas hardcodeadas ("3 proyectos", "$45.000 ARS", "12 vecinos"). Reemplazar el `cta-band` de un solo botón por una sección `cta-split` con dos caminos: donante (→ `/campanas`) y creador ("Próximamente", disabled). Agregar barra de progreso mínima en `CampaignCard` usando el `pct` ya calculado pero no mostrado. |
| **Por qué** | La landing se veía como trabajo práctico; los datos mock permiten simular stats de impacto sin backend. El CTA dual diferencia los dos tipos de usuario del crowdfunding y da profundidad visual. |
| **Alternativas** | (1) Solo mejorar estilos sin secciones nuevas: menos impacto visual. (2) Agregar sección "Cómo funciona": decidido no incluir por ahora para no agregar scope. (3) Tailwind CSS: descartado; el proyecto ya tiene un sistema CSS con variables bien establecido. |
| **Impacto** | `app/page.jsx` (hero stats + cta-split), `app/globals.css` (keyframes float, hover enriquecido, estilos cta-split y campaign-card__progress), `components/campaign/CampaignCard.jsx` (mini progress bar con aria-valuenow). |
| **Aprendido** | Los stats del hero son decorativos/mock — cuando exista Supabase hay que calcularlos dinámicamente. El `cta-band` se mantiene en CSS para no romper otras páginas; `cta-split` es clase nueva. La animación float respeta `prefers-reduced-motion`. |

### D17. Flujo de trabajo con SDD (Spec-Driven Development) via grill-me + plan

| Campo | Detalle |
|-------|--------|
| **Decisión** | Adoptar el flujo **SDD** con la skill `grill-me` antes de implementar cambios de producto. El proceso es: (1) explorar el codebase automáticamente, (2) hacer 4 preguntas una a la vez para refinar decisiones (stack, estética, alcance, CTA, CSS), (3) generar un plan en `~/.claude/plans/`, (4) esperar aprobación explícita antes de tocar código. |
| **Por qué** | Evita implementar suposiciones. El grill-me forzó a aclarar que el proyecto ya estaba en Next.js 14 (no era una migración real), que no se quería TypeScript, y que el CTA debía tener dos caminos. Sin ese proceso, el plan hubiera partido de premisas incorrectas. |
| **Alternativas** | Implementar directo sin planning: más rápido pero con mayor riesgo de rehacer trabajo por malentendidos. SDD completo (explore → propose → spec → design → tasks): más peso para cambios de landing; grill-me es el punto medio apropiado. |
| **Impacto** | Cada cambio significativo de producto parte de 4 preguntas contextuales + un plan aprobado. El plan se guarda localmente y se persiste en engram para recuperación entre sesiones. |
| **Aprendido** | El primer grill-me reveló que el usuario pedía "migrar a Next.js" pero ya estaba en Next.js — la exploración automática del codebase antes de la primera pregunta es crítica para no hacer preguntas irrelevantes. |

### D18. Fix renderizado de imágenes en CampaignCard: prop `fill` en next/image

| Campo | Detalle |
|-------|--------|
| **Decisión** | Reemplazar `width={800} height={500}` por el prop `fill` en el componente `<Image>` dentro de `CampaignCard`. Actualizar CSS de `.campaign-card__image` para eliminar `width: 100%; height: auto;` y dejar solo `object-fit: cover; object-position: center`. Corregir `alt=""` por `alt={campaign.imageAlt}`. |
| **Por qué** | Con dimensiones explícitas, `next/image` renderiza la imagen a su ratio intrínseco y el CSS `object-fit: cover` no tiene efecto (no hay altura restringida por el contenedor). El prop `fill` genera `position: absolute; inset: 0` y hace que la imagen llene el contenedor `position: relative; aspect-ratio: 8/5` de `.campaign-card__image-link`. |
| **Alternativas** | (1) Mantener `width/height` y forzar altura en CSS: frágil, rompe en diferentes viewports. (2) Usar `<img>` plano: pierde optimización de Next.js (lazy load, WebP, srcset). |
| **Impacto** | `components/campaign/CampaignCard.jsx` (prop `fill`, fix `alt`), `app/globals.css` (simplificación de `.campaign-card__image`). |
| **Aprendido** | Con `next/image` y `fill`: el contenedor padre DEBE tener `position: relative` y dimensiones definidas (altura explícita o `aspect-ratio`). Sin eso, la imagen queda colapsada a 0px. El `aspect-ratio: 8/5` en `.campaign-card__image-link` ya lo satisfacía. |
