# Analytics, nuova libreria loghi e correzioni mobile

## Obiettivo
- Attivare Vercel Analytics in tutta l'app.
- Sostituire la libreria attuale con 170 loghi: 10 animali selezionati e 160 nuovi loghi tematici.
- Rendere schede e filtri del selettore completamente visibili e scorrevoli su mobile.
- Evitare che barre e aree protette del telefono coprano i contenuti.
- Pubblicare il risultato sul dominio esistente.

## Modifiche
1. Installare il pacchetto Analytics e montarlo nel documento principale.
2. Creare la nuova raccolta tipizzata con categorie, nomi, tag di ricerca, colori e icone.
3. Collegare il selettore alla nuova raccolta, sostituire i filtri e mantenere il risultato finale come logo circolare salvabile.
4. Correggere altezze, overflow e spazi del modale; aggiungere spazio inferiore e area sicura alle pagine e all'intestazione.
5. Verificare conteggio, ricerca, filtri, apertura mobile, selezione logo e assenza di errori; quindi pubblicare.

## Dettagli tecnici
- Il totale sarà esattamente 170: 10 animali, 30 volti, 50 club, 20 nazionali, 30 basket, 20 volley/padel/beach e 10 generici.
- La ricerca confronterà nome e `searchTags` senza distinzione tra maiuscole e minuscole.
- Le schede superiori e i filtri useranno scorrimento orizzontale senza ritaglio verticale.
