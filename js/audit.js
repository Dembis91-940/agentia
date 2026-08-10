/* ============================================================
   Agentia — audit.js
   Formulaire de prise de RDV de l'audit gratuit :
   validation → sauvegarde locale (localStorage) → confirmation
   + lien agenda (Google Calendar) + référence.
   Testable en Node via globalThis.AuditApp (voir tests/test-site.js)
   ============================================================ */
(function () {
  "use strict";

  var KEY = "agentia_rdvs";

  function validate(data) {
    var errors = [];
    if (!data.nom || data.nom.trim().length < 2) errors.push("Votre nom est requis.");
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.push("Un email valide est requis.");
    if (!data.tel || data.tel.replace(/[^0-9+]/g, "").length < 8) errors.push("Un numéro de téléphone valide est requis.");
    if (!data.entreprise || data.entreprise.trim().length < 2) errors.push("Le nom de votre entreprise est requis.");
    if (!data.secteur) errors.push("Choisissez votre secteur d'activité.");
    if (!data.creneau) errors.push("Choisissez un créneau pour l'audit.");
    if (!data.consent) errors.push("Merci d'accepter le traitement de vos données (RGPD) — c'est ce qui nous permet de vous recontacter.");
    return errors;
  }

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  /* Créneau "10h" → créneau de démo le lendemain à 10h (30 min).
     En production : remplacer par le lien Calendly de votre agenda. */
  var SLOTS = { "10h": 10, "11h": 11, "14h": 14, "15h": 15, "16h": 16, "17h": 17 };

  function buildCalendarUrl(data, now) {
    var d = now || new Date();
    var start = new Date(d.getTime() + 24 * 60 * 60 * 1000); // lendemain
    var h = SLOTS[data.creneau] !== undefined ? SLOTS[data.creneau] : 10;
    start.setHours(h, 0, 0, 0);
    var end = new Date(start.getTime() + 30 * 60 * 1000);
    function fmt(x) {
      return x.getUTCFullYear() + pad(x.getUTCMonth() + 1) + pad(x.getUTCDate()) +
        "T" + pad(x.getUTCHours()) + pad(x.getUTCMinutes()) + "00";
    }
    return "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent("Audit IA gratuit — " + data.entreprise) +
      "&dates=" + fmt(start) + "/" + fmt(end) +
      "&details=" + encodeURIComponent("Audit IA Agentia (30 min) — " + data.nom + " — " + data.entreprise + " — " + data.email);
  }

  function getStorage(storage) {
    if (storage) return storage;
    if (typeof localStorage !== "undefined") return localStorage;
    return null;
  }

  function saveRdv(data, storage) {
    var s = getStorage(storage);
    if (!s) return null;
    var list = [];
    try { list = JSON.parse(s.getItem(KEY) || "[]"); } catch (e) { list = []; }
    if (!Array.isArray(list)) list = [];
    data.id = "RDV-" + Date.now().toString(36).toUpperCase();
    data.date = new Date().toISOString();
    list.push(data);
    s.setItem(KEY, JSON.stringify(list));
    return data.id;
  }

  function getRdvs(storage) {
    var s = getStorage(storage);
    if (!s) return [];
    try {
      var v = JSON.parse(s.getItem(KEY) || "[]");
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }

  /* Point d'entrée du formulaire. Retourne {ok, errors, id, calendarUrl, data} */
  function handleSubmit(event, doc, storage) {
    var d = doc || (typeof document !== "undefined" ? document : null);
    if (event && typeof event.preventDefault === "function") event.preventDefault();
    if (!d || typeof d.getElementById !== "function") return { ok: false, errors: ["Document indisponible."] };

    function val(id) { var el = d.getElementById(id); return el ? String(el.value || "") : ""; }
    function chk(id) { var el = d.getElementById(id); return el ? !!el.checked : false; }

    var data = {
      nom: val("a-nom"),
      email: val("a-email"),
      tel: val("a-tel"),
      entreprise: val("a-entreprise"),
      secteur: val("a-secteur"),
      creneau: val("a-creneau"),
      besoin: val("a-besoin"),
      consent: chk("a-consent")
    };

    var errors = validate(data);
    var errBox = d.getElementById("audit-errors");
    if (errors.length) {
      if (errBox) {
        errBox.innerHTML = errors.map(function (e) { return "<p>⚠ " + e + "</p>"; }).join("");
        errBox.className = "msg-box err show";
      }
      return { ok: false, errors: errors };
    }

    var id = saveRdv(data, storage);
    var calUrl = buildCalendarUrl(data);
    if (errBox) { errBox.className = "msg-box err"; errBox.innerHTML = ""; }

    var form = d.getElementById("form-audit");
    if (form) form.style.display = "none";

    var okBox = d.getElementById("audit-ok");
    if (okBox) {
      var recap = d.getElementById("audit-recap");
      if (recap) recap.textContent = data.nom + " — " + data.entreprise + " — " + data.secteur + " — créneau " + data.creneau + " — " + data.email;
      var calLink = d.getElementById("audit-cal");
      if (calLink) calLink.href = calUrl;
      var refEl = d.getElementById("audit-ref");
      if (refEl) refEl.textContent = id || "—";
      okBox.className = "msg-box ok show";
    }
    return { ok: true, id: id, calendarUrl: calUrl, data: data };
  }

  function init(doc) {
    var d = doc || (typeof document !== "undefined" ? document : null);
    if (!d || typeof d.getElementById !== "function") return;
    var form = d.getElementById("form-audit");
    if (!form || typeof form.addEventListener !== "function") return;
    form.addEventListener("submit", function (ev) { handleSubmit(ev, d); });
  }

  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function () { init(document); });
  }

  if (typeof globalThis !== "undefined") {
    globalThis.AuditApp = {
      validate: validate,
      buildCalendarUrl: buildCalendarUrl,
      saveRdv: saveRdv,
      getRdvs: getRdvs,
      handleSubmit: handleSubmit,
      init: init,
      KEY: KEY
    };
  }
})();
