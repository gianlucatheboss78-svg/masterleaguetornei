import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase-safe";
import { useSession, signOut } from "@/lib/auth";
import { syncFromCloud } from "@/lib/store";
import { LOGO_URL } from "@/components/AppHeader";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Accedi — Master League Tornei" },
      {
        name: "description",
        content:
          "Accedi a Master League Tornei per salvare tornei, squadre, calendari e classifiche online e ritrovarli su ogni dispositivo.",
      },
      { property: "og:title", content: "Accedi a Master League Tornei" },
      {
        property: "og:description",
        content: "Sincronizza i tuoi tornei tra telefono, tablet e computer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const { user, ready } = useSession();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) void syncFromCloud();
  }, [user]);

  const submit = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      setMsg("Servizio account non disponibile. Riprova più tardi.");
      return;
    }
    setBusy(true);
    setMsg("");
    const fn =
      mode === "in"
        ? supabase.auth.signInWithPassword({ email: email.trim(), password })
        : supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { emailRedirectTo: `${window.location.origin}/` },
          });
    const { data, error } = await fn;
    setBusy(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    if (mode === "up" && !data.session) {
      setMsg("Controlla la tua email per confermare l'account.");
      return;
    }
    await syncFromCloud();
    nav({ to: "/" });
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-sm px-4 pb-24 pt-10">
      <img
        src={LOGO_URL}
        alt="Master League Tornei"
        className="mx-auto h-24 w-24 rounded-3xl border border-primary/40 object-cover"
      />
      <h1 className="mt-4 text-center text-2xl gold-text">Master League</h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Accedi per salvare i tuoi tornei online e ritrovarli su ogni dispositivo.
      </p>

      {ready && user ? (
        <div className="card-night mt-6 space-y-3 p-5 text-center">
          <p className="text-sm text-muted-foreground">Sei connesso come</p>
          <p className="display text-base text-primary">{user.email}</p>
          <button
            className="btn-gold w-full py-3"
            onClick={async () => {
              await syncFromCloud();
              setMsg("Dati sincronizzati.");
            }}
          >
            Sincronizza adesso
          </button>
          <button
            className="btn-ghost-gold w-full py-3"
            onClick={async () => {
              await signOut();
              nav({ to: "/" });
            }}
          >
            Esci
          </button>
          {msg && <p className="text-xs text-muted-foreground">{msg}</p>}
        </div>
      ) : (
        <div className="card-night mt-6 space-y-3 p-5">
          <input
            className="field"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="field"
            type="password"
            autoComplete={mode === "in" ? "current-password" : "new-password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn-gold w-full py-3" disabled={busy} onClick={submit}>
            {mode === "in" ? "Accedi" : "Crea account"}
          </button>
          <button
            className="w-full text-center text-xs text-primary"
            onClick={() => {
              setMode(mode === "in" ? "up" : "in");
              setMsg("");
            }}
          >
            {mode === "in" ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
          </button>
          {msg && <p className="text-center text-xs text-destructive">{msg}</p>}
        </div>
      )}
    </main>
  );
}
