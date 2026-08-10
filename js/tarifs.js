/* ============================================================
   Agentia — SOURCE UNIQUE DES TARIFS
   Toute page qui affiche un prix doit le prendre d'ici (ou
   l'afficher à l'identique). Le test test-site.js vérifie que
   les pages HTML contiennent exactement ces libellés.
   ============================================================ */
(function () {
  "use strict";

  var TARIFS = {
    audit:        { prix: 0,        label: "Gratuit",         duree: "30 min",   nom: "Audit IA" },
    chatbot:      { min: 800,  max: 1500,                     nom: "Chatbot site web" },
    chatbotMensuel:{ min: 100, max: 200,                      nom: "Maintenance chatbot" },
    automatisation:{ min: 1500, max: 3000,                    nom: "Automatisation (projet)" },
    concierge:    { min: 300,  max: 600,                      nom: "Concierge IA (mois)" },
    entretien:    { prix: 990,                                nom: "Entretien client IA (EchoClient)" },
    siteMvp:      { min: 500,  max: 1500, delai: "7-14 jours", nom: "Site / MVP clé en main" },
    siteVitrine:  { min: 500,  max: 800,  delai: "7 jours",    nom: "Site vitrine" },
    sitePro:      { min: 800,  max: 1200, delai: "10 jours",   nom: "Site pro" },
    mvp:          { min: 1200, max: 1500, delai: "14 jours",   nom: "MVP applicatif" },
    paiement:     "50 % au lancement, 50 % à la livraison",
    garantie:     "30 jours",
    delai:        "1-2 semaines"
  };

  /* "800–1 500 €" | "990 €" | "Gratuit" */
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

  function prixLabel(o) {
    if (o.prix === 0) return "Gratuit";
    if (o.min !== undefined && o.max !== undefined) return fmt(o.min) + "–" + fmt(o.max) + " €";
    return fmt(o.prix) + " €";
  }

  /* Grille de calcul magique : heures gagnées → valeur mensuelle.
     retourne { valeurMensuelle, coutConcierge, gainNet, rentable } */
  function calculROI(heuresParSemaine, coutHoraire) {
    var h = Number(heuresParSemaine) || 0;
    var c = Number(coutHoraire) || 30;
    var valeurMensuelle = Math.round(h * c * 4.33); // 4.33 semaines / mois
    var coutConcierge = TARIFS.concierge.max;
    var gainNet = valeurMensuelle - coutConcierge;
    return {
      heures: h,
      coutHoraire: c,
      valeurMensuelle: valeurMensuelle,
      coutConcierge: coutConcierge,
      gainNet: gainNet,
      rentable: gainNet > 0
    };
  }

  globalThis.AGENTIA_TARIFS = TARIFS;
  globalThis.prixLabel = prixLabel;
  globalThis.calculROI = calculROI;
})();
