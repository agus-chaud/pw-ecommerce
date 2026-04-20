# Prompts y flujos de trabajo con IA — pw-ecommerce

Registro de cómo se usó el flujo **SDD (Spec-Driven Development)** y las skills de agente a lo largo del proyecto. Sirve como referencia para reproducir el proceso en fases futuras.

---

## Flujo SDD aplicado

El flujo estándar usado en este proyecto es:

```
grill-me (4 preguntas) → plan aprobado → implement → decisions.md
```

Para bugs o fixes puntuales:

```
explore (agent) → diagnóstico → implement → decisions.md
```

---

## Sesión E4 — Landing visual upgrade (2026-04-20)

### Prompt inicial
> "quiero armar un plan para migrar este proyecto a la tecnología Next.js... usa la skill grill-me para hacerme 4 preguntas y mejorar el plan"

### Proceso SDD aplicado

**Fase 1 — Explore automático:**
El agente exploró el codebase antes de la primera pregunta y detectó que el proyecto **ya estaba en Next.js 14**. Esto redirigió el plan de "migración" a "mejora visual de la landing existente".

**Fase 2 — grill-me (4 preguntas):**

| # | Pregunta | Respuesta | Impacto en plan |
|---|----------|-----------|-----------------|
| 1 | ¿Qué entendés por "migrar a Next.js"? (ya está en 14) | Upgrade a Next.js 15 → luego cambió a mejorar landing | Descartó migración real |
| 2 | ¿Qué significa "linda"? (A minimalista / B cálida / C startup) | B — cálida y comunitaria | Paleta tierra existente, sin Tailwind |
| 3 | ¿Qué secciones? (A solo visual / B nuevas secciones / C full) | Mejorar lo existente + CTA final | Scope acotado |
| 4 | ¿Qué acción para el CTA final? (A ver campañas / B crear / C dual) | C — dual: donante + creador | Sección `cta-split` con botón disabled |
| Extra | CSS: ¿plano / Tailwind / plano + animaciones? | Tailwind + hover states | CSS plano con transiciones y hover |

**Fase 3 — Plan aprobado:**
Plan guardado en `~/.claude/plans/quiero-armar-un-plan-playful-parnas.md` y en engram (`landing/visual-upgrade`).

**Fase 4 — Implement:**
- `app/page.jsx` — hero con stat-cards, eyebrow, sección `cta-split`
- `app/globals.css` — keyframes float, hover cards, estilos cta-split y progress
- `components/campaign/CampaignCard.jsx` — mini progress bar accesible

---

## Sesión E4 — Fix renderizado de imágenes (2026-04-20)

### Prompt inicial
> "las imágenes no se están renderizando bien. usa agent teams lite y el sdd flow para arreglar esto"

### Proceso aplicado

**Explore agent** — análisis automático del codebase:
- Confirmó que los SVG existen en `/public/campaigns/` con rutas correctas
- Identificó el uso de `next/image` con `width={800} height={500}` en `CampaignCard`
- Detectó `alt=""` vacío (accessibility)
- Detectó que `.campaign-card__image` tenía `width: 100%; height: auto` que anulaba `object-fit: cover`

**Diagnóstico (sin spec formal — fix puntual):**
Con `width/height` explícitos en `next/image`, la imagen renderiza a su ratio intrínseco y el CSS `object-fit: cover` no tiene efecto porque no hay altura restringida por el contenedor. El prop `fill` genera `position: absolute; inset: 0` y sí rellena el contenedor con `aspect-ratio`.

**Implement:**
- `components/campaign/CampaignCard.jsx` — `fill` prop, fix `alt={campaign.imageAlt}`
- `app/globals.css` — `.campaign-card__image` simplificado a `object-fit: cover; object-position: center`

**Decisión registrada:** D18 en `decision.md`.

---

## Reglas del flujo para próximas sesiones

1. **Cambio de producto** (nueva feature, rediseño, nueva sección) → usar `grill-me` primero
2. **Bug o fix puntual** → explore agent → diagnóstico → implement directo
3. **Cambio de arquitectura** (Supabase, auth, pagos) → SDD completo: explore → propose → spec → design → tasks
4. **Siempre** cerrar con entrada en `decision.md` y actualizar `prompts.md`
