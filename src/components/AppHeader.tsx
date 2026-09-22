import { Link } from "@tanstack/react-router";
import { CloudOff, UserRound } from "lucide-react";
import logoAsset from "@/assets/master-league-logo.jpg.asset.json";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useSession } from "@/lib/auth";

export const LOGO_URL = logoAsset.url;

export function AppHeader() {
  const { user } = useSession();
  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-3 px-4 py-2">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={LOGO_URL}
            alt="Master League Tornei"
            className="h-10 w-10 rounded-xl border border-primary/40 object-cover"
          />
          <span className="display text-sm leading-tight text-primary">Master League</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            to="/auth"
            aria-label="Account"
            title={user?.email ?? "Accedi"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 text-primary"
          >
            {user ? (
              <UserRound className="h-4 w-4" aria-hidden="true" />
            ) : (
              <CloudOff className="h-4 w-4" aria-hidden="true" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
