import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarCheck, Clock, Languages, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { PageTransition, Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSite, type Idioma } from "@/lib/site-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/agendamento")({
  head: () => ({
    meta: [
      { title: "Agendamento — Visitas e Confissões | Sant Joan de Gràcia" },
      {
        name: "description",
        content:
          "Reserve uma visita guiada com Albert ou uma confissão com o Padre Adilson na Paróquia Sant Joan de Gràcia.",
      },
      { property: "og:title", content: "Agende a sua visita ou confissão" },
      {
        property: "og:description",
        content: "Visitas guiadas de manhã e confissões em catalão, castelhano ou português.",
      },
    ],
  }),
  component: Agendamento,
});

function slots(inicio: string, fim: string, passo: number) {
  const out: string[] = [];
  const [h0, m0] = inicio.split(":").map(Number);
  const [h1, m1] = fim.split(":").map(Number);
  for (let t = h0! * 60 + m0!; t + passo <= h1! * 60 + m1!; t += passo) {
    out.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
  }
  return out;
}

const IDIOMAS: Idioma[] = ["Catalão", "Castelhano", "Português"];

function Agendamento() {
  const { addBooking } = useSite();
  const { t, i18n } = useTranslation();

  const [diaVisita, setDiaVisita] = useState<Date | undefined>(new Date());
  const [duracao, setDuracao] = useState("30");
  const [horaVisita, setHoraVisita] = useState<string>("");
  const [nomeVisita, setNomeVisita] = useState("");

  const [diaConf, setDiaConf] = useState<Date | undefined>(new Date());
  const [horaConf, setHoraConf] = useState<string>("");
  const [idioma, setIdioma] = useState<Idioma>("Catalão");
  const [nomeConf, setNomeConf] = useState("");

  const horasVisita = useMemo(() => slots("11:00", "13:00", Number(duracao)), [duracao]);
  const horasConf = useMemo(() => slots("18:00", "19:00", 10), []);

  const reservar = (tipo: "visita" | "confissao") => {
    const dia = tipo === "visita" ? diaVisita : diaConf;
    const hora = tipo === "visita" ? horaVisita : horaConf;
    const nome = tipo === "visita" ? nomeVisita : nomeConf;
    if (!dia || !hora || !nome.trim()) {
      toast.error(t("agendamento.chooseSlot"));
      return;
    }
    const b = addBooking({
      tipo,
      nome: nome.trim().slice(0, 80),
      dia: dia.toISOString().slice(0, 10),
      hora,
      duracao: tipo === "visita" ? Number(duracao) : 10,
      ...(tipo === "confissao" ? { idioma } : {}),
    });
    toast.success(
      `${t("agendamento.success")} · ${t("agendamento.ticket")} ${b.ticket} · ${dia.toLocaleDateString(i18n.resolvedLanguage ?? "es")} ${hora}`,
    );
    if (tipo === "visita") {
      setHoraVisita("");
      setNomeVisita("");
    } else {
      setHoraConf("");
      setNomeConf("");
    }
  };

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 py-20 pb-28 sm:px-6">
        <Reveal className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-gold">{t("agendamento.subtitle")}</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl">{t("agendamento.title")}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            {t("agendamento.tourDesc")}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* MÓDULO A */}
          <Reveal>
            <Card className="h-full border-gold/30">
              <CardContent className="p-7">
                <div className="flex items-center gap-3 text-gold">
                  <Sparkles className="h-5 w-5" />
                  <h2 className="font-display text-2xl">{t("agendamento.tourTitle")}</h2>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("agendamento.chooseSlot")}
                </p>

                <div className="mt-6 flex justify-center rounded-xl border border-border/70 p-2">
                  <Calendar
                    mode="single"
                    selected={diaVisita}
                    onSelect={setDiaVisita}
                    disabled={{ before: new Date() }}
                  />
                </div>

                <div className="mt-6">
                  <Label className="text-sm">{t("agendamento.duration")}</Label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      { v: "15", l: t("agendamento.min15") },
                      { v: "30", l: t("agendamento.min30") },
                      { v: "60", l: t("agendamento.min60") },
                    ].map((d) => (
                      <button
                        key={d.v}
                        type="button"
                        onClick={() => {
                          setDuracao(d.v);
                          setHoraVisita("");
                        }}
                        className={cn(
                          "rounded-lg border px-3 py-2.5 text-sm transition-colors",
                          duracao === d.v
                            ? "border-gold bg-gold/15 text-accent-foreground"
                            : "border-border hover:border-gold/60",
                        )}
                      >
                        {d.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Label className="text-sm">{t("agendamento.time")}</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {horasVisita.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setHoraVisita(h)}
                        className={cn(
                          "rounded-full border px-4 py-1.5 text-sm transition-colors",
                          horaVisita === h
                            ? "border-gold bg-gold/15 text-accent-foreground"
                            : "border-border hover:border-gold/60",
                        )}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Label htmlFor="nome-visita" className="text-sm">
                    {t("agendamento.name")}
                  </Label>
                  <Input
                    id="nome-visita"
                    value={nomeVisita}
                    maxLength={80}
                    onChange={(e) => setNomeVisita(e.target.value)}
                    placeholder={t("agendamento.name")}
                    className="mt-2"
                  />
                </div>

                <Button
                  onClick={() => reservar("visita")}
                  className="mt-6 w-full bg-gold text-accent-foreground hover:bg-gold/90"
                >
                  <CalendarCheck className="mr-2 h-4 w-4" /> {t("agendamento.confirm")}
                </Button>
              </CardContent>
            </Card>
          </Reveal>

          {/* MÓDULO B */}
          <Reveal delay={0.12}>
            <Card className="h-full border-gold/30">
              <CardContent className="p-7">
                <div className="flex items-center gap-3 text-gold">
                  <Clock className="h-5 w-5" />
                  <h2 className="font-display text-2xl">{t("agendamento.confTitle")}</h2>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{t("agendamento.confDesc")}</p>

                <div className="mt-6 flex justify-center rounded-xl border border-border/70 p-2">
                  <Calendar
                    mode="single"
                    selected={diaConf}
                    onSelect={setDiaConf}
                    disabled={{ before: new Date() }}
                  />
                </div>

                <div className="mt-6">
                  <Label className="flex items-center gap-2 text-sm">
                    <Languages className="h-4 w-4 text-gold" /> {t("agendamento.languagePref")}
                  </Label>
                  <Select value={idioma} onValueChange={(v) => setIdioma(v as Idioma)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder={t("agendamento.languagePref")} />
                    </SelectTrigger>
                    <SelectContent>
                      {IDIOMAS.map((i) => (
                        <SelectItem key={i} value={i}>
                          {i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-6">
                  <Label className="text-sm">{t("agendamento.time")}</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {horasConf.map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setHoraConf(h)}
                        className={cn(
                          "rounded-full border px-4 py-1.5 text-sm transition-colors",
                          horaConf === h
                            ? "border-gold bg-gold/15 text-accent-foreground"
                            : "border-border hover:border-gold/60",
                        )}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <Label htmlFor="nome-conf" className="text-sm">
                    {t("agendamento.name")}
                  </Label>
                  <Input
                    id="nome-conf"
                    value={nomeConf}
                    maxLength={80}
                    onChange={(e) => setNomeConf(e.target.value)}
                    placeholder={t("agendamento.name")}
                    className="mt-2"
                  />
                </div>

                <Button
                  onClick={() => reservar("confissao")}
                  className="mt-6 w-full bg-gold text-accent-foreground hover:bg-gold/90"
                >
                  <CalendarCheck className="mr-2 h-4 w-4" /> {t("agendamento.confirm")}
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
