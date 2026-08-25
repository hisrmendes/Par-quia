import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HandHeart, Heart, Loader2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { PageTransition, Reveal } from "@/components/Reveal";
import { PaymentMethods } from "@/components/PaymentMethods";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/doacoes")({
  head: () => ({
    meta: [
      { title: "Donaciones — Diezmos y ofrendas | Sant Joan de Gràcia" },
      {
        name: "description",
        content:
          "Apoya los proyectos de la Parròquia Sant Joan de Gràcia. Dona cualquier importe desde 1 € con pago seguro.",
      },
      { property: "og:title", content: "Apoya la Parròquia Sant Joan de Gràcia" },
      { property: "og:description", content: "Diezmos y ofrendas con pago seguro." },
    ],
  }),
  component: Doacoes,
});

const PRESETS = [10, 20, 50];

function Doacoes() {
  const { t } = useTranslation();
  const [valor, setValor] = useState<string>("20");
  const [isCustom, setIsCustom] = useState(false);
  const [intencao, setIntencao] = useState("");
  const [loading, setLoading] = useState(false);

  const numero = Number(valor.replace(",", "."));
  const valido = Number.isFinite(numero) && numero >= 1;

  const projetos = [
    { titulo: t("doacoes.project1Title"), desc: t("doacoes.project1Desc") },
    { titulo: t("doacoes.project2Title"), desc: t("doacoes.project2Desc") },
    { titulo: t("doacoes.project3Title"), desc: t("doacoes.project3Desc") },
  ];

  const doar = () => {
    if (!valido) {
      toast.error(t("doacoes.min"));
      return;
    }
    setLoading(true);
    // TODO(stripe): criar Checkout Session no servidor com { amount: numero, intention }
    // e redirecionar para session.url; confirmar com webhook `checkout.session.completed`.
    setTimeout(() => {
      setLoading(false);
      toast.success(
        `${t("doacoes.donate")} — ${numero.toFixed(2)}€${intencao.trim() ? ` · ${intencao.trim()}` : ""}`,
      );
    }, 1400);
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">{t("doacoes.subtitle")}</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl">{t("doacoes.title")}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">{t("doacoes.lead")}</p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <Card className="border-gold/30">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-3 text-gold">
                  <HandHeart className="h-5 w-5" />
                  <h2 className="font-display text-2xl">{t("doacoes.chooseAmount")}</h2>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setValor(String(p));
                        setIsCustom(false);
                      }}
                      className={cn(
                        "rounded-lg border px-4 py-5 font-display text-2xl tabular-nums transition-all duration-200 hover:-translate-y-0.5",
                        Number(valor) === p && !isCustom
                          ? "border-gold bg-gold/15 text-accent-foreground shadow-[var(--shadow-elegant)]"
                          : "border-border bg-card text-foreground/80 hover:border-gold/60",
                      )}
                    >
                      {p}€
                    </button>
                  ))}
                </div>

                <div className="mt-8">
                  <Label htmlFor="valor" className="text-sm">
                    {t("doacoes.customLabel")}
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="valor"
                      type="number"
                      min={1}
                      step="1"
                      inputMode="decimal"
                      value={valor}
                      onChange={(e) => {
                        setValor(e.target.value);
                        setIsCustom(true);
                      }}
                      placeholder={t("doacoes.placeholder")}
                      className="h-28 rounded-2xl pr-16 text-center font-display text-6xl tabular-nums sm:h-32 sm:text-7xl"
                    />
                    <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 font-display text-4xl text-muted-foreground sm:text-5xl">
                      €
                    </span>
                  </div>
                  {!valido && valor !== "" && (
                    <p className="mt-2 text-xs text-destructive">{t("doacoes.min")}</p>
                  )}
                </div>

                <div className="mt-6">
                  <Label htmlFor="intencao" className="text-sm">
                    {t("doacoes.intentionLabel")}
                  </Label>
                  <Input
                    id="intencao"
                    value={intencao}
                    maxLength={140}
                    onChange={(e) => setIntencao(e.target.value)}
                    placeholder={t("doacoes.intentionPlaceholder")}
                    className="mt-2 h-12"
                  />
                </div>

                <Button
                  size="lg"
                  disabled={loading || !valido}
                  onClick={doar}
                  className="mt-8 h-14 w-full bg-gold text-base text-accent-foreground hover:bg-gold/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t("doacoes.processing")}
                    </>
                  ) : (
                    <>
                      <motion.span
                        animate={isCustom ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                        transition={
                          isCustom
                            ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
                            : { duration: 0.2 }
                        }
                        className="mr-2 inline-flex"
                      >
                        <Heart className="h-5 w-5" />
                      </motion.span>
                      {t("doacoes.donate")}
                      {valido ? ` — ${numero.toFixed(2)}€` : ""}
                    </>
                  )}
                </Button>

                <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-gold" /> {t("doacoes.secure")}
                </p>

                <div className="mt-6 border-t border-border/60 pt-5">
                  <p className="text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    {t("doacoes.methods")}
                  </p>
                  <PaymentMethods />
                </div>
              </CardContent>
            </Card>
          </Reveal>

          <div className="space-y-5">
            {projetos.map((p, i) => (
              <Reveal key={p.titulo} delay={i * 0.1}>
                <Card className="border-gold/20">
                  <CardContent className="p-6">
                    <h3 className="font-display text-xl">{p.titulo}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
