import { Link, useRouter } from "@tanstack/react-router";
import { Menu, X, Globe, DoorOpen, DoorClosed } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSite, useChurchStatus } from "@/lib/site-state";
import { LANGS, setLang, type LangCode } from "@/i18n";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/historia", key: "nav.historia" },
  { to: "/galeria", key: "nav.galeria" },
  { to: "/agendamento", key: "nav.agendamento" },
  { to: "/doacoes", key: "nav.doacoes" },
  { to: "/contato", key: "nav.contato" },
] as const;

function LiveBadge({ onNavigate }: { onNavigate?: () => void }) {
  const { live } = useSite();
  const { t } = useTranslation();
  if (!live.active) return null;
  return (
    <Link
      to="/ao-vivo"
      onClick={onNavigate}
      className="animate-live inline-flex items-center gap-2 rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold tracking-wide text-destructive-foreground transition-transform hover:scale-[1.03]"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive-foreground/70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive-foreground" />
      </span>
      {t("nav.live", { idioma: t(`idioma.${live.idioma}`) })}
    </Link>
  );
}

function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const { i18n } = useTranslation();
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-border/70 bg-background/40 p-1",
        compact && "w-full justify-center",
      )}
    >
      <Globe className="ml-1 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code as LangCode)}
          aria-label={l.name}
          aria-pressed={i18n.resolvedLanguage === l.code}
          className={cn(
            "rounded-full px-2 py-1 text-[11px] font-semibold tracking-wider transition-colors",
            i18n.resolvedLanguage === l.code
              ? "bg-gold text-accent-foreground"
              : "text-muted-foreground hover:text-gold",
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function OpenStatusToggle() {
  const { user, forcedClosed, setForcedClosed } = useSite();
  const status = useChurchStatus();
  const { t } = useTranslation();
  if (!user?.isSuper || !status) return null;
  const label = status.evento
    ? `${t("status.open")} — ${status.evento}`
    : status.open
      ? t("status.open")
      : t("status.closed");
  return (
    <button
      type="button"
      onClick={() => setForcedClosed(!forcedClosed)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
        status.open
          ? "bg-emerald-600 text-white hover:bg-emerald-700"
          : "bg-red-600 text-white hover:bg-red-700",
      )}
    >
      {status.open ? <DoorOpen className="h-3.5 w-3.5" /> : <DoorClosed className="h-3.5 w-3.5" />}
      {label}
    </button>
  );
}


export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const goHome = (e: React.MouseEvent) => {
    setOpen(false);
    if (router.state.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="glass sticky top-0 z-50 border-b border-border/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" onClick={goHome} aria-label={t("nav.home")} className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 text-gold">
            <span className="font-display text-lg leading-none">✝</span>
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block font-display text-lg font-semibold">Sant Joan de Gràcia</span>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Paròquia · Barcelona
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-gold" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/75 transition-colors hover:text-gold"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 xl:ml-3">
          <div className="hidden md:block">
            <OpenStatusToggle />
          </div>
          <div className="hidden sm:block">
            <LiveBadge />
          </div>
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
          <button
            aria-label={open ? t("nav.close") : t("nav.menu")}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-foreground/80 transition-colors hover:text-gold"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-16 z-40 overflow-y-auto bg-background/90 backdrop-blur-xl"
            onClick={() => setOpen(false)}
          >
            <motion.nav
              onClick={(e) => e.stopPropagation()}
              className="mx-auto flex max-w-7xl flex-col items-start gap-1 px-6 py-10"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            >
              {NAV.map((item) => (
                <motion.div
                  key={item.to}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    activeProps={{ className: "text-gold" }}
                    className="block py-3 font-display text-4xl text-foreground/85 transition-colors hover:text-gold"
                  >
                    {t(item.key)}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                className="mt-8 w-full max-w-xs lg:hidden"
              >
                <LanguageSwitcher compact />
              </motion.div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                className="mt-6 flex flex-wrap items-center gap-3 md:hidden"
              >
                <OpenStatusToggle />
                <LiveBadge onNavigate={() => setOpen(false)} />
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>

  );
}
