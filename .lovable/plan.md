# Final World Package

## Goal
Upgrade the existing app in one backward-compatible release while preserving current tournaments, sharing, payments, and cloud synchronization.

## Changes
- Keep the supplied navy-and-gold Master League crest on the home screen and app header; improve its rendered sharpness without replacing the artwork.
- Replace the current home feature tiles with four large actions: **Crea Torneo**, **I Miei Tornei**, **Classifiche**, and **Regolamento**.
- Add dedicated mobile-friendly **Classifiche** and **Regolamento** pages so every home action has a real destination.
- Add a jersey catalogue and selector for the requested leagues and clubs: Serie A, Premier League, La Liga, Brasileirão, Liga Profesional Argentina, Ligue 1, Bundesliga, Primeira Liga, Chinese Super League, and NBA.
- Use each club’s recognizable color palette with a generated initials/crest placeholder; no external club artwork will be introduced.
- Store the selected jersey as an optional team setting and render it consistently in squads and match cards.
- Add a basketball format selector during tournament creation: **5vs5** or **3vs3**.
- Implement FIBA 3x3 behavior: half court, 10-minute game clock, 12-second shot clock, +1/+2 scoring, first to 21, and overtime first to 2.
- Limit 3x3 rosters to four players and show a **3vs3** badge on tournament cards and inside the tournament.
- Show a dedicated 3x3 standings presentation while keeping the existing 5v5 standings and playoff behavior unchanged.

## Compatibility
- Add only optional fields to the existing JSON tournament/team/match data; old records without them continue as 5vs5 with current jerseys.
- Keep the existing database table and synchronization path unchanged; no schema migration is required.
- Do not alter Stripe, authentication, sharing, existing sport formats, or current tournament records.

## Verification
- Check old 5v5 tournaments still open and behave unchanged.
- Create and run a 3x3 tournament through roster limits, scoring, clocks, finish conditions, standings, badges, and cloud save/reload.
- Verify jersey selection and rendering for every requested league on mobile.
- Verify all four home actions, sharp crest rendering, responsive layouts, and zero build/runtime errors.
- Publish the verified version to `masterleaguetornei.lovable.app`.

## Technical details
- Missing `basketMode` means `5v5`; missing 3x3 clock state is initialized only when a 3x3 match is opened.
- Jersey presets are deterministic source data with semantic IDs, league, club name, primary/secondary colors, and generated placeholder mark.
- New content pages receive unique page metadata and use the existing design system and navigation.
