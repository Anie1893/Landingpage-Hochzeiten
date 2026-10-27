# Landingpage – Visuals von Dani

Landingpage für Hochzeitsfotos und Hochzeitsfilme am Bodensee, gedacht als Ziel für Meta Ads.
Reines HTML/CSS/JavaScript, läuft direkt auf GitHub Pages. Änderungen sind nach 1–2 Minuten live.

---

## Bilder austauschen (ohne Programmieren)

Alle Bilder liegen im Ordner **`bilder`**. Jedes Bild hat einen festen Namen:

| Datei | Wo auf der Seite |
|---|---|
| `hero.jpg` | Großes Bild ganz oben |
| `galerie-1.jpg` … `galerie-9.jpg` | Die 9 Bilder in der Galerie (Reihenfolge 1–9) |
| `preise.jpg` | Bild neben den Preisen |
| `dani.jpg` | Rundes Foto von dir bei der Terminbuchung (quadratisch) |
| `vorschau-social.jpg` | Vorschaubild, wenn der Link geteilt wird (1200 × 630 px) |

**So tauschst du ein Bild aus:**

1. Bild am Handy/Computer vorbereiten: **JPG, ca. 1600–2000 px breit, möglichst unter 500 KB**
   (z. B. in Lightroom „Für Web exportieren“ oder mit squoosh.app). Große Originale machen die Seite langsam.
2. Die Datei genau so benennen wie in der Tabelle, z. B. `galerie-3.jpg` (alles klein geschrieben).
3. Auf github.com im Repository den Ordner **`bilder`** öffnen → **„Add file“ → „Upload files“**.
4. Bild hineinziehen → unten **„Commit changes“** klicken. Eine vorhandene Datei mit gleichem Namen wird ersetzt.

Fehlt ein Bild, zeigt die Seite automatisch einen beschrifteten Platzhalter.

---

## Texte ändern

1. Auf github.com die Datei **`index.html`** öffnen.
2. Oben rechts auf das **Stift-Symbol** (Edit) klicken.
3. Mit `Strg+F` / `Cmd+F` den Text suchen, den du ändern willst, und ihn überschreiben.
   Nur den Text ändern, die Zeichen in spitzen Klammern `< >` stehen lassen.
4. Oben rechts **„Commit changes…“** → **„Commit changes“**.

Platzhalter, die noch ausgefüllt werden müssen, stehen in eckigen Klammern, z. B. `[XX]` oder `[Namen]`.

**Wenn etwas kaputt aussieht:** Im Repository auf „Commits“ gehen, die letzte Änderung öffnen und sie rückgängig machen
(oder einfach Claude fragen).

---

## Einstellungen (oben in `index.html`)

```js
window.SITE_CONFIG = {
  bookingUrl: "",   // Calendly-/Cal.com-Link. Leer = Anfrageformular per E-Mail
  email: "visuals.von.dani@gmail.com",
  whatsapp: "",     // z. B. "4917612345678"
  videoUrl: ""      // YouTube- oder Vimeo-Link zum Highlight-Film
};
```

Ist ein Feld leer, wird die Funktion einfach ausgeblendet bzw. durch die Alternative ersetzt.

---

## Checkliste vor dem Livegang

- [x] Impressum (`impressum.html`) mit echten Angaben ausfüllen (USt-IdNr. ggf. noch ergänzen)
- [x] Datenschutzerklärung in `datenschutz.html` (bei Meta Pixel erweitern!)
- [ ] Bewertungszahlen und Anzahl Hochzeiten unter dem Hero eintragen (`[XX]`)
- [ ] Drei echte Zitate von Paaren eintragen
- [ ] Paar und Location beim Hochzeitsfilm eintragen und `videoUrl` setzen
- [ ] Galeriebilder `galerie-1.jpg` bis `galerie-9.jpg` hochladen
- [ ] `dani.jpg` hochladen
- [ ] Instagram-Link im Footer eintragen
- [ ] Optional: `bookingUrl` und `whatsapp` eintragen
- [ ] Meta Pixel erst zusammen mit einem Cookie-Banner (Einwilligung) einbauen

---

## Online stellen und eigene Domain

**GitHub Pages einschalten:** Repository → **Settings → Pages** → „Deploy from a branch“, Branch `main`, Ordner `/ (root)` → Save.
Die Seite ist dann unter `https://anie1893.github.io/Landingpage-Hochzeiten/` erreichbar.

**Subdomain von dani-schaefer.com (IONOS)**, z. B. `hochzeit.dani-schaefer.com`:

1. Bei IONOS → Domains & SSL → dani-schaefer.com → DNS → Eintrag hinzufügen:
   Typ **CNAME**, Hostname `hochzeit`, zeigt auf `anie1893.github.io`.
   Die bestehende Website auf dani-schaefer.com bleibt davon unberührt.
2. Bei GitHub → Settings → Pages → „Custom domain“: `hochzeit.dani-schaefer.com` → Save.
3. Sobald der DNS-Check grün ist: **„Enforce HTTPS“** aktivieren.

Erst Schritt 1 erledigen, dann Schritt 2. Sonst leitet GitHub auf eine Adresse um, die noch nicht funktioniert.

---

## Wichtig nach Änderungen an `assets/style.css` oder `assets/main.js`

Browser speichern diese Dateien zwischen. Damit Besucher sofort die neue Version sehen,
in `index.html`, `impressum.html` und `datenschutz.html` die Zahl hinter `?v=` erhöhen
(z. B. `style.css?v=202610272110` → `style.css?v=202610272130`).
