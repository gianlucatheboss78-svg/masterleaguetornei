# Master League Tornei

App per la creazione e gestione di tornei sportivi (15 sport), con squadre e giocatori illimitati, calendario, partite live, classifiche automatiche, gestione quote di iscrizione e locandine automatiche.

## Stack

- TanStack Start (React 19, Vite 7)
- Tailwind CSS v4
- Tema oro (#D4AF37) e blu notte (#0A1931)
- 6 lingue: Italiano, Inglese, Spagnolo, Francese, Portoghese, Cinese

## Sviluppo

```bash
bun install
bun run dev
```

## Note

## Android / Capacitor

Nel progetto Android **esistente**, mantenere package name e keystore originali.
Non eseguire `cap init` o creare un'altra app. La configurazione di questo repository
imposta solo `webDir: "dist"`: se la configurazione sul PC contiene già `appId`,
`appName` o altre opzioni native, conservarle e cambiare solo `webDir`.

```bash
npm install
npm run build:mobile
npx cap copy android
```

`build:mobile` produce una SPA client-only in `dist`, con `dist/index.html`,
JavaScript, CSS e icone. Non copiare `build` (è l'output web del server).
La normale build del sito rimane `npm run build` e usa il suo file Vite originale.
Risultati condivisi, aggiornamenti live e account richiedono ancora Internet;
non viene aggiunta alcuna cache offline. Fotocamera/galleria giocatori invariata.

La cartella Android e la keystore non sono incluse in questo repository:
la compilazione e firma dell'APK/AAB avvengono nel progetto Android sul PC.

- Dati salvati in locale (localStorage) sul dispositivo.
- Abbonamento PRO: 7 giorni gratis, poi 9,99 €/mese via Stripe.
- Accesso owner gratuito per email autorizzate.
