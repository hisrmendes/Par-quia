import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Landmark, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PageTransition, Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import gal6 from "@/assets/gal-6.jpg";
import gal1 from "@/assets/gal-1.jpg";

export const Route = createFileRoute("/historia")({
  head: () => ({
    meta: [
      { title: "História — Paróquia Sant Joan de Gràcia" },
      {
        name: "description",
        content:
          "A história da Paróquia Sant Joan de Gràcia, a Capela do Santíssimo de Francesc Berenguer i Mestres e a joia escondida da Barcelona Secreta.",
      },
      { property: "og:title", content: "História da Paróquia Sant Joan de Gràcia" },
      {
        property: "og:description",
        content: "Berenguer, trencadís e voluntariado: a joia escondida de Vila de Gràcia.",
      },
    ],
  }),
  component: Historia,
});

const BERENGUER_URL = "https://www.google.com/search?q=Francesc+Berenguer+i+Mestres";
const GAUDI_URL = "https://www.google.com/search?q=Antoni+Gaud%C3%AD";

function Trencadis() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg, hsl(var(--gold)) 0deg 8deg, transparent 8deg 20deg), repeating-linear-gradient(45deg, hsl(var(--gold)) 0 2px, transparent 2px 24px)",
          backgroundSize: "48px 48px, 34px 34px",
        }}
      />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-secondary/40 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
    </div>
  );
}

function Historia() {
  const { t } = useTranslation();

  const berenguerName = "Francesc Berenguer i Mestres";
  const gaudiName = "Antoni Gaudí";

  return (
    <PageTransition>
      <div className="relative">
        <Trencadis />

        <section className="mx-auto max-w-4xl px-4 pb-16 pt-20 text-center sm:px-6">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.4em] text-gold">{t("historia.kicker")}</p>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl">{t("historia.title")}</h1>
            <p className="mt-6 text-lg text-muted-foreground">{t("historia.lead")}</p>
          </Reveal>
        </section>

        <section className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-elegant)]">
            <motion.img
              src={gal6}
              alt={t("historia.heroImgAlt")}
              loading="lazy"
              width={1200}
              height={800}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full object-cover"
            />
            <motion.div
              aria-hidden
              initial={{ opacity: 1 }}
              whileInView={{ opacity: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 bg-background"
            />
          </div>
        </section>

        <section className="mx-auto max-w-3xl space-y-6 px-4 py-20 text-[17px] leading-relaxed text-foreground/85 sm:px-6">
          <Reveal>
            <h2 className="font-display text-3xl">{t("historia.title")}</h2>
            <p className="mt-4">{t("historia.p1")}</p>
          </Reveal>
          <Reveal delay={0.12}>
            <p>{t("historia.p2")}</p>
          </Reveal>
        </section>

        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 -z-10 bg-[var(--gradient-gold)] opacity-[0.06]" />
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <Reveal>
              <div className="rounded-2xl border border-gold/30 bg-card/60 p-10 shadow-[var(--shadow-elegant)] backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.35em] text-gold">
                  {t("historia.chapelKicker")}
                </p>
                <h2 className="mt-4 font-display text-3xl italic sm:text-4xl">
                  {t("historia.gaudiTitle")}
                </h2>
                <div className="mx-auto my-6 h-px w-20 bg-[var(--gradient-gold)]" />
                <p className="text-muted-foreground">{t("historia.gaudiP")}</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="bg-secondary/40 py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2">
            <Reveal>
              <img
                src={gal1}
                alt={t("historia.chapelImgAlt")}
                loading="lazy"
                width={900}
                height={1200}
                className="rounded-2xl object-cover shadow-[var(--shadow-elegant)]"
              />
            </Reveal>
            <Reveal delay={0.12}>
              <div className="flex items-center gap-3 text-gold">
                <Landmark className="h-5 w-5" />
                <p className="text-xs uppercase tracking-[0.3em]">{t("historia.chapelKicker")}</p>
              </div>
              <h2 className="mt-4 font-display text-4xl">{t("historia.chapelTitle")}</h2>
              <div className="my-5 h-px w-24 bg-[var(--gradient-gold)]" />
              <p className="text-muted-foreground">
                {t("historia.chapelP")
                  .split(berenguerName)
                  .flatMap((part, i, arr) =>
                    i < arr.length - 1
                      ? [
                          part,
                          <a
                            key={i}
                            href={BERENGUER_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-foreground underline decoration-gold/60 underline-offset-4 hover:text-gold"
                          >
                            {berenguerName}
                          </a>,
                        ]
                      : [part],
                  )}
              </p>
              <p className="mt-4 text-muted-foreground">{t("historia.chapelP2")}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                <a
                  href={GAUDI_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-foreground underline decoration-gold/60 underline-offset-4 hover:text-gold"
                >
                  {gaudiName}
                </a>{" "}
                — {t("historia.searchLink")}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Reveal>
              <Card className="h-full border-gold/25">
                <CardContent className="p-8">
                  <Compass className="h-6 w-6 text-gold" />
                  <h3 className="mt-4 font-display text-2xl">{t("historia.guideTitle")}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{t("historia.guideP")}</p>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal delay={0.1}>
              <Card className="h-full border-gold/25">
                <CardContent className="p-8">
                  <Users className="h-6 w-6 text-gold" />
                  <h3 className="mt-4 font-display text-2xl">{t("historia.volunteerTitle")}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{t("historia.volunteerP")}</p>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal delay={0.2}>
              <Card className="h-full border-gold/25">
                <CardContent className="p-8">
                  <Landmark className="h-6 w-6 text-gold" />
                  <h3 className="mt-4 font-display text-2xl">{t("historia.conservationTitle")}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {t("historia.conservationP")}
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </div>
          <Reveal className="mt-14 text-center">
            <Button asChild size="lg" className="bg-gold text-accent-foreground hover:bg-gold/90">
              <Link to="/agendamento">{t("historia.albertCta")}</Link>
            </Button>
          </Reveal>
        </section>
      </div>
    </PageTransition>
  );
}
