/* ============================================================
   Agentia — main.js (partagé par toutes les pages)
   Nav mobile, année du footer, widget ROI (services + audit)
   ============================================================ */
(function () {
  "use strict";

  function initNav(doc) {
    var toggle = doc.querySelector("[data-nav-toggle]");
    var nav = doc.querySelector("[data-nav]");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
    // fermer le menu après un clic sur un lien (mobile)
    var links = nav.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        nav.classList.remove("open");
      });
    }
  }

  function initYear(doc) {
    var el = doc.querySelector("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* Widget ROI : [data-roi-slider] + [data-roi-output-*] */
  function initROI(doc, lib) {
    var slider = doc.querySelector("[data-roi-slider]");
    if (!slider || !lib || typeof lib.calculROI !== "function") return;
    var outHeures = doc.querySelector("[data-roi-heures]");
    var outValeur = doc.querySelector("[data-roi-valeur]");
    var outCout = doc.querySelector("[data-roi-cout]");
    var outGain = doc.querySelector("[data-roi-gain]");
    var outConcierge = doc.querySelector("[data-roi-concierge]");
    var outVerdict = doc.querySelector("[data-roi-verdict]");

    function afficher() {
      var h = parseInt(slider.value, 10) || 0;
      var cout = parseInt(slider.dataset.coutHoraire || "30", 10);
      var r = lib.calculROI(h, cout);
      if (outHeures) outHeures.textContent = h + " h/sem";
      if (outValeur) outValeur.textContent = r.valeurMensuelle + " €/mois";
      if (outCout) outCout.textContent = r.coutHoraire + " €/h";
      if (outConcierge) outConcierge.textContent = r.coutConcierge + " €/mois";
      if (outGain) {
        outGain.textContent = (r.gainNet > 0 ? "+" : "") + r.gainNet + " €/mois";
        outGain.className = "v " + (r.rentable ? "pos" : "neg");
      }
      if (outVerdict) {
        outVerdict.textContent = r.rentable
          ? "ROI positif dès le premier mois : l'automatisation se paie toute seule."
          : "Sous 5 h/semaine, on commence par l'audit gratuit pour viser les tâches à fort volume.";
      }
    }
    slider.addEventListener("input", afficher);
    afficher();
  }

  function init(doc) {
    if (!doc) return;
    initNav(doc);
    initYear(doc);
    initROI(doc, globalThis);
  }

  if (typeof document !== "undefined" && document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function () { init(document); });
  }

  if (typeof globalThis !== "undefined") {
    globalThis.AgentiaMain = { init: init, initROI: initROI };
  }
})();
