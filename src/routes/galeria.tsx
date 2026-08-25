import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PageTransition, Reveal } from "@/components/Reveal";
import hero from "@/assets/hero-nave.jpg";
import cruz from "@/assets/cruz-papa.jpg";
import g1 from "@/assets/gal-1.jpg";
import g2 from "@/assets/gal-2.jpg";
import g3 from "@/assets/gal-3.jpg";
import g4 from "@/assets/gal-4.jpg";
import g5 from "@/assets/gal-5.jpg";
import g6 from "@/assets/gal-6.jpg";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { title: "Galeria — Paróquia Sant Joan de Gràcia" },
      {
        name: "description",
        content:
          "Imagens da Paróquia Sant Joan de Gràcia: mosaicos de trencadís, vitrais, a Cruz do Papa e a Capela do Santíssimo.",
      },
      { property: "og:title", content: "Galeria da Paróquia Sant Joan de Gràcia" },
      { property: "og:description", content: "Mosaicos, vitrais e luz dourada em Vila de Gràcia." },
    ],
  }),
  component: Galeria,
});

function Galeria() {
  const { t } = useTranslation();

  const IMAGENS = [
    { src: g1, alt: t("galeria.imgAlt1") },
    { src: g2, alt: t("galeria.imgAlt2") },
    { src: cruz, alt: t("galeria.imgAlt3") },
    { src: g3, alt: t("galeria.imgAlt4") },
    { src: g4, alt: t("galeria.imgAlt5") },
    { src: hero, alt: t("galeria.imgAlt6") },
    { src: g5, alt: t("galeria.imgAlt7") },
    { src: g6, alt: t("galeria.imgAlt8") },
  ];

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-gold">{t("galeria.title")}</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl">{t("galeria.subtitle")}</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">{t("galeria.alt")}</p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {IMAGENS.map((img, i) => (
            <Reveal key={i} delay={(i % 3) * 0.08} className="break-inside-avoid">
              <figure className="group relative overflow-hidden rounded-xl">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 ease-out hover:scale-105 group-hover:scale-105"
                />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-background/95 to-transparent p-4 text-sm text-foreground transition-transform duration-500 group-hover:translate-y-0">
                  {img.alt}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
