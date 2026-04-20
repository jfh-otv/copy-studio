// Direct-response copywriting principles, distilled from Schwartz, Hopkins,
// Ogilvy, Halbert, Caples, Sugarman, Collier. Applied as an always-on craft
// layer on top of voice + framework. Localized for German output.

export type Intensity = 1 | 2 | 3;

export const INTENSITY_INSTRUCTIONS: Record<Intensity, string> = {
  1: `# UMFORMUNGSGRAD: 1 — nah am Original

Die Struktur, Reihenfolge und der Gedankengang des Originals bleiben erhalten.
Ziel ist ein Lektorat, kein Rewrite:
- Behalte Absätze, Reihenfolge der Argumente und Kernformulierungen bei, wo sie
  bereits funktionieren.
- Voice und Framework wirken nur dort, wo der Originaltext schwach ist (Füllwörter,
  unklare Sätze, verbotene KI-Phrasen, fehlende Konkretheit).
- Keine neuen Metaphern, keine neuen Opener, keine neuen Szenen einführen, die
  nicht im Original angelegt sind.
- Wenn das Framework einen Opener vorschreibt, der stark vom Original abweicht:
  übernimm stattdessen den Original-Opener und putze ihn nur auf.
- Anti-KI-Phrasen (Abschnitt 7) bleiben bindend.

Erkennbarkeit: Ein Leser, der Original und Output nebeneinander legt, soll
sagen "das ist derselbe Text, nur geschliffen".`,

  2: `# UMFORMUNGSGRAD: 2 — ausgewogen (Default)

Voice und Framework formen den Text spürbar, aber das Original bleibt als
Grundgerüst erkennbar:
- Reihenfolge und Hauptargumente des Originals bleiben.
- Opener, Übergänge, CTA und Schlusssatz dürfen komplett neu geschrieben werden,
  wenn Framework oder Voice es nahelegen.
- Eigene Formulierungen und Bilder aus Voice/Framework sind erwünscht, solange
  sie inhaltlich zum Originalmaterial passen.
- Fakten, Zahlen, Namen: exakt wie im Original, nichts dazuerfinden.

Erkennbarkeit: Der Leser erkennt die Kernaussagen des Originals wieder, merkt
aber sofort, dass der Text in einem anderen Stil neu gebaut wurde.`,

  3: `# UMFORMUNGSGRAD: 3 — stark geprägt

Voice und Framework dominieren. Das Original ist Rohmaterial, nicht Vorlage:
- Du darfst die Reihenfolge komplett umbauen, mit einer Szene oder Analogie
  einsteigen, die nur im Framework/Voice angelegt ist, und die Dramaturgie neu
  setzen.
- Der Opener folgt dem Framework — nicht dem Original.
- Formulierungen werden überschrieben; identische Sätze aus dem Original sind
  ein Warnsignal. Ziel: null übernommene Sätze (einzelne Fachbegriffe und
  Zahlen ausgenommen).
- Voice darf stilistische Entscheidungen treffen, die der Original-Autor nie
  getroffen hätte (andere Satzlängen, andere Wortwahl, andere Perspektive).
- Fakten, Zahlen, Namen, Kundenbeispiele: weiterhin nur aus dem Original.
  Nichts erfinden.

Erkennbarkeit: Ein Leser, der nur den Output sieht, würde ihn dem Voice/Framework
zuordnen — nicht dem Stil des Originals. Wenn der Output sich nach demselben
Autor wie das Original liest, hast du Grad 3 nicht erreicht.`,
};

export const INTENSITY_TEMPERATURE: Record<Intensity, number> = {
  1: 0.5,
  2: 0.8,
  3: 1.0,
};

export const DIRECT_RESPONSE_PRINCIPLES = `# COPY-QUALITÄT (immer anwenden)

Minimaler, stil-neutraler Hygiene-Layer. Er regelt nicht den Ton, nicht die
Struktur, nicht den Opener — das entscheiden Voice und Framework. Diese
Regeln gelten für *jeden* Text, egal in welchem Stil.

## 1 — Spezifität statt Abstraktion
Zahlen, Namen, Daten, Orte, Beträge. Wenn keine Zahl vorliegt: ein konkretes
Bild statt einer Kategorie.
- Schwach: "viele Unternehmen", "signifikante Einsparungen", "in kurzer Zeit"
- Stark: "47 Brands", "8 Stunden pro Woche", "bis Freitag 17 Uhr"
- Stark (Bild): "der Ops-Lead, der Sonntagabend um 22 Uhr Shopify-Bestellungen
  gegen Amazon abgleicht" — nicht "Operations-Teams im DTC-Umfeld".

## 2 — Rhythmus variieren
Satzlängen abwechseln. Keine feste Regel — Voice und Framework bestimmen die
Kadenz. Nur die Untergrenze ist hart: drei gleich lange Sätze hintereinander
sind ein Warnsignal. Korrigieren.

## 3 — "Na und?" einmal
Jede Behauptung mindestens einen Schritt weiter treiben, bis eine konkrete
Konsequenz für den Leser sichtbar ist. Feature allein reicht nie; die
Konsequenz gehört in den Satz oder den Folgesatz. Keine Treppe, keine
Zwischenstufen sichtbar machen — nur das Ergebnis.

## 4 — Nichts erfinden
Behauptungen über Ergebnisse, Zahlen, Kunden, Timing: nur, wenn sie im Input
stehen. Keine Prozente, Kundennamen, Zeiträume dazudichten. Unbelegtes
entweder streichen oder kennzeichnen ("vermutlich", "in den meisten Fällen").

## 5 — Anti-KI-Phrasen (hartes Verbot)
Diese Wörter und Wendungen markieren maschinell wirkenden Text. Nicht
umschreiben — komplett ersetzen durch konkrete Aussagen.

**Phrasen-Blocklist:**
- "In der heutigen schnelllebigen Welt …", "Im Zeitalter von …"
- "Es ist von entscheidender Bedeutung, dass …"
- "eintauchen in" / "tief eintauchen in"
- "die Welt von …" / "im Bereich …"
- "revolutionär", "bahnbrechend", "disruptiv" (außer im Zitat)
- "wegweisend", "zukunftsweisend", "innovativ"
- "nahtlos", "robust", "skalierbar" als Adjektiv ohne Zahl
- "maßgeschneidert", "ganzheitlich", "synergistisch"
- "Darüber hinaus", "Des Weiteren" als Absatzanfang
- "Letztendlich", "Schlussendlich" als Floskel

**Meta-Floskeln im Schlusssatz verboten:**
- "Zusammenfassend lässt sich sagen …", "Es lässt sich festhalten …",
  "Fazit:" — raus. Der letzte Satz trägt Inhalt, nicht Meta-Kommentar.

**Zeichen:**
- Em-Dash (—) max. einmal pro Absatz, mit Leerzeichen drumherum, nur für
  echten Einschub — nicht als Ersatz für Komma oder Doppelpunkt.
- Aufzählungen mit drei parallelen Adjektiven ("schnell, zuverlässig und
  effizient"): zwei reichen, und sie müssen unterschiedlich sein.

**Strukturen:**
- Rhetorische Fragen, die sich selbst beantworten ("Wer will das nicht?")
- Zwillingsformulierungen ("nicht nur X, sondern auch Y") max. einmal pro Post

---

**Hierarchie:** Voice > Framework > Prinzipien. Voice und Framework dürfen
Rhythmus, Opener, Struktur und Schluss nach Belieben bestimmen. Punkt 4
(nichts erfinden) und Punkt 5 (Anti-KI-Phrasen) sind immer bindend.`;
