/* =====================================================
   MTECHBENIN — DASHBOARD
   ===================================================== */


/* ================= DONNÉES ================= */

let slides =
  JSON.parse(
    localStorage.getItem("mtech_hero")
  ) || [

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
    }

  ];


let products =
  JSON.parse(
    localStorage.getItem("mtech_products")
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


/* ================= OUTILS ================= */

function saveHero() {

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


function escapeHtml(value) {

  return String(value ?? "")
    .replace(
      /[&<>"']/g,

      function(character) {

        return {

          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;"

        }[character];

      }
    );

}


/* =====================================================
   AJOUTER PHOTO / VIDÉO
   ===================================================== */

function openMediaPicker() {

  document
    .getElementById("mediaFile")
    .click();

}


document
  .getElementById("mediaFile")
  .addEventListener(
    "change",

    function(event) {

      const file =
        event.target.files[0];


      if (!file) {

        return;

      }


      const reader =
        new FileReader();


      reader.onload =
        function() {

          const type =
            file.type.startsWith(
              "video/"
            )

              ?

              "video"

              :

              "image";


          slides.push({

            type: type,

            src: reader.result,

            badge: "NOUVEAUTÉ",

            title: "Nouveau produit",

            subtitle: "",

            description:
              "Ajoute ta description ici.",

            tag: "Disponible",

            button: "Découvrir",

            link: "#products"

          });


          saveHero();

          renderSlides();

        };


      reader.readAsDataURL(file);


      event.target.value = "";

    }
  );


/* =====================================================
   AFFICHER LES SLIDES
   ===================================================== */

function renderSlides() {

  const container =
    document.getElementById(
      "slidesList"
    );


  container.innerHTML =

    slides

      .map(

        function(slide, index) {

          return `

            <div
              class="slide-item">


              <div
                class="preview">

                ${
                  slide.src

                    ?

                    slide.type === "video"

                      ?

                      `

                      <video
                        muted
                        src="${slide.src}">
                      </video>

                      `

                      :

                      `

                      <img
                        src="${slide.src}">
                      `

                    :

                    "Aucun média"
                }

              </div>


              <div
                class="item-info">

                <h3>

                  ${escapeHtml(
                    slide.title
                  )}

                </h3>


                <p>

                  ${escapeHtml(
                    slide.badge
                  )}

                  ·

                  ${escapeHtml(
                    slide.subtitle
                  )}

                </p>

              </div>


              <div
                class="item-actions">


                <button
                  onclick="editSlide(
                    ${index}
                  )">

                  Modifier

                </button>


                <button
                  onclick="moveSlide(
                    ${index},
                    -1
                  )">

                  ↑

                </button>


                <button
                  onclick="moveSlide(
                    ${index},
                    1
                  )">

                  ↓

                </button>


                <button
                  class="danger"
                  onclick="deleteSlide(
                    ${index}
                  )">

                  Supprimer

                </button>


              </div>


            </div>

          `;

        }

      )

      .join("");

}


/* =====================================================
   MODIFIER UN SLIDE
   ===================================================== */

function editSlide(index) {

  const slide =
    slides[index];


  document.getElementById(
    "mediaForm"
  ).innerHTML = `


    <label>

      Badge

      <input
        id="slideBadge"
        value="${escapeHtml(
          slide.badge
        )}">

    </label>


    <label>

      Titre

      <input
        id="slideTitle"
        value="${escapeHtml(
          slide.title
        )}">

    </label>


    <label>

      Sous-titre

      <input
        id="slideSubtitle"
        value="${escapeHtml(
          slide.subtitle
        )}">

    </label>


    <label>

      Tag

      <input
        id="slideTag"
        value="${escapeHtml(
          slide.tag
        )}">

    </label>


    <label class="wide">

      Description

      <textarea
        id="slideDescription">

${escapeHtml(
  slide.description
)}

      </textarea>

    </label>


    <label>

      Texte du bouton

      <input
        id="slideButton"
        value="${escapeHtml(
          slide.button
        )}">

    </label>


    <label>

      Lien du bouton

      <input
        id="slideLink"
        value="${escapeHtml(
          slide.link
        )}">

    </label>


    <div class="wide">

      <button
        class="primary"
        onclick="saveSlide(
          ${index}
        )">

        Enregistrer

      </button>

    </div>

  `;

}


/* =====================================================
   ENREGISTRER LE SLIDE
   ===================================================== */

function saveSlide(index) {

  slides[index].badge =
    document.getElementById(
      "slideBadge"
    ).value;


  slides[index].title =
    document.getElementById(
      "slideTitle"
    ).value;


  slides[index].subtitle =
    document.getElementById(
      "slideSubtitle"
    ).value;


  slides[index].tag =
    document.getElementById(
      "slideTag"
    ).value;


  slides[index].description =
    document.getElementById(
      "slideDescription"
    ).value;


  slides[index].button =
    document.getElementById(
      "slideButton"
    ).value;


  slides[index].link =
    document.getElementById(
      "slideLink"
    ).value;


  saveHero();

  renderSlides();


  document.getElementById(
    "mediaForm"
  ).innerHTML = "";

}


/* =====================================================
   SUPPRIMER
   ===================================================== */

function deleteSlide(index) {

  if (
    !confirm(
      "Supprimer cette première plan ?"
    )
  ) {

    return;

  }


  slides.splice(
    index,
    1
  );


  saveHero();

  renderSlides();

}


/* =====================================================
   CHANGER ORDRE
   ===================================================== */

function moveSlide(
  index,
  direction
) {

  const newIndex =
    index + direction;


  if (
    newIndex < 0 ||
    newIndex >= slides.length
  ) {

    return;

  }


  const temp =
    slides[index];


  slides[index] =
    slides[newIndex];


  slides[newIndex] =
    temp;


  saveHero();

  renderSlides();

}


/* =====================================================
   PRODUITS
   ===================================================== */

function renderProducts() {

  const container =
    document.getElementById(
      "productsList"
    );


  container.innerHTML =

    products
      .map(

        function(product, index) {

          return `

            <div
              class="product-item">


              <div
                class="preview">

                ${
                  product.image

                    ?

                    `<img
                      src="${product.image}">`

                    :

                    product.icon ||
                    "📦"
                }

              </div>


              <div
                class="item-info">

                <h3>

                  ${escapeHtml(
                    product.name
                  )}

                </h3>


                <p>

                  ${escapeHtml(
                    product.cat
                  )}

                  ·

                  ${
                    product.price
                      ? product.price +
                        " FCFA"
                      : "Prix sur demande"
                  }

                </p>

              </div>


              <div
                class="item-actions">

                <button
                  onclick="editProduct(
                    ${index}
                  )">

                  Modifier

                </button>


                <button
                  class="danger"
                  onclick="deleteProduct(
                    ${index}
                  )">

                  Supprimer

                </button>

              </div>


            </div>

          `;

        }

      )

      .join("");

}


/* =====================================================
   NOUVEAU PRODUIT
   ===================================================== */

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

}


/* =====================================================
   MODIFIER PRODUIT
   ===================================================== */

function editProduct(index) {

  const product =
    products[index];


  const name =
    prompt(
      "Nom du produit :",
      product.name
    );


  if (name === null) {

    return;

  }


  const category =
    prompt(
      "Catégorie :",
      product.cat
    );


  if (category === null) {

    return;

  }


  const price =
    prompt(
      "Prix en FCFA :",
      product.price
    );


  if (price === null) {

    return;

  }


  product.name =
    name;


  product.cat =
    category;


  product.price =
    Number(price) || 0;


  saveProducts();

  renderProducts();

}


/* =====================================================
   SUPPRIMER PRODUIT
   ===================================================== */

function deleteProduct(index) {

  if (
    !confirm(
      "Supprimer ce produit ?"
    )
  ) {

    return;

  }


  products.splice(
    index,
    1
  );


  saveProducts();

  renderProducts();

}


/* =====================================================
   PARAMÈTRES
   ===================================================== */

function saveSettings() {

  const whatsapp =
    document.getElementById(
      "whatsapp"
    ).value;


  localStorage.setItem(
    "mtech_whatsapp",
    whatsapp
  );


  alert(
    "Paramètres enregistrés."
  );

}


/* =====================================================
   INITIALISATION
   ===================================================== */

renderSlides();

renderProducts();
