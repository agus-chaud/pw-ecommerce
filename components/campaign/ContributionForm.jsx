"use client";

import { useCallback, useMemo, useState } from "react";
import {
  MIN_CONTRIBUTION_AMOUNT,
  validateContributionBody,
} from "@/lib/contribution/validate";
import {
  deriveInitialsFallback,
  formatMoney,
  getContributionAmountDisplay,
  getContributorDisplayName,
} from "@/lib/data/campaigns";

function buildPreviewContribution({
  amount,
  displayName,
  showPublicName,
  showAmount,
}) {
  const initialsFallback = deriveInitialsFallback(displayName);
  return {
    id: "preview",
    showPublicName,
    displayNameWhenPublic: displayName.trim() || "—",
    initialsFallback,
    showAmount,
    amount: Number.isFinite(amount) ? amount : 0,
  };
}

export function ContributionForm({ campaignSlug, campaignTitle }) {
  const [amountInput, setAmountInput] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPublicName, setShowPublicName] = useState(true);
  const [showAmount, setShowAmount] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const amount = useMemo(() => {
    const n = Number.parseFloat(String(amountInput).replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }, [amountInput]);

  const previewContribution = useMemo(
    () =>
      buildPreviewContribution({
        amount,
        displayName,
        showPublicName,
        showAmount,
      }),
    [amount, displayName, showPublicName, showAmount],
  );

  const previewName = getContributorDisplayName(previewContribution);
  const amountDisplay = getContributionAmountDisplay(previewContribution);
  const previewAmountReady =
    Number.isFinite(amount) && amount >= MIN_CONTRIBUTION_AMOUNT;

  const validate = useCallback(() => {
    const result = validateContributionBody({
      amount: amountInput,
      displayName,
      showPublicName,
      showAmount,
    });
    setErrors(result.valid ? {} : result.errors);
    return result.valid;
  }, [amountInput, displayName, showPublicName, showAmount]);

  const summaryLines = useMemo(() => {
    const lines = [];
    if (Number.isFinite(amount) && amount >= MIN_CONTRIBUTION_AMOUNT) {
      lines.push(`Monto del aporte: ${formatMoney(amount)}.`);
    } else {
      lines.push(`Indicá un monto (mínimo ${formatMoney(MIN_CONTRIBUTION_AMOUNT)}).`);
    }
    if (showPublicName) {
      lines.push(
        displayName.trim()
          ? `En la lista se verá tu nombre: “${displayName.trim()}”.`
          : "Completá el nombre o elegí no mostrarlo públicamente.",
      );
    } else {
      const ini = deriveInitialsFallback(displayName);
      lines.push(
        ini
          ? `Con el nombre oculto, la lista mostrará: “${ini}”.`
          : 'Sin nombre para derivar iniciales, la lista mostrará “Anónimo”.',
      );
    }
    lines.push(
      showAmount
        ? "El monto figurará en la lista pública."
        : 'En la lista pública verán “Monto oculto” (el total de la campaña sigue contando tu aporte real).',
    );
    return lines;
  }, [amount, displayName, showPublicName, showAmount]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitMessage(null);
    setServerError(null);
    if (!validate()) return;

    const parsed = validateContributionBody({
      amount: amountInput,
      displayName,
      showPublicName,
      showAmount,
    });
    if (!parsed.valid || !parsed.data) return;

    if (!campaignSlug?.trim()) {
      setServerError("Falta el identificador de campaña. Recargá la página.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `/api/campanas/${encodeURIComponent(campaignSlug.trim())}/aporte`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        },
      );

      let payload = {};
      try {
        payload = await res.json();
      } catch {
        payload = {};
      }

      if (!res.ok) {
        if (payload.errors && typeof payload.errors === "object") {
          setErrors(payload.errors);
        } else {
          setServerError(
            typeof payload.error === "string"
              ? payload.error
              : "No se pudo validar el aporte en el servidor.",
          );
        }
        return;
      }

      if (typeof payload.message === "string") {
        setSubmitMessage(payload.message);
      } else {
        setSubmitMessage("Aporte validado en el servidor.");
      }
    } catch {
      setServerError("Error de red. Probá de nuevo en unos segundos.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      className="contribution-form"
      aria-labelledby="contribution-form-heading"
    >
      <h2 id="contribution-form-heading" className="contribution-form__title">
        Hacé tu aporte
      </h2>
      <p className="contribution-form__intro">
        Completá los datos. El resumen y la vista previa se actualizan mientras escribís, así ves
        cómo quedará tu fila en “Aportes recientes” según privacidad.
        {campaignTitle ? (
          <>
            {" "}
            Campaña: <strong>{campaignTitle}</strong>.
          </>
        ) : null}
      </p>

      <form className="contribution-form__form" onSubmit={handleSubmit} noValidate>
        <div className="contribution-form__field">
          <label htmlFor="contribution-amount">Monto (ARS)</label>
          <input
            id="contribution-amount"
            name="amount"
            type="number"
            min={MIN_CONTRIBUTION_AMOUNT}
            step="1"
            inputMode="numeric"
            autoComplete="transaction-amount"
            value={amountInput}
            onChange={(e) => {
              setAmountInput(e.target.value);
              setErrors((prev) => ({ ...prev, amount: undefined }));
            }}
            onBlur={validate}
            aria-invalid={errors.amount ? "true" : "false"}
            aria-describedby={errors.amount ? "err-amount" : undefined}
          />
          {errors.amount ? (
            <p id="err-amount" className="contribution-form__error" role="alert">
              {errors.amount}
            </p>
          ) : null}
        </div>

        <div className="contribution-form__field">
          <label htmlFor="contribution-display-name">Nombre para identificarte</label>
          <input
            id="contribution-display-name"
            name="displayName"
            type="text"
            maxLength={120}
            autoComplete="name"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              setErrors((prev) => ({ ...prev, displayName: undefined }));
            }}
            onBlur={validate}
            aria-invalid={errors.displayName ? "true" : "false"}
            aria-describedby={errors.displayName ? "err-display-name" : undefined}
          />
          <p className="contribution-form__hint" id="hint-display-name">
            Lo usamos para generar tu nombre público o las iniciales, según elijas abajo.
          </p>
          {errors.displayName ? (
            <p id="err-display-name" className="contribution-form__error" role="alert">
              {errors.displayName}
            </p>
          ) : null}
        </div>

        <fieldset className="contribution-form__fieldset">
          <legend className="contribution-form__legend">Privacidad en la lista pública</legend>

          <div className="contribution-form__check">
            <input
              id="contribution-show-name"
              name="showPublicName"
              type="checkbox"
              checked={showPublicName}
              onChange={(e) => {
                setShowPublicName(e.target.checked);
                setErrors((prev) => ({ ...prev, displayName: undefined }));
              }}
            />
            <label htmlFor="contribution-show-name">Mostrar mi nombre públicamente</label>
          </div>
          <p className="contribution-form__hint">
            Si lo desactivás, en la lista verán iniciales o “Anónimo”, según haya texto en el nombre.
          </p>

          <div className="contribution-form__check">
            <input
              id="contribution-show-amount"
              name="showAmount"
              type="checkbox"
              checked={showAmount}
              onChange={(e) => setShowAmount(e.target.checked)}
            />
            <label htmlFor="contribution-show-amount">Mostrar el monto donado en la lista pública</label>
          </div>
          <p className="contribution-form__hint">
            Si ocultás el monto, en la lista verán “Monto oculto”; el sistema igual registra el valor
            real para la meta de la campaña.
          </p>
        </fieldset>

        <div
          className="contribution-form__live-summary"
          aria-live="polite"
          aria-atomic="true"
        >
          <h3 className="contribution-form__subheading">Resumen del aporte</h3>
          <ul className="contribution-form__summary-list">
            {summaryLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <section
          className="contribution-form__preview-block"
          role="region"
          aria-labelledby="contribution-preview-heading"
        >
          <h3
            id="contribution-preview-heading"
            className="contribution-form__subheading"
          >
            Vista previa en la lista
          </h3>
          <p className="contribution-form__hint">Así se vería tu fila junto al resto de los aportes:</p>
          <ul className="contributions__list contribution-form__preview-list">
            <li className="contributions__item contribution-form__preview-item">
              <span className="contributions__name">{previewName}</span>
              <span className="contributions__amount">
                {!previewAmountReady ? (
                  <span aria-hidden="true">—</span>
                ) : amountDisplay.isHidden ? (
                  <>
                    <span aria-hidden="true">{amountDisplay.visibleLabel}</span>
                    <span className="sr-only">Monto oculto por preferencia del donante</span>
                  </>
                ) : (
                  amountDisplay.visibleLabel
                )}
              </span>
            </li>
          </ul>
        </section>

        <button
          type="submit"
          className="button button--primary button--lg"
          disabled={submitting}
          aria-busy={submitting ? "true" : "false"}
        >
          {submitting ? "Enviando…" : "Continuar hacia el pago"}
        </button>
      </form>

      {serverError ? (
        <p className="contribution-form__error contribution-form__error--block" role="alert">
          {serverError}
        </p>
      ) : null}

      {submitMessage ? (
        <p className="contribution-form__success" role="status" aria-live="polite">
          {submitMessage}
        </p>
      ) : null}
    </section>
  );
}
