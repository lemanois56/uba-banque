/** Index Javascript **/

/** === CONFIG SOLDE INITIAL (modifiable dans le code) ===
 * Change la valeur ci-dessous pour définir le solde/épargne initiaux.
 * Mets FORCE_RESET_SOLDE = true pour imposer SOLDE_INITIAL au prochain chargement
 * (l'historique est conservé).
 */
const SOLDE_INITIAL = 114500443;
const FORCE_RESET_SOLDE = false;
/** ===================================================== */
/*__INIT_LOCAL_BLOCK__*/
(function initLocal() {
  if (!localStorage.getItem("solde") || FORCE_RESET_SOLDE) {
    localStorage.setItem("solde", String(SOLDE_INITIAL));
  }
  if (!localStorage.getItem("epargne") || FORCE_RESET_SOLDE) {
    localStorage.setItem("epargne", String(SOLDE_INITIAL));
  }
  if (!localStorage.getItem("transactions")) {
    localStorage.setItem("transactions", JSON.stringify([]));
  }
})();


const login = () => {
  let identifiant = document.getElementById("username").value;
  let password = document.getElementById("secret-nbr").value;
  if (identifiant != "" && password != "") {
    if (identifiant === "123" && password === "123") {
      localStorage.setItem("sessionID", "true");
      window.location = "solde.html";
    } else {
      document.getElementsByClassName("message_title")[0].innerHTML =
        "Identifiants ou mot de passe incorrect";
    }
  } else {
    document.getElementsByClassName("message_title")[0].innerHTML =
      "Veuillez remplir tous les champs";
  }
};

const resetU = () => {
  document.getElementById("username").value = "";
};

const resetS = () => {
  document.getElementById("secret-nbr").value = "";
};

/** End Index javascript **/


/** Deconnexion Javascript **/
const logout = () => {
  localStorage.setItem("sessionID", "false");
  window.location = "index.html";
};
/** End Deconnexion javascript **/


/** Virement: loader + saisie de code et envoi **/
const virement_loading = () => {
  Swal.fire({
    title: "Virement en cours",
    html: "Chargement...",
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
    },
    willClose: () => {
      effectuerVirement();
    },
  });
};

/**
 * Demande du code et confirmation
 * - Affiche une SweetAlert avec input
 * - Confirme toujours le virement après saisie du code
 * - L'appel réseau est effectué en "best effort" mais n'empêche jamais l'affichage de la confirmation
 */
/** Helpers: activer/désactiver le bouton en fonction des champs requis **/
const initVirementForm = () => {
  const form = document.getElementById("sepaForm");
  const btn = document.getElementById("btn_valid");
  if (!form || !btn) return;

  const updateButtonState = () => {
    const requiredFields = form.querySelectorAll("input[required]");
    const allFilled = Array.from(requiredFields).every((el) => el.value.trim() !== "");
    btn.disabled = !allFilled;
    if (allFilled) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  };

  // Activer/désactiver en temps réel
  form.addEventListener("input", updateButtonState);
  updateButtonState();

  // Soumission: on empêche l'envoi natif, puis on montre le loader
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    virement_loading();
  });
};

// Initialisation à l'ouverture de la page
document.addEventListener("DOMContentLoaded", initVirementForm);

const effectuerVirement = () => {
  const form = document.getElementById("sepaForm");
  if (!form) return;
  const data = new FormData(form);
  const montant = parseFloat((data.get("montant") || "0").toString().replace(/\s/g, "").replace(",", "."));
  if (!montant || isNaN(montant) || montant <= 0) {
    Swal.fire("Erreur", "Montant invalide.", "error");
    return;
  }
  let solde = parseFloat(localStorage.getItem("solde") || "0");
  let epargne = parseFloat(localStorage.getItem("epargne") || "0");
  solde -= montant;
  epargne -= montant;
  localStorage.setItem("solde", String(solde));
  localStorage.setItem("epargne", String(epargne));

  const txs = JSON.parse(localStorage.getItem("transactions") || "[]");
  const dateNow = new Date().toLocaleDateString("fr-FR");
  txs.push({ type: "virement", libelle: "Virement effectué", montant: montant, date: dateNow });
  localStorage.setItem("transactions", JSON.stringify(txs));

  refreshBindings();
  Swal.fire("Succès", "Votre virement a été effectué avec succès.", "success");
};

/*__BOOT__*/
document.addEventListener("DOMContentLoaded", () => {
  refreshBindings();
  initVirementForm();
});

const refreshBindings = () => {
  const solde = localStorage.getItem("solde") || "0";
  const epargne = localStorage.getItem("epargne") || "0";
  const sEl = document.getElementById("soldeValue");
  if (sEl) sEl.textContent = `${solde} €`;
  const eEl = document.getElementById("epargneValue");
  if (eEl) eEl.textContent = `${epargne} €`;
  document.querySelectorAll(".bind-solde").forEach(el => { el.textContent = `+ ${solde} €`; });
  document.querySelectorAll(".bind-epargne").forEach(el => { el.textContent = `+ ${epargne} €`; });
};
