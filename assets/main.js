(function () {
  "use strict";
  var cfg = window.SITE_CONFIG || {};
  var service = "Foto + Film";

  /* ---------- Cookie-Einwilligung + Meta Pixel ---------- */
  var CONSENT_KEY = "vvd-consent";
  function getConsent() { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {} }
  var pixelLoaded = false;
  function loadPixel() {
    if (pixelLoaded || !cfg.metaPixelId) return;
    pixelLoaded = true;
    /* Offizieller Meta-Pixel-Code */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', cfg.metaPixelId);
    window.fbq('track', 'PageView');
  }
  // Ereignis senden (nur wenn zugestimmt wurde)
  function track(name, params, custom) {
    if (!pixelLoaded || !window.fbq) return;
    window.fbq(custom ? 'trackCustom' : 'track', name, params || {});
  }
  var banner = document.getElementById("cookie-banner");
  function showBanner() { if (banner) banner.hidden = false; }
  function hideBanner() { if (banner) banner.hidden = true; }
  if (getConsent() === "granted") loadPixel();
  else if (getConsent() !== "denied") showBanner();
  if (banner) {
    document.getElementById("cookie-accept").addEventListener("click", function () { setConsent("granted"); hideBanner(); loadPixel(); });
    document.getElementById("cookie-deny").addEventListener("click", function () {
      var wasGranted = getConsent() === "granted";
      setConsent("denied"); hideBanner();
      if (wasGranted) window.location.reload();
    });
  }
  var settingsLink = document.getElementById("cookie-settings");
  if (settingsLink) settingsLink.addEventListener("click", function (e) { e.preventDefault(); showBanner(); });

  // Klicks auf "Erstgespräch buchen" & Co.
  document.querySelectorAll('a[href="#termin"]').forEach(function (a) {
    a.addEventListener("click", function () { track("ErstgespraechKlick", { button: a.textContent.trim() }, true); });
  });

  // Calendly meldet eine erfolgreiche Buchung an die Seite
  window.addEventListener("message", function (e) {
    var d = e.data;
    if (!d || typeof d !== "object" || typeof d.event !== "string") return;
    if (d.event === "calendly.event_scheduled") track("Schedule", { content_name: "Erstgespräch", service: service });
    if (d.event === "calendly.date_and_time_selected") track("TerminGewaehlt", { service: service }, true);
  });

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
        url.searchParams.set("embed_domain", window.location.host);
        url.searchParams.set("hide_gdpr_banner", "1");
        url.searchParams.set("a1", service); // vorausgefüllt, falls die 1. Frage in Calendly „Wofür interessiert ihr euch?“ ist
      }
      var frame = document.createElement("iframe");
      frame.className = "calendly-frame";
      frame.title = "Termin für das Erstgespräch auswählen";
      frame.src = url.toString();
      var consent = document.getElementById("calendar-consent");
      consent.replaceWith(frame);
      track("KalenderGeladen", { service: service }, true);
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
  if (cfg.videoFile) {
    playBtn.addEventListener("click", function () {
      var v = document.createElement("video");
      v.src = cfg.videoFile;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      v.className = "film-video";
      film.innerHTML = "";
      film.appendChild(v);
      var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
      track("FilmAbgespielt", {}, true);
    });
  } else if (!src) {
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
