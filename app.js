/* =====================================================
   MTECH BENIN — APP.JS
   Gestion des produits, panier et interactions
   ===================================================== */

// ================= DONNÉES PRODUITS =================

const products = [
  {
    id: 1,
    name: "Routeur WiFi Pro",
    category: "Réseau",
    price: 25000,
    icon: "📶"
  },
  {
    id: 2,
    name: "Câble Ethernet 10m",
    category: "Accessoires",
    price: 8000,
    icon: "🔌"
  },
  {
    id: 3,
    name: "Hub USB 3.0",
    category: "Accessoires",
    price: 15000,
    icon: "💾"
  },
  {
    id: 4,
    name: "Souris Wireless",
    category: "Périphériques",
    price: 12000,
    icon: "🖱️"
  },
  {
    id: 5,
    name: "Clavier Mécanique",
    category: "Périphériques",
    price: 45000,
    icon: "⌨️"
  },
  {
    id: 6,
    name: "Écran LED 24\"",
    category: "Écrans",
    price: 120000,
    icon: "🖥️"
  },
  {
    id: 7,
    name: "Antivirus Premium",
    category: "Logiciels",
    price: 35000,
    icon: "🔒"
  },
  {
    id: 8,
    name: "SSD 512GB",
    category: "Stockage",
    price: 65000,
    icon: "💿"
  }
];

// ================= PANIER =================

let cart = JSON.parse(localStorage.getItem('mtech_cart')) || [];

// Sauvegarder le panier
function saveCart() {
  localStorage.setItem('mtech_cart', JSON.stringify(cart));
}

// Formater le prix
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

// Mettre à jour le badge du panier
function updateCartBadge() {
  const count = cart.reduce((total, item) => total + item.qty, 0);
  document.getElementById('cartCount').textContent = count;
}

// Afficher les produits
function renderProducts(filter = '') {
  const grid = document.getElementById('productsGrid');
  
  const filtered = filter 
    ? products.filter(p => 
        p.name.toLowerCase().includes(filter.toLowerCase()) ||
        p.category.toLowerCase().includes(filter.toLowerCase())
      )
    : products;

  grid.innerHTML = filtered.map(product => `
    <div class="product-card">
      <div class="product-image">${product.icon}</div>
      <div class="product-info">
        <span class="product-cat">${product.category}</span>
        <h3>${product.name}</h3>
        <div class="product-price">${formatPrice(product.price)}</div>
        <div class="product-actions">
          <button class="add-to-cart" onclick="addToCart(${product.id})">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (!filtered.length) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">Aucun produit trouvé</p>';
  }
}

// Rechercher des produits
function searchProducts() {
  const input = document.getElementById('searchInput').value;
  renderProducts(input);
}

// Ajouter au panier
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: productId,
      qty: 1
    });
  }

  saveCart();
  updateCartBadge();
  renderCart();
  openCart();
}

// Afficher le panier
function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
    cartTotal.textContent = '0 FCFA';
    return;
  }

  let total = 0;
  cartItems.innerHTML = cart.map((item, index) => {
    const product = products.find(p => p.id === item.id);
    if (!product) return '';
    
    const itemTotal = product.price * item.qty;
    total += itemTotal;

    return `
      <div class="cart-item">
        <div class="cart-item-image">${product.icon}</div>
        <div class="cart-item-info">
          <h4>${product.name}</h4>
          <p>Quantité: ${item.qty}</p>
          <p>${formatPrice(itemTotal)}</p>
          <button class="remove-item" onclick="removeFromCart(${index})">
            Supprimer
          </button>
        </div>
      </div>
    `;
  }).join('');

  cartTotal.textContent = formatPrice(total);
}

// Supprimer du panier
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartBadge();
  renderCart();
}

// Ouvrir le panier
function openCart() {
  document.getElementById('cartPanel').classList.add('active');
  document.getElementById('overlay').classList.add('active');
  renderCart();
}

// Fermer le panier
function closeCart() {
  document.getElementById('cartPanel').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
}

// Menu mobile
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('active');
}

// Commander via WhatsApp
function checkoutWhatsApp() {
  if (!cart.length) {
    alert('Votre panier est vide');
    return;
  }

  let message = 'Bonjour MTECH BENIN,%0A%0AJe souhaite commander:%0A%0A';
  
  let total = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    if (product) {
      const itemTotal = product.price * item.qty;
      total += itemTotal;
      message += `• ${product.name} (x${item.qty}) - ${formatPrice(itemTotal)}%0A`;
    }
  });

  message += `%0ATotal: ${formatPrice(total)}%0A%0AMerci de confirmer la disponibilité et de fournir les détails de livraison.`;

  const whatsappNumber = '22960506320';
  window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
}

// Envoyer un message de contact
function sendMessage(event) {
  event.preventDefault();
  
  const form = event.target;
  const name = form.querySelector('input[type="text"]').value;
  const email = form.querySelector('input[type="email"]').value;
  const message = form.querySelector('textarea').value;

  const whatsappMessage = `Nouveau message depuis mtechbenin.com%0A%0ANom: ${name}%0AEmail: ${email}%0A%0AMessage:%0A${message}`;
  
  const whatsappNumber = '22960506320';
  window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
  
  form.reset();
  alert('Votre message a été envoyé à MTECH BENIN via WhatsApp!');
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  renderProducts();
  updateCartBadge();
  renderCart();
});
