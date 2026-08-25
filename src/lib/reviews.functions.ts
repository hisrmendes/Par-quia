import { createServerFn } from "@tanstack/react-start";

export type Review = { nome: string; texto: string; rating: number };

const FALLBACK: Review[] = [
  {
    nome: "Marta Vidal",
    texto: "Un tresor amagat de Gràcia. La capella del Santíssim és espectacular.",
    rating: 5,
  },
  {
    nome: "João Ferreira",
    texto: "A visita com o Albert foi inesquecível. Explicações riquíssimas.",
    rating: 5,
  },
  { nome: "Carles Puig", texto: "Silenci, bellesa i acollida. Hi torno cada diumenge.", rating: 5 },
  { nome: "Ana Beltrán", texto: "Los mosaicos son de una belleza que quita el aliento.", rating: 5 },
  {
    nome: "Sofia Marques",
    texto: "A missa bilíngue das 13h é um abraço para quem vem de longe.",
    rating: 5,
  },
];

const PLACE_ID = "ChIJhQQrkLyipBIRlp3-n3kUGHM";

/**
 * Google Places reviews. Returns curated fallback reviews while
 * GOOGLE_PLACES_API_KEY is not configured.
 */
export const getReviews = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["GOOGLE_PLACES_API_KEY"];
  if (!key) return { reviews: FALLBACK, live: false };

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "reviews.rating,reviews.text,reviews.authorAttribution.displayName",
      },
    });
    if (!res.ok) return { reviews: FALLBACK, live: false };
    const json = (await res.json()) as {
      reviews?: Array<{
        rating?: number;
        text?: { text?: string };
        authorAttribution?: { displayName?: string };
      }>;
    };
    const reviews: Review[] = (json.reviews ?? [])
      .filter((r) => (r.rating ?? 0) >= 4 && r.text?.text)
      .map((r) => ({
        nome: r.authorAttribution?.displayName ?? "Google",
        texto: (r.text?.text ?? "").slice(0, 240),
        rating: Math.round(r.rating ?? 5),
      }));
    return reviews.length ? { reviews, live: true } : { reviews: FALLBACK, live: false };
  } catch {
    return { reviews: FALLBACK, live: false };
  }
});
