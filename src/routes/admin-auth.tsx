import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Cross, KeyRound, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { PageTransition } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSite } from "@/lib/site-state";

export const Route = createFileRoute("/admin-auth")({
  head: () => ({
    meta: [
      { title: "Acesso restrito — Sant Joan de Gràcia" },
      { name: "description", content: "Área reservada à equipa paroquial." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Acesso restrito" },
      { property: "og:description", content: "Área reservada à equipa paroquial." },
    ],
  }),
  component: AdminAuth,
});

const emailSchema = z.string().trim().toLowerCase().email().max(255);

function AdminAuth() {
  const { user, loginAs } = useSite();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (user) void navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const entrar = () => {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setErro("E-mail inválido");
      return;
    }
    setErro(null);
    setLoading(true);
    // Fluxo OAuth Google (mock). Ligar a lovable.auth.signInWithOAuth("google") ao ativar o Cloud.
    setTimeout(() => {
      loginAs(parsed.data);
      setLoading(false);
      void navigate({ to: "/dashboard" });
    }, 800);
  };

  return (
    <PageTransition>
      <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-20">
        <Card className="w-full border-gold/30 shadow-[var(--shadow-elegant)]">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 text-gold">
              <KeyRound className="h-5 w-5" />
              <p className="text-xs uppercase tracking-[0.3em]">{t("admin.kicker")}</p>
            </div>
            <h1 className="mt-4 font-display text-3xl">{t("admin.title")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("admin.desc")}</p>

            <div className="mt-6">
              <Label htmlFor="email" className="text-sm">
                {t("admin.googleEmail")}
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && entrar()}
                className="mt-2"
              />
              {erro && <p className="mt-2 text-xs text-destructive">{erro}</p>}
            </div>

            <Button
              onClick={entrar}
              disabled={loading}
              className="mt-6 h-12 w-full bg-gold text-accent-foreground hover:bg-gold/90"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Cross className="mr-2 h-4 w-4" aria-hidden />
              )}
              {t("admin.signIn")}
            </Button>
          </CardContent>
        </Card>
      </section>
    </PageTransition>
  );
}
