import { Link } from "@tanstack/react-router";
import { CloudOff, UserRound } from "lucide-react";
import logoAsset from "@/assets/master-league-logo.jpg.asset.json";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useSession } from "@/lib/auth";

export const LOGO_URL = logoAsset.url;

export function AppHeader() {
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
        <LanguageSwitcher />
      </div>
    </header>
  );
}
