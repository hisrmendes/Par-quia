import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { LangCode } from "@/i18n";

export type Idioma = "Catalão" | "Castelhano" | "Português";

/** Cargos do MVP. */
export const ROLES = ["super", "admin", "contabil", "stream", "jornalista", "voluntario"] as const;
export type Role = (typeof ROLES)[number];

/** Áreas do painel. */
export const AREAS = [
  "avisos",
  "faturamento",
  "transmissao",
  "agenda",
  "conteudo",
  "horarios",
  "equipa",
  "auditoria",
] as const;
export type Area = (typeof AREAS)[number];

export type Access = "read" | "write";

const ROLE_ACCESS: Record<Role, Partial<Record<Area, Access>>> = {
  super: {
    avisos: "write",
    faturamento: "write",
    transmissao: "write",
    agenda: "write",
    conteudo: "write",
    horarios: "write",
    equipa: "write",
    auditoria: "write",
  },
  admin: {
    avisos: "write",
    faturamento: "read",
    transmissao: "read",
    agenda: "write",
    conteudo: "write",
    horarios: "write",
    equipa: "write",
    auditoria: "read",
  },
  contabil: { avisos: "read", faturamento: "write" },
  stream: { avisos: "read", transmissao: "write" },
  jornalista: { avisos: "read", conteudo: "write" },
  voluntario: { avisos: "read", faturamento: "read" },
};

export function roleCan(role: Role, area: Area, mode: Access = "read"): boolean {
  const level = ROLE_ACCESS[role][area];
  if (!level) return false;
  return mode === "read" ? true : level === "write";
}

export type LiveState = {
  active: boolean;
  idioma: Idioma;
  url: string;
  titulo: string;
  descricao: string;
};

export type AdminUser = {
  name: string;
  email: string;
  avatar: string;
  role: Role;
  isSuper: boolean;
};

export type NewsItem = {
  id: string;
  titulo: string;
  data: string; // ISO
  resumo: string;
  tag: string;
};

export type Booking = {
  id: string;
  ticket: string;
  tipo: "visita" | "confissao";
  nome: string;
  email?: string;
  dia: string; // ISO date
  hora: string;
  duracao: number; // minutes
  idioma?: Idioma;
  criadoEm: string;
};

export type TeamMember = {
  id: string;
  nome: string;
  email: string;
  role: Role;
};

/** Texto multilíngue com marcação de traduções pendentes. */
export type I18nText = {
  es: string;
  ca: string;
  pt: string;
  en: string;
  pending?: LangCode[];
};

export type Notice = { id: string; autor: string; data: string; texto: I18nText };
export type AuditEntry = { id: string; autor: string; acao: string; data: string };

/** Bloco de horário (HH:MM). */
export type HourBlock = { inicio: string; fim: string };
/** Índice 0 = domingo … 6 = sábado. */
export type OpeningHours = HourBlock[][];

export type SpecialEvent = {
  id: string;
  nome: string;
  data: string; // ISO date
  inicio: string;
  fim: string;
  descricao: string;
};

export type MonthRevenue = { mes: string; valor: number };

const SUPER_ADMIN_EMAIL = "hisrmendes@gmail.com";

const DEFAULT_LIVE: LiveState = {
  active: true,
  idioma: "Catalão",
  url: "https://www.youtube.com/embed/jfKfPfyJRdk",
  titulo: "Missa Dominical",
  descricao: "Celebração dominical transmitida desde a nave principal.",
};

const DEFAULT_HOURS: OpeningHours = [
  [{ inicio: "10:00", fim: "14:00" }], // domingo
  [
    { inicio: "11:00", fim: "13:00" },
    { inicio: "16:00", fim: "20:00" },
  ],
  [
    { inicio: "11:00", fim: "13:00" },
    { inicio: "16:00", fim: "20:00" },
  ],
  [
    { inicio: "11:00", fim: "13:00" },
    { inicio: "16:00", fim: "20:00" },
  ],
  [
    { inicio: "11:00", fim: "13:00" },
    { inicio: "16:00", fim: "20:00" },
  ],
  [
    { inicio: "11:00", fim: "13:00" },
    { inicio: "16:00", fim: "20:00" },
  ],
  [
    { inicio: "11:00", fim: "13:00" },
    { inicio: "16:00", fim: "20:00" },
  ],
];

const DEFAULT_EVENTS: SpecialEvent[] = [
  {
    id: "e1",
    nome: "Fira de Llibres",
    data: new Date().toISOString().slice(0, 10),
    inicio: "20:00",
    fim: "22:00",
    descricao: "Feira solidária de livros no claustro.",
  },
];

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: "n1",
    titulo: "Concerto de Órgão na Capela do Santíssimo",
    data: "2026-09-12",
    resumo: "Uma noite de música sacra sob as arcadas modernistas de Berenguer.",
    tag: "Música",
  },
  {
    id: "n2",
    titulo: "Visitas guiadas com Albert — nova temporada",
    data: "2026-10-04",
    resumo: "Descubra a joia escondida de Gràcia em grupos reduzidos.",
    tag: "Visitas",
  },
  {
    id: "n3",
    titulo: "Festa Major de Gràcia — Missa solene",
    data: "2026-08-15",
    resumo: "Celebração bilíngue com coro paroquial e procissão.",
    tag: "Celebração",
  },
  {
    id: "n4",
    titulo: "Campanha de Natal — Cáritas Parroquial",
    data: "2025-12-20",
    resumo: "Recolha de alimentos para as famílias do bairro.",
    tag: "Solidariedade",
  },
  {
    id: "n5",
    titulo: "Restauro das vidraças do transepto",
    data: "2026-11-08",
    resumo: "Primeira fase do restauro concluída graças aos donativos.",
    tag: "Obras",
  },
  {
    id: "n6",
    titulo: "Retiro de Quaresma",
    data: "2026-03-01",
    resumo: "Três dias de recolhimento e oração comunitária.",
    tag: "Espiritualidade",
  },
];

function ticketFor(tipo: Booking["tipo"], seed: string) {
  return `${tipo === "visita" ? "VIS" : "CON"}-${seed.slice(0, 4).toUpperCase()}`;
}

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: "b1",
    ticket: "VIS-3F1A",
    tipo: "visita",
    nome: "Família Roca",
    dia: "2026-08-18",
    hora: "11:00",
    duracao: 30,
    criadoEm: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "b2",
    ticket: "VIS-9C77",
    tipo: "visita",
    nome: "Grupo Escolar Gràcia",
    dia: "2026-08-19",
    hora: "12:00",
    duracao: 60,
    criadoEm: "2026-08-02T10:00:00.000Z",
  },
  {
    id: "b3",
    ticket: "CON-51BD",
    tipo: "confissao",
    nome: "M. Puig",
    dia: "2026-08-18",
    hora: "18:10",
    duracao: 10,
    idioma: "Catalão",
    criadoEm: "2026-08-03T10:00:00.000Z",
  },
  {
    id: "b4",
    ticket: "CON-7E20",
    tipo: "confissao",
    nome: "J. Silva",
    dia: "2026-08-20",
    hora: "18:30",
    duracao: 10,
    idioma: "Português",
    criadoEm: "2026-08-04T10:00:00.000Z",
  },
];

const DEFAULT_TEAM: TeamMember[] = [
  { id: "t1", nome: "Albert", email: "albert@gmail.com", role: "jornalista" },
  { id: "t2", nome: "Padre Adilson", email: "adilson@gmail.com", role: "admin" },
  { id: "t3", nome: "Marta Vidal", email: "marta.vidal@gmail.com", role: "contabil" },
  { id: "t4", nome: "Joan Ferrer", email: "joan.ferrer@gmail.com", role: "stream" },
  { id: "t5", nome: "Núria Camps", email: "nuria.camps@gmail.com", role: "voluntario" },
];

const DEFAULT_NOTICES: Notice[] = [
  {
    id: "a1",
    autor: "Sr. Mendes",
    data: "2026-08-10T09:00:00.000Z",
    texto: {
      es: "Reunión de equipo el viernes a las 18h en la sacristía.",
      ca: "Reunió d'equip divendres a les 18h a la sagristia.",
      pt: "Reunião de equipa na sexta às 18h na sacristia.",
      en: "Team meeting on Friday at 6pm in the sacristy.",
    },
  },
  {
    id: "a2",
    autor: "Padre Adilson",
    data: "2026-08-14T08:00:00.000Z",
    texto: {
      es: "Las confesiones del sábado se adelantan una hora.",
      ca: "Les confessions de dissabte s'avancen una hora.",
      pt: "As confissões de sábado são antecipadas uma hora.",
      en: "Saturday confessions are moved one hour earlier.",
    },
  },
];

function makeRevenue(seedStart: number): MonthRevenue[] {
  const meses = ["Jan", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  let seed = seedStart;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return meses.map((mes) => ({ mes, valor: Math.round(400 + rand() * 1600) }));
}

export function textFor(texto: I18nText, lang: string): string {
  const key = (["es", "ca", "pt", "en"] as const).find((l) => l === lang) ?? "es";
  return texto[key] || texto.es;
}

/** Estado da porta da igreja, calculado a partir dos horários e eventos. */
export type ChurchStatus = { open: boolean; evento: string | null };

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":");
  return Number(h) * 60 + Number(m ?? 0);
}

export function computeStatus(
  now: Date,
  hours: OpeningHours,
  events: SpecialEvent[],
  forcedClosed: boolean,
): ChurchStatus {
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const mins = now.getHours() * 60 + now.getMinutes();
  const evento = events.find(
    (e) => e.data === iso && mins >= toMinutes(e.inicio) && mins < toMinutes(e.fim),
  );
  if (forcedClosed) return { open: false, evento: null };
  if (evento) return { open: true, evento: evento.nome };
  const blocks = hours[now.getDay()] ?? [];
  const open = blocks.some((b) => mins >= toMinutes(b.inicio) && mins < toMinutes(b.fim));
  return { open, evento: null };
}

type SiteState = {
  live: LiveState;
  setLive: (next: Partial<LiveState>) => void;
  /** Fecho manual da igreja (sobrepõe-se aos horários). */
  forcedClosed: boolean;
  setForcedClosed: (v: boolean) => void;
  hours: OpeningHours;
  setHours: (hours: OpeningHours) => void;
  events: SpecialEvent[];
  addEvent: (e: Omit<SpecialEvent, "id">) => void;
  removeEvent: (id: string) => void;
  user: AdminUser | null;
  isSuperAdmin: boolean;
  can: (area: Area, mode?: Access) => boolean;
  login: () => void;
  loginAs: (email: string) => void;
  logout: () => void;
  news: NewsItem[];
  addNews: (item: Omit<NewsItem, "id">) => void;
  removeNews: (id: string) => void;
  bookings: Booking[];
  addBooking: (item: Omit<Booking, "id" | "ticket" | "criadoEm">) => Booking;
  team: TeamMember[];
  addTeam: (item: Omit<TeamMember, "id">) => void;
  updateTeamRole: (id: string, role: Role) => void;
  removeTeam: (id: string) => void;
  notices: Notice[];
  addNotice: (texto: string, lang: LangCode, autor?: string) => void;
  removeNotice: (id: string) => void;
  audit: AuditEntry[];
  revenue: MonthRevenue[];
  donationsCount: number;
  /** Atualização automática não-disruptiva. */
  beginEditing: (key: string) => void;
  endEditing: (key: string) => void;
  pendingRefresh: boolean;
  applyRefresh: () => void;
  lastRefresh: string | null;
};

const Ctx = createContext<SiteState | null>(null);

const KEY = "sjg-state-v3";
const REFRESH_MS = 45000;

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function SiteStateProvider({ children }: { children: ReactNode }) {
  const [live, setLiveState] = useState<LiveState>(DEFAULT_LIVE);
  const [forcedClosed, setForcedClosedState] = useState(false);
  const [hours, setHoursState] = useState<OpeningHours>(DEFAULT_HOURS);
  const [events, setEvents] = useState<SpecialEvent[]>(DEFAULT_EVENTS);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [news, setNews] = useState<NewsItem[]>(DEFAULT_NEWS);
  const [bookings, setBookings] = useState<Booking[]>(DEFAULT_BOOKINGS);
  const [team, setTeam] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [notices, setNotices] = useState<Notice[]>(DEFAULT_NOTICES);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [revenue, setRevenue] = useState<MonthRevenue[]>(() => makeRevenue(42));
  const [donationsCount, setDonationsCount] = useState(128);
  const [pendingRefresh, setPendingRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const editing = useRef<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      if (parsed['live']) setLiveState({ ...DEFAULT_LIVE, ...(parsed['live'] as LiveState) });
      if (typeof parsed['forcedClosed'] === "boolean") setForcedClosedState(parsed['forcedClosed']);
      if (parsed['hours']) setHoursState(parsed['hours'] as OpeningHours);
      if (parsed['events']) setEvents(parsed['events'] as SpecialEvent[]);
      if (parsed['user'] !== undefined) setUser(parsed['user'] as AdminUser | null);
      if (parsed['news']) setNews(parsed['news'] as NewsItem[]);
      if (parsed['bookings']) setBookings(parsed['bookings'] as Booking[]);
      if (parsed['team']) setTeam(parsed['team'] as TeamMember[]);
      if (parsed['notices']) setNotices(parsed['notices'] as Notice[]);
      if (parsed['audit']) setAudit(parsed['audit'] as AuditEntry[]);
      if (parsed['revenue']) setRevenue(parsed['revenue'] as MonthRevenue[]);
      if (typeof parsed['donationsCount'] === "number") setDonationsCount(parsed['donationsCount']);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        KEY,
        JSON.stringify({
          live,
          forcedClosed,
          hours,
          events,
          user,
          news,
          bookings,
          team,
          notices,
          audit,
          revenue,
          donationsCount,
        }),
      );
    } catch {
      /* ignore */
    }
  }, [live, forcedClosed, hours, events, user, news, bookings, team, notices, audit, revenue, donationsCount]);

  const runRefresh = useCallback(() => {
    setRevenue((prev) =>
      prev.map((m, i) => (i === new Date().getMonth() ? { ...m, valor: m.valor + Math.round(5 + Math.random() * 60) } : m)),
    );
    setDonationsCount((c) => c + 1);
    setLastRefresh(new Date().toISOString());
    setPendingRefresh(false);
  }, []);

  // Atualização automática: adiada enquanto alguém estiver a escrever.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (editing.current.size > 0) {
        setPendingRefresh(true);
        return;
      }
      runRefresh();
    }, REFRESH_MS);
    return () => window.clearInterval(id);
  }, [runRefresh]);

  const log = useCallback(
    (acao: string) => {
      setAudit((prev) =>
        [
          { id: newId(), autor: user?.email ?? "público", acao, data: new Date().toISOString() },
          ...prev,
        ].slice(0, 200),
      );
    },
    [user],
  );

  const setLive = useCallback(
    (next: Partial<LiveState>) => {
      setLiveState((prev) => ({ ...prev, ...next }));
      log(`Atualizou a transmissão (${Object.keys(next).join(", ")})`);
    },
    [log],
  );

  const setForcedClosed = useCallback(
    (v: boolean) => {
      setForcedClosedState(v);
      log(v ? "Fechou a igreja manualmente" : "Reativou os horários normais");
    },
    [log],
  );

  const loginAs = useCallback(
    (rawEmail: string) => {
      const email = rawEmail.trim().toLowerCase();
      const isSuper = email === SUPER_ADMIN_EMAIL;
      const member = team.find((t) => t.email.toLowerCase() === email);
      setUser({
        name: isSuper ? "Sr. Mendes" : (member?.nome ?? email.split("@")[0] ?? "Voluntário"),
        email,
        avatar: email.slice(0, 1).toUpperCase(),
        role: isSuper ? "super" : (member?.role ?? "voluntario"),
        isSuper,
      });
      setAudit((prev) =>
        [
          { id: newId(), autor: email, acao: "Iniciou sessão", data: new Date().toISOString() },
          ...prev,
        ].slice(0, 200),
      );
    },
    [team],
  );

  const value = useMemo<SiteState>(
    () => ({
      live,
      setLive,
      forcedClosed,
      setForcedClosed,
      hours,
      setHours: (next) => {
        setHoursState(next);
        log("Atualizou os horários de abertura");
      },
      events,
      addEvent: (e) => {
        setEvents((p) => [...p, { ...e, id: newId() }]);
        log(`Criou o evento "${e.nome}"`);
      },
      removeEvent: (id) => {
        setEvents((p) => p.filter((e) => e.id !== id));
        log("Removeu um evento especial");
      },
      user,
      isSuperAdmin: !!user?.isSuper,
      can: (area, mode = "read") => !!user && roleCan(user.role, area, mode),
      login: () => loginAs(SUPER_ADMIN_EMAIL),
      loginAs,
      logout: () => {
        log("Encerrou sessão");
        setUser(null);
      },
      news,
      addNews: (item) => {
        setNews((p) => [{ ...item, id: newId() }, ...p]);
        log(`Publicou a notícia "${item.titulo}"`);
      },
      removeNews: (id) => {
        setNews((p) => p.filter((n) => n.id !== id));
        log("Removeu uma notícia");
      },
      bookings,
      addBooking: (item) => {
        const id = newId();
        const booking: Booking = {
          ...item,
          id,
          ticket: ticketFor(item.tipo, id.replace(/-/g, "")),
          criadoEm: new Date().toISOString(),
        };
        setBookings((p) => [...p, booking]);
        setAudit((prev) =>
          [
            {
              id: newId(),
              autor: item.email ?? item.nome,
              acao: `Nova reserva ${booking.ticket}`,
              data: new Date().toISOString(),
            },
            ...prev,
          ].slice(0, 200),
        );
        return booking;
      },
      team,
      addTeam: (item) => {
        setTeam((p) => [...p, { ...item, id: newId() }]);
        log(`Adicionou ${item.email} à equipa (${item.role})`);
      },
      updateTeamRole: (id, role) => {
        setTeam((p) => p.map((t) => (t.id === id ? { ...t, role } : t)));
        log("Atualizou o cargo de um membro");
      },
      removeTeam: (id) => {
        setTeam((p) => p.filter((t) => t.id !== id));
        log("Removeu um membro da equipa");
      },
      notices,
      addNotice: (texto, lang, autor) => {
        const base: I18nText = { es: texto, ca: texto, pt: texto, en: texto };
        base[lang] = texto;
        base.pending = (["es", "ca", "pt", "en"] as LangCode[]).filter((l) => l !== lang);
        setNotices((p) => [
          { id: newId(), autor: autor ?? user?.name ?? "Equipa", data: new Date().toISOString(), texto: base },
          ...p,
        ]);
        log("Publicou um aviso interno");
      },
      removeNotice: (id) => {
        setNotices((p) => p.filter((n) => n.id !== id));
        log("Removeu um aviso interno");
      },
      audit,
      revenue,
      donationsCount,
      beginEditing: (key) => editing.current.add(key),
      endEditing: (key) => editing.current.delete(key),
      pendingRefresh,
      applyRefresh: runRefresh,
      lastRefresh,
    }),
    [
      live,
      setLive,
      forcedClosed,
      setForcedClosed,
      hours,
      events,
      user,
      loginAs,
      news,
      bookings,
      team,
      notices,
      audit,
      revenue,
      donationsCount,
      pendingRefresh,
      lastRefresh,
      runRefresh,
      log,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSite() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSite must be used within SiteStateProvider");
  return ctx;
}

/** Estado atual da igreja, recalculado a cada minuto (apenas no cliente). */
export function useChurchStatus(): ChurchStatus | null {
  const { hours, events, forcedClosed } = useSite();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(id);
  }, []);

  return useMemo(
    () => (now ? computeStatus(now, hours, events, forcedClosed) : null),
    [now, hours, events, forcedClosed],
  );
}
