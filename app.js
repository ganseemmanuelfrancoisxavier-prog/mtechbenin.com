/* =========================================================
   MTECHBENIN — APP.JS
   Slider + Produits + Panier + Recherche
   ========================================================= */


/* =========================================================
   1. CONTENU DU PREMIER PLAN
   ========================================================= */

const defaultHeroSlides = [

  {
    type: "image",

    src: "",

    badge: "BEST SELLER",

    title: "JBL Boombox",

    subtitle: "4ème Génération",

    description:
      "Son puissant, basses profondes. La référence des enceintes Bluetooth au Bénin.",

    tag: "Authentique",

    button: "Voir les enceintes",

    link: "#products"
  },


  {
    type: "image",

    src: "",

    badge: "NOUVEAUTÉ",

    title: "La technologie",

    subtitle: "à portée de main",

    description:
      "Découvrez les produits et accessoires disponibles chez MTECHBENIN.",

    tag: "Disponible",

    button: "Découvrir",

    link: "#products"
  }

];


/* =========================================================
   2. PRODUITS
   ========================================================= */

const defaultProducts = [

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


/* =========================================================
   3. CHARGEMENT DES DONNÉES
   ========================================================= */

let slides =
  JSON.parse(
    localStorage.getItem("mtech_hero")
  ) || defaultHeroSlides;


let products =
  JSON.parse(
    localStorage.getItem("mtech_products")
  ) || defaultProducts;


let cart =
  JSON.parse(
    localStorage.getItem("mtech_cart")
  ) || [];


let currentSlide = 0;


/* =========================================================
   4. SAUVEGARDE
   ========================================================= */

function saveCart() {

  localStorage.setItem(
    "mtech_cart",
    JSON.stringify(cart)
  );

}


function saveSlides() {

  localStorage.setItem(
    "mtech_hero",
    JSON.stringify(slides)
  );

}


function saveProducts() {

  localStorage.setItem(
    "mtech_products",
    JSON.stringify(products)
  );

}


/* =========================================================
   5. FORMAT PRIX
   ========================================================= */

function formatPrice(price) {

  if (!price || price <= 0) {

    return "Prix sur demande";

  }


  return new Intl.NumberFormat(
    "fr-FR"
  ).format(price) + " FCFA";

}


/* =========================================================
   6. PROTECTION HTML
   ========================================================= */

function escapeHtml(value) {

  return String(value ?? "")
    .replace(
      /[&<>"']/g,

      function(character) {

        const entities = {

          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;"

        };

        return entities[character];

      }
    );

}


/* =========================================================
   7. AFFICHER LE PREMIER PLAN
   ========================================================= */

function renderHero() {

  if (!slides.length) {

    return;

  }


  const slide =
    slides[currentSlide];


  const heroMedia =
    document.getElementById(
      "heroMedia"
    );


  /* ================= MEDIA ================= */

  if (slide.src) {

    if (slide.type === "video") {

      heroMedia.innerHTML = `

        <video
          autoplay
          muted
          loop
          playsinline
          src="${escapeHtml(slide.src)}">
        </video>

      `;

    }

    else {

      heroMedia.innerHTML = `

        <img
          src="${escapeHtml(slide.src)}"
          alt="${escapeHtml(slide.title)}">

      `;

    }

  }

  else {

    /*
      Aucun fichier n'est encore installé.
      Le fond noir/bleu du CSS sera utilisé.
    */

    heroMedia.innerHTML = "";

  }


  /* ================= BADGE ================= */

  const badge =
    document.getElementById(
      "heroBadge"
    );


  badge.innerHTML = `

    <span></span>

    ${escapeHtml(
      slide.badge || "MTECHBENIN"
    )}

  `;


  /* ================= TITRE ================= */

  document.getElementById(
    "heroTitle"
  ).textContent =
    slide.title || "";


  /* ================= SOUS TITRE ================= */

  document.getElementById(
    "heroSubtitle"
  ).textContent =
    slide.subtitle || "";


  /* ================= DESCRIPTION ================= */

  document.getElementById(
    "heroDescription"
  ).textContent =
    slide.description || "";


  /* ================= TAG ================= */

  document.getElementById(
    "heroTag"
  ).textContent =
    slide.tag || "";


  /* ================= BOUTON ================= */

  const button =
    document.getElementById(
      "heroButton"
    );


  button.innerHTML = `

    ${escapeHtml(
      slide.button || "Découvrir"
    )}

    <span>→</span>

  `;


  button.href =
    slide.link || "#products";


  /* ================= POINTS ================= */

  const dots =
    document.getElementById(
      "heroDots"
    );


  dots.innerHTML =
    slides
      .map(

        function(_, index) {

          return `

            <span
              class="hero-dot ${
                index === currentSlide
                  ? "active"
                  : ""
              }">
            </span>

          `;

        }

      )
      .join("");

}
async function chargerDiapositivesSupabase() {
    if (!window.supabaseClient) return;

    const { data, error } = await window.supabaseClient
        .from("hero_slides")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("Erreur Supabase :", error);
        return;
    }

    if (!data || !data.length) return;

    diapositives.splice(
        0,
        diapositives.length,
        ...data.map(slide => ({
            taper: slide.media_type || "image",
            source: slide.media_url || "",
            badge: slide.badge || "",
            titre: slide.title || "",
            sous_titre: slide.subtitle || "",
            description: slide.description || "",
            tag: slide.tag || "",
            texte_bouton: slide.button_text || "",
            lien_bouton: slide.button_link || ""
        }))
    );

    diapositive_actuelle = 0;
    renderHero();
}

chargerDiapositivesSupabase();

/* =========================================================
   8. SLIDER AUTOMATIQUE
   ========================================================= */

function nextSlide() {

  if (slides.length <= 1) {

    return;

  }


  currentSlide =
    (currentSlide + 1)
    % slides.length;


  renderHero();

}


/*
   Change automatiquement de slide
   toutes les 6 secondes.
*/

setInterval(

  function() {

    nextSlide();

  },

  6000

);


/* =========================================================
   9. AFFICHAGE DES PRODUITS
   ========================================================= */

function renderProducts(
  search = ""
) {

  const productGrid =
    document.getElementById(
      "productGrid"
    );


  const searchResults =
    document.getElementById(
      "searchResults"
    );


  const query =
    search
      .trim()
      .toLowerCase();


  const filteredProducts =
    products.filter(

      function(product) {

        return (

          product.name
            .toLowerCase()
            .includes(query)

          ||

          product.cat
            .toLowerCase()
            .includes(query)

        );

      }

    );


  /* ================= HTML PRODUITS ================= */

  const html =
    filteredProducts
      .map(

        function(product) {

          return `

            <article
              class="product">

              <div
                class="product-image">

                ${
                  product.image

                    ?

                    `

                    <img
                      src="${escapeHtml(
                        product.image
                      )}"

                      alt="${escapeHtml(
                        product.name
                      )}">

                    `

                    :

                    `

                    <div
                      class="product-placeholder">

                      ${
                        product.icon ||
                        "📦"
                      }

                    </div>

                    `
                }

              </div>


              <div
                class="product-info">

                <span
                  class="product-cat">

                  ${escapeHtml(
                    product.cat
                  )}

                </span>


                <h3>

                  ${escapeHtml(
                    product.name
                  )}

                </h3>


                <div
                  class="price">

                  ${formatPrice(
                    product.price
                  )}

                </div>


                <button
                  class="add"
                  onclick="addToCart(
                    ${product.id}
                  )">

                  Ajouter au panier

                </button>

              </div>

            </article>

          `;

        }

      )
      .join("");


  /* ================= BOUTIQUE ================= */

  if (productGrid) {

    productGrid.innerHTML =
      html ||

      `

        <div class="empty">

          Aucun produit trouvé.

        </div>

      `;

  }


  /* ================= RECHERCHE ================= */

  if (searchResults) {

    searchResults.innerHTML =
      html ||

      `

        <div class="empty">

          Aucun résultat.

        </div>

      `;

  }

}


/* =========================================================
   10. AJOUTER AU PANIER
   ========================================================= */

function addToCart(productId) {

  const product =
    products.find(

      function(item) {

        return item.id === productId;

      }

    );


  if (!product) {

    return;

  }


  const existing =
    cart.find(

      function(item) {

        return item.id === productId;

      }

    );


  if (existing) {

    existing.qty++;

  }

  else {

    cart.push({

      id: productId,

      qty: 1

    });

  }


  saveCart();

  renderCart();

  openCart();

}


/* =========================================================
   11. AFFICHER LE PANIER
   ========================================================= */

function renderCart() {

  const cartItems =
    document.getElementById(
      "cartItems"
    );


  const cartBadge =
    document.getElementById(
      "cartBadge"
    );


  const cartTotal =
    document.getElementById(
      "cartTotal"
    );


  if (!cartItems) {

    return;

  }


  let total = 0;


  let quantity = 0;


  /* ================= PANIER VIDE ================= */

  if (cart.length === 0) {

    cartItems.innerHTML = `

      <div class="empty">

        Votre panier est vide.

      </div>

    `;


    cartBadge.textContent = "0";

    cartTotal.textContent =
      "0 FCFA";


    return;

  }


  /* ================= PRODUITS ================= */

  cartItems.innerHTML =

    cart

      .map(

        function(item, index) {

          const product =
            products.find(

              function(p) {

                return p.id === item.id;

              }

            );


          if (!product) {

            return "";

          }


          quantity += item.qty;


          if (product.price > 0) {

            total +=
              product.price *
              item.qty;

          }


          return `

            <div
              class="cart-row">


              <div
                class="cart-thumb">

                ${
                  product.image

                    ?

                    `

                    <img
                      src="${escapeHtml(
                        product.image
                      )}"

                      alt="">

                    `

                    :

                    (
                      product.icon ||
                      "📦"
                    )
                }

              </div>


              <main>

                <h4>

                  ${escapeHtml(
                    product.name
                  )}

                </h4>


                <p>

                  Quantité :
                  ${item.qty}

                </p>


                <p>

                  ${
                    product.price > 0

                      ?

                      formatPrice(
                        product.price *
                        item.qty
                      )

                      :

                      "Prix sur demande"

                  }

                </p>


                <button
                  class="remove"
                  onclick="removeFromCart(
                    ${index}
                  )">

                  Supprimer

                </button>

              </main>


            </div>

          `;

        }

      )

      .join("");


  cartBadge.textContent =
    quantity;


  cartTotal.textContent =
    total > 0

      ?

      formatPrice(total)

      :

      "À confirmer";

}


/* =========================================================
   12. SUPPRIMER DU PANIER
   ========================================================= */

function removeFromCart(index) {

  cart.splice(
    index,
    1
  );


  saveCart();

  renderCart();

}


/* =========================================================
   13. OUVRIR LE PANIER
   ========================================================= */

function openCart() {

  closeAllPanels();


  const cartDrawer =
    document.getElementById(
      "cartDrawer"
    );


  const overlay =
    document.getElementById(
      "overlay"
    );


  cartDrawer.classList.add(
    "open"
  );


  overlay.classList.add(
    "open"
  );


  renderCart();

}


/* =========================================================
   14. RECHERCHE
   ========================================================= */

function openSearch() {

  closeAllPanels();


  const searchDrawer =
    document.getElementById(
      "searchDrawer"
    );


  const overlay =
    document.getElementById(
      "overlay"
    );


  searchDrawer.classList.add(
    "open"
  );


  overlay.classList.add(
    "open"
  );


  const input =
    document.getElementById(
      "searchInput"
    );


  setTimeout(

    function() {

      input.focus();

    },

    200

  );

}


/* =========================================================
   15. FERMER LES PANNEAUX
   ========================================================= */

function closeAllPanels() {

  document
    .querySelectorAll(
      ".drawer"
    )
    .forEach(

      function(drawer) {

        drawer.classList.remove(
          "open"
        );

      }

    );


  const overlay =
    document.getElementById(
      "overlay"
    );


  if (overlay) {

    overlay.classList.remove(
      "open"
    );

  }

}


/* =========================================================
   16. MENU MOBILE
   ========================================================= */

function toggleMenu() {

  const menu =
    document.getElementById(
      "mobileMenu"
    );


  menu.classList.toggle(
    "open"
  );

}


/* =========================================================
   17. COMMANDE WHATSAPP
   ========================================================= */

function checkoutWhatsApp() {

  if (cart.length === 0) {

    alert(
      "Votre panier est vide."
    );

    return;

  }


  let message =
    "Bonjour MTECHBENIN,%0A%0A";

  message +=
    "Je souhaite passer une commande :%0A%0A";


  cart.forEach(

    function(item) {

      const product =
        products.find(

          function(p) {

            return p.id === item.id;

          }

        );


      if (product) {

        message +=

          "• " +

          product.name +

          " x" +

          item.qty +

          "%0A";

      }

    }

  );


  message +=
    "%0AMerci de me confirmer la disponibilité et le prix.";


  /*
    Numéro WhatsApp MTECH BENIN
  */

  const whatsapp =
    "22960506320";


  window.open(

    "https://wa.me/" +
    whatsapp +
    "?text=" +
    message,

    "_blank"

  );

}


/* =========================================================
   18. INITIALISATION
   ========================================================= */

renderHero();

renderProducts();

renderCart();
