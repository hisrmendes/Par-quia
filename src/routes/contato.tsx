import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageTransition, Reveal } from "@/components/Reveal";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Paróquia Sant Joan de Gràcia" },
      {
        name: "description",
        content:
          "Contactos da Paróquia Sant Joan de Gràcia: info@santjoandegracia.cat, (+34) 932 37 73 59, Carrer de la Santa Creu 2, Barcelona.",
      },
      { property: "og:title", content: "Contato — Sant Joan de Gràcia" },
      { property: "og:description", content: "Onde estamos e como falar connosco." },
    ],
  }),
  component: Contato,
});

function Contato() {
  const { t } = useTranslation();

  const CARDS = [
    {
      icon: Mail,
      label: t("contato.emailLabel"),
      value: "info@santjoandegracia.cat",
      href: "mailto:info@santjoandegracia.cat",
    },
    {
      icon: Phone,
      label: t("contato.phoneLabel"),
      value: "(+34) 932 37 73 59",
      href: "tel:+34932377359",
    },
    {
      icon: MapPin,
      label: t("contato.addressLabel"),
      value: t("contato.address"),
      href: "https://www.google.com/maps/search/?api=1&query=Carrer+de+la+Santa+Creu+2,+08024+Barcelona",
    },
  ];

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">{t("contato.title")}</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl">{t("contato.subtitle")}</h1>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.1}>
              <a
                href={c.href}
                {...(c.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                <Card className="h-full border-gold/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
                  <CardContent className="p-7">
                    <c.icon className="h-6 w-6 text-gold" />
                    <p className="mt-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      {c.label}
                    </p>
                    <p className="mt-2 font-display text-xl">{c.value}</p>
                  </CardContent>
                </Card>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-3xl border border-gold/25 shadow-[var(--shadow-elegant)]">
            <iframe
              title={t("contato.mapTitle")}
              src="https://www.google.com/maps?q=Carrer%20de%20la%20Santa%20Creu%202,%2008024%20Barcelona&output=embed"
              loading="lazy"
              className="h-[280px] w-full border-0"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>

      </section>
    </PageTransition>
  );
}
