import { Home, Settings, Trophy } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";

const items = [
  { to: "/" as const, label: "Home", icon: Home },
  { to: "/tournaments" as const, label: "Tornei", icon: Trophy },
  { to: "/settings" as const, label: "Impostazioni", icon: Settings },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname.startsWith("/torneo/") || pathname === "/auth" || pathname === "/pro") return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur" aria-label="Navigazione principale">
      <div className="mx-auto grid h-16 w-full max-w-lg grid-cols-3">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 text-[10px] font-semibold ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}