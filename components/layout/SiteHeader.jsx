import Link from "next/link";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/campanas", label: "Campañas" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="site-header__brand">
          Impulsa<span className="site-header__brand-accent">.barrio</span>
        </Link>
        <nav className="site-header__nav" aria-label="Principal">
          <ul className="site-header__list">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="site-header__link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
