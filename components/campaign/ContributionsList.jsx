import { getContributionAmountDisplay, getContributorDisplayName } from "@/lib/data/campaigns";

export function ContributionsList({ contributions }) {
  return (
    <section className="contributions" aria-labelledby="contributions-heading">
      <h2 id="contributions-heading" className="contributions__title">
        Aportes recientes
      </h2>
      <p className="contributions__hint">
        Los datos respetan la privacidad elegida por cada persona: nombre o iniciales, y monto visible u oculto.
      </p>
      <ul className="contributions__list">
        {contributions.map((c) => {
          const name = getContributorDisplayName(c);
          const { visibleLabel, isHidden } = getContributionAmountDisplay(c);
          return (
            <li key={c.id} className="contributions__item">
              <span className="contributions__name">{name}</span>
              <span className="contributions__amount">
                {isHidden ? (
                  <>
                    <span aria-hidden="true">{visibleLabel}</span>
                    <span className="sr-only">Monto oculto por preferencia del donante</span>
                  </>
                ) : (
                  visibleLabel
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
