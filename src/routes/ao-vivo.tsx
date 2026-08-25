import { createFileRoute, Link } from "@tanstack/react-router";
import { Radio, VideoOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageTransition, Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { useSite } from "@/lib/site-state";

export const Route = createFileRoute("/ao-vivo")({
  head: () => ({
    meta: [
      { title: "Ao Vivo — Missas em direto | Sant Joan de Gràcia" },
      {
        name: "description",
        content:
          "Acompanhe em direto as missas da Paróquia Sant Joan de Gràcia em catalão, castelhano ou português.",
      },
      { property: "og:title", content: "Missas ao vivo — Sant Joan de Gràcia" },
      { property: "og:description", content: "Transmissão em direto das celebrações da paróquia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AoVivo,
});

function AoVivo() {
  const { live } = useSite();
  const { t } = useTranslation();

  if (!live.active) {
    return (
      <PageTransition>
        <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
          <VideoOff className="h-10 w-10 text-muted-foreground" />
          <h1 className="mt-6 font-display text-4xl">{t("aovivo.offlineTitle")}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{t("aovivo.offlineDesc")}</p>
          <Button asChild className="mt-8 bg-gold text-accent-foreground hover:bg-gold/90">
            <Link to="/">{t("aovivo.back")}</Link>
          </Button>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="flex items-center gap-3">
            <Radio className="h-5 w-5 text-destructive" />
            <p className="text-xs uppercase tracking-[0.4em] text-gold">{t("aovivo.kicker")}</p>
          </div>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-5xl sm:text-6xl">{live.titulo}</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                {live.descricao || t("aovivo.liveIn", { idioma: t(`idioma.${live.idioma}`) })}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-gold">
                {t("aovivo.liveIn", { idioma: t(`idioma.${live.idioma}`) })}
              </p>
            </div>
            <span className="animate-live inline-flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground">
              <span className="h-2 w-2 rounded-full bg-destructive-foreground" />
              {t("nav.live", { idioma: t(`idioma.${live.idioma}`) })}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 overflow-hidden rounded-2xl border border-gold/25 bg-secondary/60 shadow-[var(--shadow-elegant)]">
            <div className="relative aspect-video w-full">
              <iframe
                src={live.url}
                title={live.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </Reveal>
      </section>
    </PageTransition>
  );
}
