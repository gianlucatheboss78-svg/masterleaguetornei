# Copia 1:1 Master League Tornei

## Risultato
- Ricreare la schermata iniziale del sito indicato con lo stesso impianto blu navy e oro, gerarchie, spazi, font, schede informative e navigazione inferiore.
- Conservare tutte le funzioni già presenti: creazione tornei, squadre e rose, logo squadra dal cerchio, calendario, risultati live, classifiche, report ed eliminazione.
- Uniformare anche le schermate operative allo stesso linguaggio visivo, senza eliminare dati o funzioni esistenti.

## Modifiche
1. Usare esclusivamente le due immagini caricate per logo, favicon, icone installabili e schermata di avvio; rimuovere i riferimenti al vecchio logo.
2. Aggiungere il manifesto installabile “Master League Tornei” con tema `#0a1931`, icone 192/512 e supporto Apple, senza aggiungere modalità offline.
3. Ricostruire la Home come il riferimento: testata centrale, grande azione “Crea torneo”, griglia vantaggi, offerta Premium e barra inferiore.
4. Mantenere la creazione torneo e tutte le funzioni gestionali esistenti, presentandole nello stile del riferimento.
5. Lasciare la lista squadre verticale e pulita; il selettore logo resta nascosto e si apre solo toccando il cerchio della squadra. Conservare le maglie specifiche per calcio, basket, volley e beach volley.
6. Aggiungere “Abbonati” nell’intestazione e collegare tutti gli inviti Premium al link Stripe fornito, con testo “6 giorni gratis, poi 9,99 € al mese”.
7. Correggere i messaggi di errore visibili e rendere l’accesso ai dati tollerante quando il salvataggio online non è disponibile.

## Verifica
- Confronto visivo desktop e mobile con il sito di riferimento.
- Prova completa: crea torneo, aggiunge squadre, apre il logo dal cerchio, aggiunge giocatori, genera calendario, aggiorna risultato e legge la classifica.
- Controllo installazione: manifesto, favicon, icona Apple e icone 192/512.
- Controllo link Stripe, assenza del vecchio logo, console pulita e compilazione riuscita.

## Dettagli tecnici
- La copia usa l’app TanStack esistente e il suo archivio dati attuale, così le funzioni avanzate non vengono perse.
- Le immagini caricate vengono convertite nelle dimensioni richieste senza introdurre altri asset grafici.
- L’installabilità sarà tramite manifesto e icone; non viene aggiunta cache offline perché non richiesta.
