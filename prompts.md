# Registro de prompts — PW Crowdfunding (Impulsa.barrio)

Bitácora de lo pedido al asistente (Cursor / IA) y **prompts reconstruidos** cuando no hay texto literal guardado. Sirve para reutilizar plantillas y para la defensa del proyecto.

---

## Leyenda de importancia

| Etiqueta | Cuándo usarla |
|----------|----------------|
| **`[IMPORTANTE]`** | Cambia arquitectura, docs canónicos (`README`, `decision.md`, plan), entregables de rúbrica, o es una **plantilla** que vas a repetir. |
| **`[RUTINA]`** | Consulta puntual, explicación one-off, o tarea que ya quedó totalmente reflejada en código sin valor como prompt reutilizable. |

Los prompts marcados como **inferidos** no son citas textuales: se dedujeron del código y de [decision.md](decision.md).

---

## Mapa agent-teams-lite (`docs/agent-orchestration/`)

Orden del pipeline (delegate-only, contexto mínimo): ver [docs/agent-orchestration/fase-2/00-orchestrator-flow.md](docs/agent-orchestration/fase-2/00-orchestrator-flow.md).

| Carpeta | Artefactos | Entregable / notas |
|---------|------------|-------------------|
| [fase-2/](docs/agent-orchestration/fase-2/) | `00` … `07` | **E2** cerrado: explorer → proposal → spec → design → tasks → verificación → archivo. |
| [fase-3-e3/](docs/agent-orchestration/fase-3-e3/) | solo `06`, `07` | **E3** cierre de trámite; intención y criterios técnicos en [decision.md](decision.md) (D14–D16) y prompts inferidos abajo. Los pasos `01`–`05` no se versionaron en `docs/` para E3. |

**Qué aporta cada tipo de archivo (para reutilizar como contexto en Cursor):**

| Archivo | Rol breve |
|---------|-----------|
| `00-orchestrator-flow` | Índice del flujo y enlaces entre fases del pipeline. |
| `01-explorer-analysis` | Stack detectado, brechas vs plan, riesgos (snapshot de contexto al abrir el cambio). |
| `02-proposal` | Intento, alcance incluido/excluido, enfoque técnico, estado de aprobación. |
| `03-spec` | Requisitos funcionales/no funcionales + criterios de aceptación tabulados. |
| `04-design` | Dirección visual, tokens, layout, componentes, notas de privacidad en UI. |
| `05-tasks` | Checklist implementable con dependencias. |
| `06-verification` | Matriz spec → evidencia en código + comandos (`test` / `lint` / `build`). |
| `07-archive` | Cierre: entregables, fuera de alcance, puente a la siguiente fase. |

**Nota histórica:** los Markdown de **fase-2** citan rutas `.tsx` y `lib/data/campaigns.ts` tal como estaban al redactarse (2026-03-16). El repo migró después a **solo JavaScript** ([decision.md](decision.md) D13): la evidencia actual es `.jsx` / `.js` y `lib/data/campaigns.js`.

---

## Conversación registrada (abril 2026)

### `[RUTINA]` — Fase actual según el plan

**Prompt (texto aproximado):**

> ¿Por qué fase del plan `plan_pw_e-commerce_2026_c681da85.plan.md` voy construyendo?

**Resultado:** Respuesta alineada al repo real (E3–E4 en curso; E5–E6 pendientes), corrigiendo el bloque desactualizado del plan.

---

### `[IMPORTANTE]` — Sincronizar documentación de estado

**Prompt (texto literal de la sesión):**

> actualiza el bloque “Estado actual” del plan, tambien el readme y el decisions.md

**Resultado:** Plan, `README.md` y `decision.md` actualizados con el estado del proyecto; D7 ajustado (eliminación de `index.html`).

---

### `[IMPORTANTE]` — Criterios para guardar prompts

**Prompt (texto aproximado):**

> Necesito crear un documento donde se guarden todos los prompts. ¿Cómo puedo diferenciar qué es un prompt importante del que no?

**Resultado:** Criterios (repetición, decisión, costo de rehacer, patrón, entregable); sugerencia de secciones Biblioteca vs bitácora.

---

### `[IMPORTANTE]` — Crear este archivo

**Prompt (texto literal de la sesión):**

> crea el prompts.md . documenta todos los prompts que ya hice (y los que puedo haber usado para crear lo que tengo creado hasta ahora, si es que no los tenes guardados) .... quiero etiquetar distintos los prompts importantes de los que no lo son

**Resultado:** Este `prompts.md` + referencia en README.

---

### `[RUTINA]` — Siguiente paso del plan (agent-teams-lite + voz Gentleman)

**Prompt (texto aproximado):**

> usando agent-teams-lite analiza cual seria el siguiente paso , de la fase 3 o la fase 4. explicamela usando la voz de gentleman

**Resultado:** Lectura de [decision.md](decision.md): E3 hecho en esencia; E4 en curso. Doble lectura del “siguiente paso”: (1) proceso — verificar/archivar E3 o abrir explore/propose de E4; (2) producto — catálogo + API pública coherente.

---

### `[IMPORTANTE]` — Cerrar trámite E3 (verificación + archivo)

**Prompt (texto literal de la sesión):**

> cerrar trámite E3

**Resultado:** [docs/agent-orchestration/fase-3-e3/06-verification.md](docs/agent-orchestration/fase-3-e3/06-verification.md), [07-archive.md](docs/agent-orchestration/fase-3-e3/07-archive.md); [decision.md](decision.md) tabla E3 + **D16**. Evidencia: `npm run test` y `npm run lint` OK en sesión; `npm run build` falló por entorno local (`EISDIR` en `node_modules/next`) — revalidar con `npm ci` en máquina del equipo.

---

### `[IMPORTANTE]` — Enriquecer `prompts.md` desde la orquestación

**Prompt (texto literal de la sesión):**

> lee todos estos archivos para completar mejor el prompts.md

**Resultado:** Incorporado mapa de `docs/agent-orchestration/`, tabla de roles 00–07, nota TS→JS, y entradas de bitácora que faltaban (análisis Gentleman, cierre E3, esta tarea).

---

### `[IMPORTANTE]` — Corrección de imágenes rotas + optimización LCP en home

**Prompt (texto literal de la sesión):**

> las iamgenes no se estan cargando/renderizando. ademas la pagina tarda bastante tiempo en cargar. crea un plan para crregir estas dos cosas. ¿es posible cachear algo para que tarde menos en cargar? lee engra, usa agent team slite y el flujo sdd para analizar el repo y entender las posibles causas del error, y en base a eso armar el plan
>
> @imágenes_y_rendimiento_88edcc8d.plan.md (30-31) ejecuta esto. usa el flujo sdd-flow
>
> documentala en el decisions.md y en el prompts.md

**Resultado:** Se aplicó estrategia mínima para rendimiento y estabilidad de imágenes: `priority` solo en la primera card de home (`app/page.jsx` + `CampaignCard.jsx`), `priority` mantenido en detalle, `unoptimized` para SVG locales en `next/image`, saneo de SVG en `public/campaigns/` y ajuste de caché en `next.config.mjs`. Queda trazado en [decision.md](decision.md) como **D17**.

---

### `[IMPORTANTE]` — Inferido desde Engram — Iteración landing (hero, CTA dual, cards)

**Origen:** observación persistente Engram `#107` (proyecto `pw-ecommerce`, 2026-04-20). No se guardó el prompt literal en repo.

**Prompt reconstruido (para reutilizar):**

> Mejorar la **landing** (`/`): hero menos genérico, **CTA dual** (donantes vs creadores), cards con **progreso visual** (mini barra accesible), estética **editorial cálida** sin cambiar stack (Next.js 14, CSS plano, **sin** Tailwind). Animaciones que respeten `prefers-reduced-motion`. Stats del hero pueden ser mock decorativo documentado.

**Resultado (según memoria):** `app/page.jsx` (hero, `cta-split`), `app/globals.css` (float, hovers, `cta-split`), `CampaignCard.jsx` (`aria-valuenow` / min / max en mini progress). Botón “Próximamente” con `disabled` + `aria-disabled="true"`.

---

### `[IMPORTANTE]` — Inferido desde Engram — Smart-testing E3 + skill en repo

**Origen:** Engram `#32` (2026-03-30).

**Prompt reconstruido:**

> Aplicar la skill **smart-testing** al formulario de aporte: tests RTL por **comportamiento**, mock de `fetch` solo en el borde, documentar en **decision.md** (D14–D15). Si el registro global apunta a `~/.agents/skills/smart-testing/` y **no existe**, versionar la skill **en el repo** (`.cursor/skills/smart-testing/`) para que el equipo y CI lean el mismo criterio.

**Resultado:** `ContributionForm.test.jsx` + decisión D15; pipeline test/lint/build verificado en esa sesión.

---

## Prompts inferidos (trabajo previo documentado en `decision.md`)

No se conservó el texto original en esta máquina; la intención se reconstruye a partir de [decision.md](decision.md) y del código.

### Fase 1 — E1 (infraestructura)

**`[IMPORTANTE]` — Inferido — Bootstrap Next.js + CI + tests**

> Poner el proyecto en **Next.js en la raíz** con **App Router**, **solo JavaScript** (sin TypeScript). Configurar **GitHub Actions** con `npm ci`, lint, build y tests. Usar **Jest + React Testing Library** (`next/jest`). README con clone/install/run y **preview por PR vía Vercel** documentado (sin `vercel.json` obligatorio). Sustituir el `index.html` inicial por la app Next.

**Evidencia:** D1–D7, `.github/workflows/ci.yml`, `jest.config.mjs`.

---

### Fase 2 — E2 (landing y campañas)

**`[IMPORTANTE]` — Inferido — UI y vistas de crowdfunding**

> Landing y vistas **semánticas y responsivas**: `/`, listado de campañas, detalle con progreso y lista de aportes respetando **privacidad** (nombre público / iniciales / anónimo; monto visible u oculto). Tema **editorial cálido**: Fraunces + Source Sans 3, variables en `globals.css`. Datos **mock** en `lib/data/campaigns.js` con helpers puros para la vista pública. Layout con **skip link**, un solo `main`, imágenes locales en `public/campaigns/`.

**Evidencia:** D8–D11, `app/page.jsx`, `app/campanas/`, componentes de campaña.

**Spec y verificación versionadas:** [03-spec.md](docs/agent-orchestration/fase-2/03-spec.md), [06-verification.md](docs/agent-orchestration/fase-2/06-verification.md) (rutas en esos archivos pueden decir `.tsx`/`.ts`; el código vigente es `.jsx`/`.js`).

---

**`[IMPORTANTE]` — Inferido — Orquestación tipo agent-teams-lite**

> Seguir flujo **explorer → proposal → spec → design → tasks → implementar → verificar → archivar**, con artefactos numerados en `docs/agent-orchestration/` (ver [00-orchestrator-flow.md](docs/agent-orchestration/fase-2/00-orchestrator-flow.md)).

**Evidencia:** D12; carpeta [docs/agent-orchestration/fase-2/](docs/agent-orchestration/fase-2/) (`01`–`07` para E2).

---

### Migración de stack

**`[IMPORTANTE]` — Inferido — Quitar TypeScript**

> Migrar el repositorio a **solo JavaScript** (`.js`/`.jsx`), `jsconfig.json` con `@/*`, eliminar `tsconfig` y dependencias de tipos, cumpliendo consigna del curso.

**Evidencia:** D13.

---

### Fase 3 — E3 (formulario y API)

**`[IMPORTANTE]` — Inferido — Aporte con fetch y validación compartida**

> Formulario de aporte en detalle de campaña: **DOM dinámico**, validación **cliente y servidor** compartida (`lib/contribution/validate.js`), **POST** a `/api/campanas/[slug]/aporte`, respuesta con **vista previa pública** derivada, sin persistencia todavía. Accesibilidad (`aria-live`, región de vista previa). Tests siguiendo **smart-testing**: RTL + user-event, mock de `fetch` en el borde, tests de reglas en `validate.test.js`.

**Matices desde Engram (#31, #33):** la vista previa y mensajes deben reutilizar **`getContributorDisplayName` / `getContributionAmountDisplay`** (y reglas de iniciales vía `deriveInitialsFallback` en `campaigns.js`) para **misma semántica** que `ContributionsList`. Documentar el flujo en **README** (sección flujo de aporte).

**Evidencia:** D14–D15, D16, `ContributionForm.jsx`, `app/api/campanas/[slug]/aporte/route.js`, `lib/contribution/validate.js`, tests.

**Cierre documental E3:** criterios V1–V7 y comandos en [fase-3-e3/06-verification.md](docs/agent-orchestration/fase-3-e3/06-verification.md); inventario y fuera de alcance en [07-archive.md](docs/agent-orchestration/fase-3-e3/07-archive.md).

---

## Cómo seguir usando este archivo

1. Cada vez que un prompt te parezca **reutilizable**, añadí una entrada con fecha, etiqueta `[IMPORTANTE]` o `[RUTINA]`, y una línea de **resultado** o enlace a PR/commit.
2. Si el prompt es largo, guardá un **resumen** y pegá el texto completo en un gist o en el cuerpo del PR.
3. Mantener **decision.md** para el “por qué” técnico; **prompts.md** para el “qué pediste” al asistente.
4. Para una **nueva fase** (p. ej. E4), podés replicar la carpeta `docs/agent-orchestration/fase-N-…/` con el mismo esquema `00`–`07` y enlazarla desde aquí cuando cierre el trámite.
