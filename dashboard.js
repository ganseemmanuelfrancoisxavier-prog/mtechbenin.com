// ======================================================
// MTECH BENIN — DASHBOARD ADMIN
// Supabase + Hero Slides
// ======================================================

let slides = [];
let products = JSON.parse(
  localStorage.getItem("mtech_products") || "null"
) || [
  {
    id: 1,
    name: "JBL Boombox",
    cat: "Enceinte",
    price: 0,
    icon: "🔊",
    image: ""
  },
  {
    id: 2,
    name: "iPhone",
    cat: "Smartphone",
    price: 0,
    icon: "📱",
    image: ""
  },
  {
    id: 3,
    name: "AirPods",
    cat: "Audio",
    price: 0,
    icon: "🎧",
    image: ""
  },
  {
    id: 4,
    name: "MacBook",
    cat: "Informatique",
    price: 0,
    icon: "💻",
    image: ""
  }
];

const STORAGE_BUCKET = "hero media";

// ======================================================
// DEMARRAGE
// ======================================================

document.addEventListener("DOMContentLoaded", async () => {
  if (!window.supabase || !window.supabaseClient) {
    showError(
      "Supabase n'est pas correctement chargé. Vérifie dashboard.html."
    );
    return;
  }

  await checkAuthentication();
});

// ======================================================
// AUTHENTIFICATION
// ======================================================

async function checkAuthentication() {
  const {
    data: { session },
    error
  } = await supabaseClient.auth.getSession();

  if (error) {
    showError("Impossible de vérifier la connexion.");
    return;
  }

  if (!session) {
    showLoginScreen();
    return;
  }

  showDashboard(session.user);
}

function showLoginScreen() {
  document.body.innerHTML = `
    <div class="mtech-login">
      <div class="mtech-login-box">

        <div class="mtech-login-logo">
          MTECH<span>BENIN</span>
        </div>

        <div class="mtech-login-badge">
          ADMINISTRATION
        </div>

        <h1>Connexion</h1>

        <p class="mtech-login-text">
          Connecte-toi pour accéder au Dashboard MTECH BENIN.
        </p>

        <form id="loginForm">

          <label>
            Adresse e-mail
            <input
              id="loginEmail"
              type="email"
              placeholder="Votre e-mail"
              required
            >
          </label>

          <label>
            Mot de passe
            <input
              id="loginPassword"
              type="password"
              placeholder="Votre mot de passe"
              required
            >
          </label>

          <button type="submit" class="mtech-login-button">
            SE CONNECTER
          </button>

          <div id="loginMessage"></div>

        </form>

        <a href="index.html" class="back-site">
          ← Retour au site
        </a>

      </div>
    </div>

    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: #0a0a0a;
      }

      .mtech-login {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        background:
          radial-gradient(
            circle at top,
            #242424 0%,
            #0b0b0b 45%,
            #000 100%
          );
      }

      .mtech-login-box {
        width: 100%;
        max-width: 430px;
        padding: 40px 30px;
        border-radius: 24px;
        background: rgba(25, 25, 25, 0.95);
        border: 1px solid #333;
        box-shadow: 0 30px 80px rgba(0,0,0,.5);
      }

      .mtech-login-logo {
        color: white;
        font-size: 28px;
        font-weight: 900;
        letter-spacing: -1px;
      }

      .mtech-login-logo span {
        color: #e00000;
      }

      .mtech-login-badge {
        display: inline-block;
        margin-top: 15px;
        padding: 7px 12px;
        border-radius: 20px;
        background: #e00000;
        color: white;
        font-size: 11px;
        font-weight: 700;
      }

      .mtech-login-box h1 {
        color: white;
        margin: 30px 0 8px;
      }

      .mtech-login-text {
        color: #999;
        line-height: 1.5;
        margin-bottom: 25px;
      }

      .mtech-login-box label {
        display: block;
        color: white;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 18px;
      }

      .mtech-login-box input {
        width: 100%;
        margin-top: 8px;
        padding: 14px;
        border-radius: 10px;
        border: 1px solid #444;
        background: #111;
        color: white;
        outline: none;
      }

      .mtech-login-box input:focus {
        border-color: #e00000;
      }

      .mtech-login-button {
        width: 100%;
        border: 0;
        border-radius: 10px;
        padding: 15px;
        background: #e00000;
        color: white;
        font-weight: 800;
        cursor: pointer;
      }

      .mtech-login-button:hover {
        background: #c00000;
      }

      #loginMessage {
        margin-top: 15px;
        color: #ff6b6b;
        font-size: 14px;
      }

      .back-site {
        display: block;
        margin-top: 25px;
        text-align: center;
        color: #aaa;
        text-decoration: none;
      }
    </style>
  `;

  document
    .getElementById("loginForm")
    .addEventListener("submit", loginAdmin);
}

async function loginAdmin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const message = document.getElementById("loginMessage");
  const button = document.querySelector(".mtech-login-button");

  button.disabled = true;
  button.textContent = "CONNEXION...";

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    message.textContent =
      "E-mail ou mot de passe incorrect.";

    button.disabled = false;
    button.textContent = "SE CONNECTER";
    return;
  }

  showDashboard(data.user);
}

// ======================================================
// DASHBOARD
// ======================================================

function showDashboard(user) {
  location.reload();
}

// ======================================================
// CHARGER LES SLIDES SUPABASE
// ======================================================

async function loadSlides() {
  const { data, error } = await supabaseClient
    .from("hero_slides")
    .select("*")
    .order("sort_order", {
      ascending: true
    });

  if (error) {
    console.error(error);

    alert(
      "Erreur lors du chargement des slides : " +
      error.message
    );

    return;
  }

  slides = data || [];

  renderSlides();
}

// ======================================================
// RENDRE LES SLIDES
// ======================================================

function renderSlides() {
  const container =
    document.getElementById("slidesList");

  if (!container) return;

  if (!slides.length) {
    container.innerHTML = `
      <div class="empty-state">
        <strong>Aucun média pour le moment.</strong>
        <p>
          Clique sur « + Ajouter un média »
          pour ajouter une photo ou une vidéo.
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = slides
    .map(
      (s, i) => `
      <div class="slide-item">

        <div class="preview">

          ${
            s.media_url
              ? s.media_type === "video"
                ? `
                  <video
                    muted
                    controls
                    src="${escapeHTML(s.media_url)}">
                  </video>
                `
                : `
                  <img
                    src="${escapeHTML(s.media_url)}"
                    alt="${escapeHTML(s.title || "")}">
                `
              : "Aucun média"
          }

        </div>

        <div class="item-info">

          <h3>
            ${escapeHTML(
              s.title || "Sans titre"
            )}
          </h3>

          <p>
            ${escapeHTML(
              s.badge || ""
            )}
            ·
            ${escapeHTML(
              s.subtitle || ""
            )}
          </p>

        </div>

        <div class="item-actions">

          <button onclick="editSlide(${i})">
            Modifier
          </button>

          <button
            onclick="moveSlide(${i}, -1)">
            ↑
          </button>

          <button
            onclick="moveSlide(${i}, 1)">
            ↓
          </button>

          <button
            class="danger"
            onclick="deleteSlide(${i})">
            Supprimer
          </button>

        </div>

      </div>
    `
    )
    .join("");
}

// ======================================================
// AJOUTER UNE IMAGE / VIDEO
// ======================================================

const mediaFile =
  document.getElementById("mediaFile");

if (mediaFile) {
  mediaFile.addEventListener(
    "change",
    uploadHeroMedia
  );
}

async function uploadHeroMedia(event) {
  const file = event.target.files[0];

  if (!file) return;

  const allowedImage =
    file.type.startsWith("image/");

  const allowedVideo =
    file.type.startsWith("video/");

  if (!allowedImage && !allowedVideo) {
    alert(
      "Choisis uniquement une image ou une vidéo."
    );

    event.target.value = "";
    return;
  }

  if (file.size > 50 * 1024 * 1024) {
    alert(
      "Le fichier ne doit pas dépasser 50 MB."
    );

    event.target.value = "";
    return;
  }

  try {
    const extension =
      file.name.split(".").pop();

    const randomName =
      `${crypto.randomUUID()}.${extension}`;

    const filePath =
      `hero/${randomName}`;

    alert("Envoi du fichier en cours...");

    const { error: uploadError } =
      await supabaseClient
        .storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false
        });

    if (uploadError) {
      console.error(uploadError);

      alert(
        "Erreur lors de l'envoi : " +
        uploadError.message
      );

      event.target.value = "";
      return;
    }

    const {
      data: publicData
    } =
      supabaseClient
        .storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

    const mediaUrl =
      publicData.publicUrl;

    const nextOrder =
      slides.length
        ? Math.max(
            ...slides.map(
              s => Number(s.sort_order) || 0
            )
          ) + 1
        : 0;

    const { error: insertError } =
      await supabaseClient
        .from("hero_slides")
        .insert({
          media_url: mediaUrl,
          media_type: allowedVideo
            ? "video"
            : "image",
          badge: "NOUVEAUTÉ",
          title: "Nouveau produit",
          subtitle: "",
          description:
            "Ajoute ta description ici.",
          tag: "Disponible",
          button_text: "Découvrir",
          button_link: "#products",
          sort_order: nextOrder,
          is_active: true
        });

    if (insertError) {
      console.error(insertError);

      alert(
        "Le fichier a été envoyé mais la slide n'a pas pu être créée : " +
        insertError.message
      );

      return;
    }

    alert("Média ajouté avec succès.");

    event.target.value = "";

    await loadSlides();

  } catch (error) {
    console.error(error);

    alert(
      "Une erreur est survenue : " +
      error.message
    );

    event.target.value = "";
  }
}

// ======================================================
// MODIFIER UNE SLIDE
// ======================================================

function editSlide(i) {
  const s = slides[i];

  const form =
    document.getElementById("mediaForm");

  if (!form) return;

  form.innerHTML = `
    <label>
      Badge
      <input
        id="fBadge"
        value="${escapeAttribute(s.badge)}">
    </label>

    <label>
      Titre
      <input
        id="fTitle"
        value="${escapeAttribute(s.title)}">
    </label>

    <label>
      Sous-titre
      <input
        id="fSubtitle"
        value="${escapeAttribute(s.subtitle)}">
    </label>

    <label>
      Tag
      <input
        id="fTag"
        value="${escapeAttribute(s.tag)}">
    </label>

    <label class="wide">
      Description
      <textarea
        id="fDesc">${escapeHTML(
          s.description || ""
        )}</textarea>
    </label>

    <label>
      Texte du bouton
      <input
        id="fButton"
        value="${escapeAttribute(
          s.button_text
        )}">
    </label>

    <label>
      Lien du bouton
      <input
        id="fLink"
        value="${escapeAttribute(
          s.button_link
        )}">
    </label>

    <div class="wide">
      <button
        class="primary"
        onclick="saveSlide(${i})">
        Enregistrer ce slide
      </button>
    </div>
  `;

  window.scrollTo({
    top:
      form.offsetTop - 80,
    behavior: "smooth"
  });
}

// ======================================================
// ENREGISTRER UNE SLIDE
// ======================================================

async function saveSlide(i) {
  const s = slides[i];

  const updates = {
    badge: getValue("fBadge"),
    title: getValue("fTitle"),
    subtitle: getValue("fSubtitle"),
    tag: getValue("fTag"),
    description: getValue("fDesc"),
    button_text: getValue("fButton"),
    button_link: getValue("fLink")
  };

  const {
    error
  } = await supabaseClient
    .from("hero_slides")
    .update(updates)
    .eq("id", s.id);

  if (error) {
    alert(
      "Erreur : " +
      error.message
    );

    return;
  }

  document.getElementById(
    "mediaForm"
  ).innerHTML = "";

  await loadSlides();

  alert("Slide enregistrée.");
}

// ======================================================
// SUPPRIMER UNE SLIDE
// ======================================================

async function deleteSlide(i) {
  const s = slides[i];

  if (
    !confirm(
      "Veux-tu vraiment supprimer ce média ?"
    )
  ) {
    return;
  }

  const {
    error
  } = await supabaseClient
    .from("hero_slides")
    .delete()
    .eq("id", s.id);

  if (error) {
    alert(
      "Erreur lors de la suppression : " +
      error.message
    );

    return;
  }

  // Suppression du fichier dans Storage
  if (s.media_url) {
    try {
      const fileName =
        decodeURIComponent(
          new URL(
            s.media_url
          ).pathname
            .split("/")
            .pop()
        );

      if (fileName) {
        await supabaseClient
          .storage
          .from(STORAGE_BUCKET)
          .remove([
            `hero/${fileName}`
          ]);
      }
    } catch (error) {
      console.warn(
        "Le fichier Storage n'a pas pu être supprimé.",
        error
      );
    }
  }

  await loadSlides();
}

// ======================================================
// CHANGER L'ORDRE
// ======================================================

async function moveSlide(i, direction) {
  const newIndex =
    i + direction;

  if (
    newIndex < 0 ||
    newIndex >= slides.length
  ) {
    return;
  }

  const current =
    slides[i];

  const target =
    slides[newIndex];

  const currentOrder =
    current.sort_order;

  const targetOrder =
    target.sort_order;

  const firstUpdate =
    await supabaseClient
      .from("hero_slides")
      .update({
        sort_order: targetOrder
      })
      .eq("id", current.id);

  if (firstUpdate.error) {
    alert(
      firstUpdate.error.message
    );

    return;
  }

  const secondUpdate =
    await supabaseClient
      .from("hero_slides")
      .update({
        sort_order: currentOrder
      })
      .eq("id", target.id);

  if (secondUpdate.error) {
    alert(
      secondUpdate.error.message
    );

    return;
  }

  await loadSlides();
}

// ======================================================
// PRODUITS
// ======================================================

function saveProducts() {
  localStorage.setItem(
    "mtech_products",
    JSON.stringify(products)
  );
}

function renderProducts() {
  const container =
    document.getElementById(
      "productsList"
    );

  if (!container) return;

  container.innerHTML =
    products
      .map(
        (p, i) => `
        <div class="product-item">

          <div class="preview">
            ${
              p.image
                ? `<img src="${escapeHTML(
                    p.image
                  )}">`
                : escapeHTML(
                    p.icon || "📦"
                  )
            }
          </div>

          <div class="item-info">

            <h3>
              ${escapeHTML(p.name)}
            </h3>

            <p>
              ${escapeHTML(p.cat)}
              ·
              ${
                p.price
                  ? new Intl.NumberFormat(
                      "fr-FR"
                    ).format(p.price) +
                    " FCFA"
                  : "Prix sur demande"
              }
            </p>

          </div>

          <div class="item-actions">

            <button
              onclick="editProduct(${i})">
              Modifier
            </button>

            <button
              class="danger"
              onclick="deleteProduct(${i})">
              Supprimer
            </button>

          </div>

        </div>
      `
      )
      .join("");
}

function addProduct() {
  products.push({
    id: Date.now(),
    name: "Nouveau produit",
    cat: "Catégorie",
    price: 0,
    icon: "📦",
    image: ""
  });

  saveProducts();

  renderProducts();

  editProduct(
    products.length - 1
  );
}

function editProduct(i) {
  const p = products[i];

  const container =
    document.getElementById(
      "productsList"
    );

  container.insertAdjacentHTML(
    "afterbegin",
    `
      <div
        class="admin-card"
        id="editProductBox">

        <div class="form-grid">

          <label>
            Nom
            <input
              id="pName"
              value="${escapeAttribute(
                p.name
              )}">
          </label>

          <label>
            Catégorie
            <input
              id="pCat"
              value="${escapeAttribute(
                p.cat
              )}">
          </label>

          <label>
            Prix FCFA
            <input
              id="pPrice"
              type="number"
              value="${p.price}">
          </label>

          <label>
            Icône / emoji
            <input
              id="pIcon"
              value="${escapeAttribute(
                p.icon
              )}">
          </label>

        </div>

        <button
          class="primary"
          onclick="saveProduct(${i})">
          Enregistrer
        </button>

      </div>
    `
  );

  document
    .getElementById(
      "editProductBox"
    )
    .scrollIntoView({
      behavior: "smooth"
    });
}

function saveProduct(i) {
  Object.assign(
    products[i],
    {
      name:
        getValue("pName"),

      cat:
        getValue("pCat"),

      price:
        Number(
          getValue("pPrice")
        ) || 0,

      icon:
        getValue("pIcon")
    }
  );

  saveProducts();

  renderProducts();

  document
    .getElementById(
      "editProductBox"
    )
    ?.remove();
}

function deleteProduct(i) {
  if (
    !confirm(
      "Supprimer ce produit ?"
    )
  ) {
    return;
  }

  products.splice(i, 1);

  saveProducts();

  renderProducts();
}

// ======================================================
// PARAMETRES
// ======================================================

function saveSettings() {
  const whatsapp =
    document.getElementById(
      "whatsapp"
    )?.value;

  if (whatsapp) {
    localStorage.setItem(
      "mtech_whatsapp",
      whatsapp
    );
  }

  alert(
    "Paramètres enregistrés."
  );
}

// ======================================================
// DECONNEXION
// ======================================================

async function logoutAdmin() {
  await supabaseClient.auth.signOut();

  location.reload();
}

// ======================================================
// OUTILS
// ======================================================

function getValue(id) {
  return (
    document.getElementById(id)
      ?.value || ""
  );
}

function escapeHTML(value) {
  return String(
    value ?? ""
  ).replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[char]
  );
}

function escapeAttribute(value) {
  return escapeHTML(value);
}

function showError(message) {
  document.body.innerHTML = `
    <div
      style="
        min-height:100vh;
        display:flex;
        justify-content:center;
        align-items:center;
        background:#111;
        color:white;
        padding:30px;
        text-align:center;
        font-family:Arial;
      "
    >
      <div>
        <h1>MTECH BENIN</h1>
        <p>${escapeHTML(message)}</p>
      </div>
    </div>
  `;
}

// ======================================================
// INITIALISATION DU DASHBOARD
// ======================================================

// On vérifie d'abord si l'utilisateur est connecté.
// Si oui, on charge les données.
(async function initializeDashboard() {

  const {
    data: {
      session
    }
  } =
    await supabaseClient.auth.getSession();

  if (!session) {
    showLoginScreen();
    return;
  }

  await loadSlides();

  renderProducts();

})();
