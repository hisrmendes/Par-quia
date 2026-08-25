import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="mt-24 border-t border-border/70 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2">
        <div className="min-w-0">
          <h3 className="font-display text-2xl">Paròquia Sant Joan de Gràcia</h3>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t("footer.about")}</p>
        </div>

        <div className="space-y-3 text-sm md:justify-self-end">
          <a
            href="mailto:info@santjoandegracia.cat"
            className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-gold"
          >
            <Mail className="h-4 w-4 shrink-0 text-gold" /> info@santjoandegracia.cat
          </a>
          <a
            href="tel:+34932377359"
            className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-gold"
          >
            <Phone className="h-4 w-4 shrink-0 text-gold" /> (+34) 932 37 73 59
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Carrer+de+la+Santa+Creu+2,+08024+Barcelona"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-gold"
          >
            <MapPin className="h-4 w-4 shrink-0 text-gold" /> Carrer de la Santa Creu 2, 08024
            Barcelona
          </a>
        </div>
      </div>

      <div className="border-t border-border/70 py-8 text-center text-xs text-muted-foreground">
        <p>
          <Link
            to="/admin-auth"
            aria-hidden="true"
            tabIndex={-1}
            className="cursor-default text-inherit no-underline outline-none hover:text-inherit hover:no-underline focus:outline-none"
          >
            ©
          </Link>{" "}
          {t("footer.rights")}
        </p>
        <p className="mt-3">
          <a
            href="https://www.linkedin.com/in/sr-mendes"
            target="_blank"
            rel="noreferrer"
            className="group relative inline-block px-6 py-2 font-medium text-foreground/70 transition-colors duration-500 hover:text-gold
              before:pointer-events-none before:absolute before:left-1/2 before:top-0 before:h-3 before:w-16 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-[50%] before:border-2 before:border-gold before:opacity-0 before:blur-[1px] before:transition-all before:duration-500 before:content-[''] group-hover:before:opacity-100
              after:pointer-events-none after:absolute after:left-1/2 after:top-1/2 after:h-24 after:w-40 after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:opacity-0 after:transition-opacity after:duration-500 after:content-['']
              after:[background:radial-gradient(circle,color-mix(in_oklab,var(--gold)_45%,transparent)_0%,transparent_70%)]
              hover:before:opacity-100 hover:after:opacity-100"
          >
            <span className="relative z-10">By Sr.Mendes</span>
          </a>
        </p>
      </div>
    </footer>
  );
}
