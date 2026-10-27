(function () {
  "use strict";
  var cfg = window.SITE_CONFIG || {};
  var service = "Foto + Film";

  /* ---------- Leistung wählen (Foto / Film / beides) ---------- */
  var chips = document.querySelectorAll(".chip");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      chip.setAttribute("aria-pressed", "true");
      service = chip.getAttribute("data-service");
    });
  });

  /* ---------- Buchungskalender (Calendly / Cal.com) mit Einwilligung ---------- */
  var calendarArea = document.getElementById("calendar-area");
  var form = document.getElementById("request-form");
  if (cfg.bookingUrl) {
    calendarArea.hidden = false;
    form.hidden = true;
    document.getElementById("load-calendar").addEventListener("click", function () {
      var url;
      try { url = new URL(cfg.bookingUrl); } catch (e) { return; }
      if (url.hostname.indexOf("calendly.com") !== -1) {
        url.searchParams.set("embed_type", "Inline");
        url.searchParams.set("hide_gdpr_banner", "1");
        url.searchParams.set("a1", service); // vorausgefüllt, falls die 1. Frage in Calendly „Wofür interessiert ihr euch?“ ist
      }
      var frame = document.createElement("iframe");
      frame.className = "calendly-frame";
      frame.title = "Termin für das Erstgespräch auswählen";
      frame.src = url.toString();
      var consent = document.getElementById("calendar-consent");
      consent.replaceWith(frame);
    });
  }

  /* ---------- Anfrageformular (öffnet E-Mail-Programm) ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var status = document.getElementById("form-status");
    var data = new FormData(form);
    if (!String(data.get("namen") || "").trim() || !String(data.get("kontakt") || "").trim()) {
      status.textContent = "Bitte tragt eure Namen und eine E-Mail-Adresse oder Telefonnummer ein.";
      return;
    }
    var body =
      "Hallo Dani,\n\nwir interessieren uns für: " + service + "\n\n" +
      "Namen: " + data.get("namen") + "\n" +
      "Kontakt: " + data.get("kontakt") + "\n" +
      "Hochzeitsdatum: " + (data.get("datum") || "noch offen") + "\n" +
      "Location: " + (data.get("ort") || "noch offen") + "\n" +
      "Gespräch passt uns: " + (data.get("zeit") || "flexibel") + "\n\nViele Grüße";
    var subject = "Anfrage Erstgespräch (" + service + ")";
    window.location.href = "mailto:" + (cfg.email || "") +
      "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    status.textContent = "Euer E-Mail-Programm öffnet sich. Einfach noch auf Senden tippen. Ich melde mich schnellstmöglich!";
  });

  /* ---------- WhatsApp ---------- */
  if (cfg.whatsapp) {
    var line = document.getElementById("whatsapp-line");
    var wa = document.getElementById("whatsapp-link");
    wa.href = "https://wa.me/" + cfg.whatsapp.replace(/\D/g, "") + "?text=" +
      encodeURIComponent("Hallo Dani, wir interessieren uns für " + service + " und hätten gern ein Erstgespräch.");
    line.hidden = false;
  }

  /* ---------- Hochzeitsfilm (lädt erst nach Klick, datenschutzfreundlich) ---------- */
  var film = document.getElementById("film");
  var playBtn = film.querySelector(".film-play");
  function embedUrl(u) {
    var m = u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    if (m) return "https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1&rel=0";
    var v = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (v) return "https://player.vimeo.com/video/" + v[1] + "?autoplay=1&dnt=1";
    return null;
  }
  var src = cfg.videoUrl ? embedUrl(cfg.videoUrl) : null;
  if (!src) {
    playBtn.hidden = true;
    var note = document.createElement("span");
    note.className = "film-note";
    note.textContent = "Highlight-Film folgt in Kürze";
    film.appendChild(note);
  } else {
    playBtn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = src;
      f.title = "Hochzeitsfilm";
      f.allow = "autoplay; fullscreen; picture-in-picture";
      f.allowFullscreen = true;
      film.innerHTML = "";
      film.appendChild(f);
    });
  }

  /* ---------- Buchen-Leiste am Handy ---------- */
  var sticky = document.getElementById("sticky-cta");
  var hero = document.querySelector(".hero");
  var termin = document.getElementById("termin");
  var heroVisible = true, terminVisible = false;
  function update() { sticky.classList.toggle("show", !heroVisible && !terminVisible); }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; update(); }).observe(hero);
    new IntersectionObserver(function (e) { terminVisible = e[0].isIntersecting; update(); }, { threshold: 0.15 }).observe(termin);
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
