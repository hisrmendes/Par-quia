import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { CalendarDays, Clock, Download, Quote, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Reveal, PageTransition } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSite } from "@/lib/site-state";
import { getReviews } from "@/lib/reviews.functions";
import { cn } from "@/lib/utils";
import heroNave from "@/assets/hero-nave.jpg";
import cruzPapa from "@/assets/cruz-papa.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Parròquia Sant Joan de Vila de Gràcia — Barcelona" },
      {
        name: "description",
        content:
          "Horarios de misas, visitas guiadas, donaciones y misas en directo de la Parròquia Sant Joan de Vila de Gràcia, joya modernista de Barcelona.",
      },
      { property: "og:title", content: "Parròquia Sant Joan de Vila de Gràcia" },
      {
        property: "og:description",
        content: "Misas, visitas guiadas y la Cruz del Papa en una joya escondida del modernismo catalán.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { news } = useSite();
  const { t, i18n } = useTranslation();
  const hoje = new Date().toISOString().slice(0, 10);
  const reduce = useReducedMotion();

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, reduce ? 0 : 160]);
  const heroScale = useTransform(scrollY, [0, 700], [1, reduce ? 1 : 1.12]);

  const { data } = useQuery({
    queryKey: ["google-reviews"],
    queryFn: () => getReviews(),
    staleTime: 1000 * 60 * 60,
  });
  const reviews = data?.reviews ?? [];

  // Próximos eventos primeiro; passados no fim.
  const ordenadas = [...news].sort((a, b) => {
    const aPast = a.data < hoje;
    const bPast = b.data < hoje;
    if (aPast !== bPast) return aPast ? 1 : -1;
    return aPast ? b.data.localeCompare(a.data) : a.data.localeCompare(b.data);
  });

  const scrollToHorarios = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("horarios")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <PageTransition>
      {/* HERO */}
      <section className="relative isolate min-h-[86vh] overflow-hidden">
        <motion.img
          src={heroNave}
          alt="Nau interior de la Parròquia Sant Joan de Vila de Gràcia"
          width={1600}
          height={1008}
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 h-[115%] w-full object-cover will-change-transform"
        />
        <div className="hero-scrim absolute inset-0" />
        <div className="dark relative mx-auto flex min-h-[86vh] max-w-5xl flex-col items-center justify-center px-4 text-center text-foreground">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.45em] text-gold"
          >
            {t("home.kicker")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl"
          >
            {t("home.title1")}
            <span className="block text-gradient-gold">{t("home.title2")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            {t("home.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-9 flex flex-wrap justify-center gap-3"
          >
            <Button
              asChild
              size="lg"
              className="bg-gold text-accent-foreground hover:bg-gold/90"
            >
              <a href="#horarios" onClick={scrollToHorarios}>
                {t("home.ctaHours")}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/agendamento">{t("home.ctaBook")}</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* A CRUZ DO PAPA */}
      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-[var(--gradient-gold)] opacity-20 blur-2xl" />
              <img
                src={cruzPapa}
                alt={t("home.crossTitle")}
                loading="lazy"
                width={1200}
                height={1408}
                className="relative rounded-[1.5rem] object-cover shadow-[var(--shadow-elegant)]"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-xs uppercase tracking-[0.35em] text-gold">{t("home.crossKicker")}</p>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              {t("home.crossTitle")}
            </h2>
            <div className="my-6 h-px w-24 bg-[var(--gradient-gold)]" />
            <p className="font-display text-2xl leading-relaxed text-foreground/85">
              {t("home.crossQuote")}
            </p>
            <p className="mt-5 text-muted-foreground">{t("home.crossP1")}</p>
            <p className="mt-4 text-muted-foreground">{t("home.crossP2")}</p>
          </Reveal>
        </div>
      </section>

      {/* HORÁRIOS */}
      <section id="horarios" className="scroll-mt-24 bg-secondary/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <h2 className="text-center font-display text-4xl sm:text-5xl">{t("home.hoursTitle")}</h2>
            <p className="mt-3 text-center text-muted-foreground">{t("home.hoursSubtitle")}</p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Reveal delay={0.1}>
              <Card className="h-full border-gold/25">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 text-gold">
                    <Clock className="h-5 w-5" />
                    <h3 className="font-display text-2xl">{t("home.opening")}</h3>
                  </div>
                  <dl className="mt-6 space-y-4 text-sm">
                    <div className="flex justify-between gap-4 border-b border-border/70 pb-3">
                      <dt className="text-muted-foreground">{t("home.monSat")}</dt>
                      <dd className="text-right font-medium">11h — 13h &nbsp;&amp;&nbsp; 16h — 20h</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">{t("home.sunHol")}</dt>
                      <dd className="text-right font-medium">10h — 14h</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </Reveal>
            <Reveal delay={0.2}>
              <Card className="h-full border-gold/25">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 text-gold">
                    <CalendarDays className="h-5 w-5" />
                    <h3 className="font-display text-2xl">{t("home.masses")}</h3>
                  </div>
                  <dl className="mt-6 space-y-4 text-sm">
                    <div className="flex justify-between gap-4 border-b border-border/70 pb-3">
                      <dt className="text-muted-foreground">{t("home.monSat")}</dt>
                      <dd className="text-right font-medium">{t("home.massMonSat")}</dd>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-border/70 pb-3">
                      <dt className="text-muted-foreground">{t("home.sunHol")}</dt>
                      <dd className="text-right font-medium">{t("home.massSun11")}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">{t("home.sunHol")}</dt>
                      <dd className="text-right font-medium">{t("home.massSun13")}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ACTUALITAT */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <h2 className="font-display text-4xl sm:text-5xl">{t("home.newsTitle")}</h2>
          <p className="mt-3 text-muted-foreground">{t("home.newsSubtitle")}</p>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ordenadas.map((item, i) => {
            const passado = item.data < hoje;
            return (
              <Reveal key={item.id} delay={i * 0.06}>
                <Card
                  className={cn(
                    "h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]",
                    passado && "grayscale opacity-60",
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="secondary" className="bg-gold/15 text-accent-foreground">
                        {item.tag}
                      </Badge>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {new Date(item.data).toLocaleDateString(i18n.resolvedLanguage ?? "es", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-xl leading-snug">{item.titulo}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.resumo}</p>
                    {passado && (
                      <p className="mt-4 text-[11px] uppercase tracking-widest text-muted-foreground">
                        {t("home.newsPast")}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* DOWNLOAD */}
      <section className="bg-secondary/40 py-20">
        <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-4xl">{t("home.downloadTitle")}</h2>
          <p className="mt-3 text-muted-foreground">{t("home.downloadDesc")}</p>
          <Button asChild size="lg" className="mt-8 bg-gold text-accent-foreground hover:bg-gold/90">
            <a href="/full-parroquial.pdf" download>
              <Download className="mr-2 h-4 w-4" /> {t("home.downloadCta")}
            </a>
          </Button>
        </Reveal>
      </section>

      {/* REVIEWS */}
      <section className="overflow-hidden py-24">
        <Reveal className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-4xl">{t("home.reviewsTitle")}</h2>
          <p className="mt-3 text-muted-foreground">{t("home.reviewsSubtitle")}</p>
        </Reveal>
        <div className="group relative mt-12 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-marquee flex w-max gap-6 group-hover:[animation-play-state:paused]">
            {[...reviews, ...reviews].map((r, i) => (
              <Card key={i} className="w-[320px] shrink-0 border-gold/20">
                <CardContent className="p-6">
                  <Quote className="h-5 w-5 text-gold/60" />
                  <p className="mt-3 text-sm text-foreground/85">{r.texto}</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium">{r.nome}</span>
                    <span className="flex shrink-0 gap-0.5">
                      {Array.from({ length: r.rating }).map((_, s) => (
                        <Star key={s} className="h-3.5 w-3.5 fill-gold text-gold" />
                      ))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
