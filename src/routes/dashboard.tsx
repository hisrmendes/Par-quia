import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import {
  BarChart3,
  BellRing,
  CalendarRange,
  FileText,
  LogOut,
  Radio,
  ShieldCheck,
  Trash2,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import type { LangCode } from "@/i18n";
import { PageTransition, Reveal } from "@/components/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ROLES,
  textFor,
  useSite,
  type Booking,
  type Idioma,
  type Role,
} from "@/lib/site-state";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Painel de gestão — Sant Joan de Gràcia" },
      { name: "description", content: "Gestão de transmissões, agenda e conteúdos da paróquia." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Painel de gestão" },
      { property: "og:description", content: "Área reservada à equipa paroquial." },
    ],
  }),
  component: Dashboard,
});

const IDIOMAS: Idioma[] = ["Catalão", "Castelhano", "Português"];

const teamSchema = z.object({
  nome: z.string().trim().min(1),
  email: z.string().trim().email().refine((v) => v.toLowerCase().endsWith("@gmail.com"), {
    message: "gmail",
  }),
});

function Dashboard() {
  const { t } = useTranslation();
  const {
    user,
    isSuperAdmin,
    can,
    logout,
    live,
    setLive,
    news,
    addNews,
    removeNews,
    bookings,
    team,
    addTeam,
    updateTeamRole,
    removeTeam,
    notices,
    addNotice,
    removeNotice,
    audit,
  } = useSite();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) void navigate({ to: "/admin-auth" });
  }, [user, navigate]);

  if (!user) return null;

  return (
    <PageTransition>
      <DashboardBody
        user={user}
        isSuperAdmin={isSuperAdmin}
        can={can}
        logout={logout}
        live={live}
        setLive={setLive}
        news={news}
        addNews={addNews}
        removeNews={removeNews}
        bookings={bookings}
        team={team}
        addTeam={addTeam}
        updateTeamRole={updateTeamRole}
        removeTeam={removeTeam}
        notices={notices}
        addNotice={addNotice}
        removeNotice={removeNotice}
        audit={audit}
        t={t}
        navigate={navigate}
      />
    </PageTransition>
  );
}

type SiteCtx = ReturnType<typeof useSite>;

function DashboardBody({
  user,
  isSuperAdmin,
  can,
  logout,
  live,
  setLive,
  news,
  addNews,
  removeNews,
  bookings,
  team,
  addTeam,
  updateTeamRole,
  removeTeam,
  notices,
  addNotice,
  removeNotice,
  audit,
  t,
  navigate,
}: {
  user: NonNullable<SiteCtx["user"]>;
  isSuperAdmin: boolean;
  can: SiteCtx["can"];
  logout: SiteCtx["logout"];
  live: SiteCtx["live"];
  setLive: SiteCtx["setLive"];
  news: SiteCtx["news"];
  addNews: SiteCtx["addNews"];
  removeNews: SiteCtx["removeNews"];
  bookings: SiteCtx["bookings"];
  team: SiteCtx["team"];
  addTeam: SiteCtx["addTeam"];
  updateTeamRole: SiteCtx["updateTeamRole"];
  removeTeam: SiteCtx["removeTeam"];
  notices: SiteCtx["notices"];
  addNotice: SiteCtx["addNotice"];
  removeNotice: SiteCtx["removeNotice"];
  audit: SiteCtx["audit"];
  t: ReturnType<typeof useTranslation>["t"];
  navigate: ReturnType<typeof useNavigate>;
}) {
  const { i18n } = useTranslation();
  const { beginEditing, endEditing, pendingRefresh, applyRefresh } = useSite();
  const [avisoTexto, setAvisoTexto] = useState("");
  const [titulo, setTitulo] = useState("");
  const [resumo, setResumo] = useState("");
  const [dataEv, setDataEv] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoErro, setNovoErro] = useState("");
  const [novoRole, setNovoRole] = useState<Role>("voluntario");
  const [selecionado, setSelecionado] = useState<Booking | null>(null);

  const visibleTeam = useMemo(() => team.filter((m) => m.email.toLowerCase() !== "hisrmendes@gmail.com"), [team]);

  const semana = useMemo(() => {
    const base = new Date();
    const monday = new Date(base);
    monday.setDate(base.getDate() - ((base.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, []);

  const scope = useMemo<"all" | "visita" | "confissao">(() => {
    if (isSuperAdmin) return "all";
    if (user.name.includes("Albert")) return "visita";
    if (user.name.includes("Adilson")) return "confissao";
    return "all";
  }, [isSuperAdmin, user.name]);


  const bookingsVisiveis = useMemo(
    () => (scope === "all" ? bookings : bookings.filter((b) => b.tipo === scope)),
    [bookings, scope],
  );

  const faturamento = useMemo(() => {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const mensal = meses.map((m) => ({ mes: m, valor: Math.round(400 + rand() * 1600) }));
    const totalDoacoes = Math.round(80 + rand() * 120);
    const receitaTotal = mensal.reduce((acc, m) => acc + m.valor, 0);
    const media = Math.round(receitaTotal / totalDoacoes);
    return { mensal, totalDoacoes, receitaTotal, media };
  }, []);

  const roleLabel = t(`role.${user.role}`);

  const handleAddTeam = () => {
    const parsed = teamSchema.safeParse({ nome: novoNome, email: novoEmail });
    if (!novoNome.trim()) {
      setNovoErro(t("dash.teamNameRequired"));
      return;
    }
    if (!parsed.success) {
      setNovoErro(t("dash.teamInvalidEmail"));
      return;
    }
    addTeam({
      nome: novoNome.trim(),
      email: novoEmail.trim().toLowerCase(),
      role: novoRole,
    });
    setNovoNome("");
    setNovoEmail("");
    setNovoRole("voluntario");
    setNovoErro("");
    toast.success(t("dash.teamAdded"));
  };

  const downloadTicket = async (b: Booking) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Sant Joan de Gràcia", 20, 25);
    doc.setFontSize(12);
    doc.text(`${t("dash.agendaTicket")}: ${b.ticket}`, 20, 40);
    doc.text(`${t("dash.agendaType")}: ${b.tipo === "visita" ? t("dash.tipoVisita") : t("dash.tipoConfissao")}`, 20, 50);
    doc.text(`${t("dash.agendaName")}: ${b.nome}`, 20, 60);
    if (b.email) doc.text(`${t("dash.agendaEmail")}: ${b.email}`, 20, 70);
    doc.text(`${t("dash.agendaDay")}: ${b.dia}`, 20, 80);
    doc.text(`${t("dash.agendaTime")}: ${b.hora}`, 20, 90);
    doc.text(`${t("dash.agendaDuration")}: ${b.duracao} min`, 20, 100);
    if (b.idioma) doc.text(`${t("dash.agendaLanguage")}: ${b.idioma}`, 20, 110);
    doc.save(`${b.ticket}.pdf`);
  };

  const tabs: { value: string; icon: ReactElement; label: string; show: boolean }[] = [
    { value: "avisos", icon: <BellRing className="mr-2 h-4 w-4" />, label: t("dash.tabs.avisos"), show: true },
    { value: "live", icon: <Radio className="mr-2 h-4 w-4" />, label: t("dash.tabs.live"), show: can("transmissao") },
    { value: "faturamento", icon: <BarChart3 className="mr-2 h-4 w-4" />, label: t("dash.tabs.faturamento"), show: can("faturamento") },
    { value: "agenda", icon: <CalendarRange className="mr-2 h-4 w-4" />, label: t("dash.tabs.agenda"), show: can("agenda") },
    { value: "conteudo", icon: <FileText className="mr-2 h-4 w-4" />, label: t("dash.tabs.conteudo"), show: can("conteudo") },
    { value: "equipa", icon: <UserPlus className="mr-2 h-4 w-4" />, label: t("dash.tabs.equipa"), show: can("equipa") },
    { value: "auditoria", icon: <ShieldCheck className="mr-2 h-4 w-4" />, label: t("dash.tabs.auditoria"), show: isSuperAdmin },
  ];

  const defaultTab = tabs.find((tab) => tab.show)?.value ?? "avisos";

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl">{t("dash.welcome", { name: user.name })}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {user.email}
              <Badge className="bg-gold/20 text-accent-foreground">{roleLabel}</Badge>
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              logout();
              toast.success(t("dash.signedOut"));
              void navigate({ to: "/" });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> {t("dash.signOut")}
          </Button>
        </div>
      </Reveal>

      {pendingRefresh && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm">
          <span>{t("dash.refreshPending")}</span>
          <Button size="sm" variant="outline" onClick={applyRefresh}>
            {t("dash.refreshApply")}
          </Button>
        </div>
      )}

      <Tabs defaultValue={defaultTab} className="mt-8">
        <TabsList className="flex h-auto flex-wrap justify-start">
          {tabs
            .filter((tab) => tab.show)
            .map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
        </TabsList>

        {/* AVISOS */}
        <TabsContent value="avisos" className="mt-6">
          <Card className="border-gold/25">
            <CardContent className="p-6">
              <h3 className="font-display text-2xl">{t("dash.tabs.avisos")}</h3>
              <div className="mt-4 space-y-3">
                <Textarea
                  value={avisoTexto}
                  onFocus={() => beginEditing("aviso")}
                  onBlur={() => endEditing("aviso")}
                  onChange={(e) => setAvisoTexto(e.target.value)}
                  placeholder={t("dash.avisosPlaceholder")}
                />
                <Button
                  className="bg-gold text-accent-foreground hover:bg-gold/90"
                  onClick={() => {
                    if (!avisoTexto.trim()) return;
                    addNotice(avisoTexto.trim(), (i18n.resolvedLanguage ?? "es") as LangCode);
                    setAvisoTexto("");
                    toast.success(t("dash.avisosNew"));
                  }}
                >
                  {t("dash.avisosPublish")}
                </Button>
              </div>
              <div className="mt-6 divide-y divide-border/70">
                {notices.length === 0 && (
                  <p className="py-4 text-sm text-muted-foreground">{t("dash.avisosEmpty")}</p>
                )}
                {notices.map((n) => (
                  <div key={n.id} className="flex items-start justify-between gap-3 py-3 text-sm">
                    <div>
                      <p>{textFor(n.texto, i18n.resolvedLanguage ?? "es")}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("dash.avisosBy", { autor: n.autor })} · {new Date(n.data).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeNotice(n.id)}
                      aria-label="remove"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LIVE */}
        {can("transmissao") && (
          <TabsContent value="live" className="mt-6">
            <Card className="border-gold/30">
              <CardContent className="space-y-6 p-7">
                <div className="flex items-center justify-between rounded-xl border border-border/70 p-5">
                  <div>
                    <h2 className="font-display text-2xl">{t("dash.liveMaster")}</h2>
                    <p className="text-sm text-muted-foreground">{t("dash.liveMasterDesc")}</p>
                  </div>
                  <Switch
                    checked={live.active}
                    onCheckedChange={(v) => {
                      setLive({ active: v });
                      toast.success(v ? t("dash.liveActivated") : t("dash.liveDeactivated"));
                    }}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Label htmlFor="url">{t("dash.liveUrl")}</Label>
                    <Input
                      id="url"
                      value={live.url}
                      onChange={(e) => setLive({ url: e.target.value })}
                      placeholder="https://www.youtube.com/embed/…"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="titulo-live">{t("dash.liveTitle")}</Label>
                    <Input
                      id="titulo-live"
                      value={live.titulo}
                      onChange={(e) => setLive({ titulo: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="descricao-live">{t("dash.liveDesc")}</Label>
                    <Textarea
                      id="descricao-live"
                      value={live.descricao}
                      onChange={(e) => setLive({ descricao: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>{t("dash.liveLang")}</Label>
                    <Select value={live.idioma} onValueChange={(v) => setLive({ idioma: v as Idioma })}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {IDIOMAS.map((i) => (
                          <SelectItem key={i} value={i}>
                            {t(`idioma.${i}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* FATURAMENTO */}
        {can("faturamento") && (
          <TabsContent value="faturamento" className="mt-6">
            <div className="grid gap-5 sm:grid-cols-3">
              <Card className="border-gold/25">
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {t("dash.revenueTotal")}
                  </p>
                  <p className="mt-3 font-display text-4xl">{faturamento.receitaTotal.toLocaleString()}€</p>
                </CardContent>
              </Card>
              <Card className="border-gold/25">
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {t("dash.donationsCount")}
                  </p>
                  <p className="mt-3 font-display text-4xl">{faturamento.totalDoacoes}</p>
                </CardContent>
              </Card>
              <Card className="border-gold/25">
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {t("dash.avgDonation")}
                  </p>
                  <p className="mt-3 font-display text-4xl">{faturamento.media}€</p>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-6 border-gold/25">
              <CardContent className="p-6">
                <h3 className="font-display text-2xl">{t("dash.revenueTitle")}</h3>
                <div className="mt-5 space-y-2">
                  {faturamento.mensal.map((m) => (
                    <div key={m.mes} className="flex items-center gap-3">
                      <span className="w-10 text-xs text-muted-foreground">{m.mes}</span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-border/50">
                        <div
                          className="h-full rounded-full bg-gold"
                          style={{ width: `${Math.min(100, (m.valor / 2000) * 100)}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-xs text-muted-foreground">{m.valor}€</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* AGENDA */}
        {can("agenda") && (
          <TabsContent value="agenda" className="mt-6">
            <Card className="border-gold/25">
              <CardContent className="p-6">
                <h3 className="font-display text-2xl">{t("dash.tabs.agenda")}</h3>
                <div className="mt-5 grid gap-3 md:grid-cols-7">
                  {semana.map((d) => {
                    const iso = d.toISOString().slice(0, 10);
                    const doDia = bookingsVisiveis.filter((b) => b.dia === iso);
                    return (
                      <div key={iso} className="rounded-xl border border-border/70 p-3">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                          {d.toLocaleDateString("pt-PT", { weekday: "short" })}
                        </p>
                        <p className="font-display text-2xl">{d.getDate()}</p>
                        <div className="mt-3 space-y-2">
                          {doDia.length === 0 && (
                            <p className="text-xs text-muted-foreground">{t("dash.agendaEmpty")}</p>
                          )}
                          {doDia.map((b) => (
                            <button
                              key={b.id}
                              onClick={() => setSelecionado(b)}
                              className={
                                b.tipo === "visita"
                                  ? "w-full rounded-md border-l-2 border-gold bg-gold/10 p-2 text-left text-[11px] transition hover:bg-gold/20"
                                  : "w-full rounded-md border-l-2 border-blue-peace bg-blue-peace/10 p-2 text-left text-[11px] transition hover:bg-blue-peace/20"
                              }
                            >
                              <p className="font-medium">
                                {b.hora} · {b.duracao}min
                              </p>
                              <p className="text-muted-foreground">{b.nome}</p>
                              <p className="text-muted-foreground">{b.ticket}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* CONTEÚDO */}
        {can("conteudo") && (
          <TabsContent value="conteudo" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-gold/25">
                <CardContent className="p-6">
                  <h3 className="font-display text-2xl">{t("dash.contentPublish")}</h3>
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="t">{t("dash.contentTitle")}</Label>
                      <Input
                        id="t"
                        value={titulo}
                        maxLength={120}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="d">{t("dash.contentDate")}</Label>
                      <Input
                        id="d"
                        type="date"
                        value={dataEv}
                        onChange={(e) => setDataEv(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="r">{t("dash.contentSummary")}</Label>
                      <Textarea
                        id="r"
                        value={resumo}
                        maxLength={400}
                        onChange={(e) => setResumo(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <Button
                      className="w-full bg-gold text-accent-foreground hover:bg-gold/90"
                      onClick={() => {
                        if (!titulo.trim() || !dataEv) {
                          toast.error(t("dash.newsRequired"));
                          return;
                        }
                        addNews({
                          titulo: titulo.trim(),
                          data: dataEv,
                          resumo: resumo.trim(),
                          tag: "Notícia",
                        });
                        setTitulo("");
                        setResumo("");
                        setDataEv("");
                        toast.success(t("dash.newsPublished"));
                      }}
                    >
                      {t("dash.contentPublish")}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-gold/25">
                  <CardContent className="p-6">
                    <h3 className="font-display text-2xl">{t("dash.contentPublished")}</h3>
                    <div className="mt-4 max-h-72 space-y-2 overflow-auto">
                      {news.map((n) => (
                        <div
                          key={n.id}
                          className="flex items-center justify-between rounded-lg border border-border/70 p-3 text-sm"
                        >
                          <span className="truncate pr-3">{n.titulo}</span>
                          <button
                            onClick={() => removeNews(n.id)}
                            aria-label={`Remover ${n.titulo}`}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gold/25">
                  <CardContent className="flex flex-wrap items-center gap-3 p-6">
                    <Button asChild variant="outline">
                      <a href="/full-parroquial.pdf" target="_blank" rel="noreferrer">
                        <FileText className="mr-2 h-4 w-4" /> {t("dash.contentFullParroquial")}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        )}

        {/* EQUIPA */}
        {can("equipa") && (
          <TabsContent value="equipa" className="mt-6">
            <Card className="border-gold/25">
              <CardContent className="p-6">
                <h3 className="font-display text-2xl">{t("dash.teamAdd")}</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  <div>
                    <Input
                      value={novoNome}
                      onChange={(e) => setNovoNome(e.target.value)}
                      placeholder={t("dash.teamName")}
                      className="w-48"
                    />
                  </div>
                  <div>
                    <Input
                      value={novoEmail}
                      onChange={(e) => setNovoEmail(e.target.value)}
                      placeholder={t("dash.teamEmail")}
                      className="w-64"
                    />
                  </div>
                  <Button
                    className="bg-gold text-accent-foreground hover:bg-gold/90"
                    onClick={handleAddTeam}
                  >
                    <UserPlus className="mr-2 h-4 w-4" /> {t("dash.teamAdd")}
                  </Button>
                </div>
                {novoErro && <p className="mt-2 text-sm text-destructive">{novoErro}</p>}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Label className="text-sm">{t("dash.teamRole")}</Label>
                  <Select value={novoRole} onValueChange={(v) => setNovoRole(v as Role)}>
                    <SelectTrigger className="w-56">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.filter((r) => r !== "super").map((r) => (
                        <SelectItem key={r} value={r}>
                          {t(`role.${r}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-6">
                  <h4 className="font-display text-xl">{t("dash.teamList")}</h4>
                  <div className="mt-3 divide-y divide-border/70">
                    {visibleTeam.map((mtitle) => (
                      <TeamRow
                        key={mtitle.id}
                        member={mtitle}
                        onUpdate={updateTeamRole}
                        onRemove={removeTeam}
                        t={t}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* AUDITORIA */}
        {isSuperAdmin && (
          <TabsContent value="auditoria" className="mt-6">
            <Card className="border-gold/25">
              <CardContent className="p-6">
                <h3 className="font-display text-2xl">{t("dash.auditTitle")}</h3>
                {audit.length === 0 ? (
                  <p className="mt-4 text-sm text-muted-foreground">{t("dash.auditEmpty")}</p>
                ) : (
                  <Table className="mt-4">
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("dash.who")}</TableHead>
                        <TableHead>{t("dash.what")}</TableHead>
                        <TableHead>{t("dash.when")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...audit]
                        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                        .map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{entry.autor}</TableCell>
                            <TableCell>{entry.acao}</TableCell>
                            <TableCell>{new Date(entry.data).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={!!selecionado} onOpenChange={(open) => !open && setSelecionado(null)}>
        <DialogContent className="sm:max-w-md">
          {selecionado && (
            <>
              <DialogHeader>
                <DialogTitle>{t("dash.agendaDetails")}</DialogTitle>
                <DialogDescription>{selecionado.ticket}</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">{t("dash.agendaType")}: </span>
                  {selecionado.tipo === "visita" ? t("dash.tipoVisita") : t("dash.tipoConfissao")}
                </p>
                <p>
                  <span className="text-muted-foreground">{t("dash.agendaName")}: </span>
                  {selecionado.nome}
                </p>
                {selecionado.email && (
                  <p>
                    <span className="text-muted-foreground">{t("dash.agendaEmail")}: </span>
                    {selecionado.email}
                  </p>
                )}
                <p>
                  <span className="text-muted-foreground">{t("dash.agendaDay")}: </span>
                  {selecionado.dia}
                </p>
                <p>
                  <span className="text-muted-foreground">{t("dash.agendaTime")}: </span>
                  {selecionado.hora}
                </p>
                <p>
                  <span className="text-muted-foreground">{t("dash.agendaDuration")}: </span>
                  {selecionado.duracao} min
                </p>
                {selecionado.idioma && (
                  <p>
                    <span className="text-muted-foreground">{t("dash.agendaLanguage")}: </span>
                    {t(`idioma.${selecionado.idioma}`)}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  className="bg-gold text-accent-foreground hover:bg-gold/90"
                  onClick={() => void downloadTicket(selecionado)}
                >
                  {t("dash.agendaDownload")}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function TeamRow({
  member,
  onUpdate,
  onRemove,
  t,
}: {
  member: SiteCtx["team"][number];
  onUpdate: SiteCtx["updateTeamRole"];
  onRemove: SiteCtx["removeTeam"];
  t: ReturnType<typeof useTranslation>["t"];
}) {
  return (
    <div className="flex flex-col gap-3 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">{member.nome}</p>
        <p className="text-muted-foreground">{member.email}</p>
        <Badge variant="secondary" className="mt-1">
          {t(`role.${member.role}`)}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Select value={member.role} onValueChange={(v) => onUpdate(member.id, v as Role)}>
          <SelectTrigger className="w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.filter((r) => r !== "super").map((r) => (
              <SelectItem key={r} value={r}>
                {t(`role.${r}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          onClick={() => onRemove(member.id)}
          aria-label={`Remover ${member.nome}`}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
