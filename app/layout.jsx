import { Fraunces, Source_Sans_3 } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Impulsa.barrio — Crowdfunding comunitario",
    template: "%s · Impulsa.barrio",
  },
  description:
    "Plataforma de microfinanciación para proyectos barriales: explorá campañas, aportá y seguí el progreso.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a href="#contenido-principal" className="skip-link">
          Saltar al contenido
        </a>
        <SiteHeader />
        <main id="contenido-principal" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
