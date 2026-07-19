// ===== PRODUCTS DATABASE (ZANDO Market - Kinshasa) =====
const products = [
    // ============ FEMME (Women) - 30 produits ============
    { id: 1, name: "Robe Africaine Pagne", category: "Femme", subcategory: "Robes", price: 45000, oldPrice: 55000, img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop", badge: "sale" },
    { id: 2, name: "Robe Soirée Élégante", category: "Femme", subcategory: "Robes", price: 55000, oldPrice: 0, img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop", badge: "new" },
    { id: 3, name: "Robe Portefeuille", category: "Femme", subcategory: "Robes", price: 32000, oldPrice: 38000, img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop", badge: "sale" },
    { id: 4, name: "Jupe Longue élégante", category: "Femme", subcategory: "Jupes", price: 19000, oldPrice: 0, img: "jupes (1).jpg", badge: "new" },
    { id: 6, name: "Jupe tendance", category: "Femme", subcategory: "Jupes", price: 20000, oldPrice: 20000, img: "jupes (2).jpg", badge: "sale" },
    { id: 7, name: "T-Shirt oversize", category: "Femme", subcategory: "Hauts", price: 22000, oldPrice: 0, img: "hautfemme (1).jpg", badge: "" },
    { id: 8, name: "T-Shirt imprimé", category: "Femme", subcategory: "Hauts", price: 18000, oldPrice: 0, img: "hautfemme (2).jpg", badge: "new" },
    { id: 9, name: "T-Shirt crop top", category: "Femme", subcategory: "Hauts", price: 15000, oldPrice: 0, img: "hautfemme (3).jpg", badge: "" },
    { id: 10, name: "Ensemble Tailleur", category: "Femme", subcategory: "Ensembles", price: 65000, oldPrice: 80000, img: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=400&h=500&fit=crop", badge: "sale" },
    { id: 11, name: "Ensemble Jupe & Haut", category: "Femme", subcategory: "Ensembles", price: 35000, oldPrice: 0, img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop", badge: "" },
    { id: 12, name: "Pagne Bazin Riche", category: "Femme", subcategory: "Pagnes", price: 35000, oldPrice: 0, img: "pagne (1).jpg", badge: "" },
    { id: 13, name: "Pagne Tissu Hollandais", category: "Femme", subcategory: "Pagnes", price: 55000, oldPrice: 65000, img: "pagne (2).jpg", badge: "sale" },
    { id: 14, name: "Pagne Wax Coton", category: "Femme", subcategory: "Pagnes", price: 25000, oldPrice: 0, img: "pagne (3).jpg", badge: "" },
    { id: 15, name: "Sac à Main Cuir", category: "Femme", subcategory: "Accessoires", price: 28000, oldPrice: 35000, img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop", badge: "sale" },
    { id: 16, name: "Foulard Soie", category: "Femme", subcategory: "Accessoires", price: 12000, oldPrice: 0, img: "accfemme (2).jpg", badge: "" },
    { id: 17, name: "Collier Perles", category: "Femme", subcategory: "Accessoires", price: 8500, oldPrice: 12000, img: "acfemme (7).jpg", badge: "sale" },
    { id: 18, name: "Boucles d'Oreilles", category: "Femme", subcategory: "Accessoires", price: 15000, oldPrice: 0, img: "acfemme (6).jpg", badge: "new" },
    { id: 19, name: "Chaussures Talon", category: "Femme", subcategory: "Chaussures", price: 32000, oldPrice: 0, img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop", badge: "new" },
    { id: 20, name: "Sandales Plat", category: "Femme", subcategory: "Chaussures", price: 15000, oldPrice: 0, img: "acfemme (5).jpg", badge: "" },
    { id: 21, name: "Baskets Femme", category: "Femme", subcategory: "Chaussures", price: 25000, oldPrice: 30000, img: "acfemme (4).jpg", badge: "sale" },
    { id: 22, name: "Pantalon Taille Basse", category: "Femme", subcategory: "Pantalons", price: 20000, oldPrice: 0, img: "acfemme (2).jpg", badge: "" },
    { id: 23, name: "Jean Slim Femme", category: "Femme", subcategory: "Pantalons", price: 22000, oldPrice: 0, img: "acfemme (9).jpg", badge: "" },
    { id: 24, name: "Tunique Africaine", category: "Femme", subcategory: "Robes", price: 20000, oldPrice: 0, img: "acfemme (1).jpg", badge: "" },
    { id: 25, name: "Ceinture Femme", category: "Femme", subcategory: "Accessoires", price: 10000, oldPrice: 0, img: "acfemme (8).jpg", badge: "" },
    { id: 26, name: "Jupe crayon", category: "Femme", subcategory: "Jupes", price: 20000, oldPrice: 23000, img: "jupes (3).jpg", badge: "sale" },
    { id: 27, name: "Jupe Plissée", category: "Femme", subcategory: "Jupes", price: 20000, oldPrice: 25000, img: "jupes (4).jpg", badge: "sale" },
    { id: 28, name: "T-Shirt basique", category: "Femme", subcategory: "Hauts", price: 15000, oldPrice: 0, img: "hautfemme (4).jpg", badge: "" },
    // ============ HOMME (Men) - 30 produits ============
    { id: 29, name: "Costume Complet", category: "Homme", subcategory: "Costumes", price: 100000, oldPrice: 150000, img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop", badge: "sale" },
    { id: 30, name: "Costume Cravate", category: "Homme", subcategory: "Costumes", price: 95000, oldPrice: 0, img: "costume (1).jpg", badge: "new" },
    { id: 31, name: "Smoking noir", category: "Homme", subcategory: "Costumes", price: 180000, oldPrice: 0, img: "costume (2).jpg", badge: "" },
    { id: 32, name: "Costume Prince de Galles", category: "Homme", subcategory: "Costumes", price: 110000, oldPrice: 0, img: "costume (3).jpg", badge: "" },
    { id: 33, name: "Chemise Manches Longues", category: "Homme", subcategory: "Chemises", price: 20000, oldPrice: 0, img: "chemise (1).jpg", badge: "" },
    { id: 34, name: "Chemise Blanche", category: "Homme", subcategory: "Chemises", price: 18000, oldPrice: 0, img: "chemise (2).jpg", badge: "" },
    { id: 35, name: "Chemise manches courtes", category: "Homme", subcategory: "Chemises", price: 15000, oldPrice: 0, img: "chemise (3).jpg", badge: "new" },
    { id: 36, name: "Chemise Oversize", category: "Homme", subcategory: "Chemises", price: 25000, oldPrice: 0, img: "chemise (4).jpg", badge: "new" },
    { id: 37, name: "T-Shirt Balenciaga", category: "Homme", subcategory: "T-Shirts", price: 12000, oldPrice: 0, img: "T-shirthomme (1).jpg", badge: "" },
    { id: 38, name: "T-Shirt luiviton", category: "Homme", subcategory: "T-Shirts", price: 15000, oldPrice: 0, img: "T-shirthomme (2).jpg", badge: "" },
    { id: 39, name: "T-Shirt GUCCI", category: "Homme", subcategory: "T-Shirts", price: 10000, oldPrice: 0, img: "T-shirthomme (3).jpg", badge: "" },
    { id: 40, name: "T-Shirt OFF", category: "Homme", subcategory: "T-Shirts", price: 10000, oldPrice: 0, img: "T-shirthomme (4).jpg", badge: "" },
    { id: 41, name: "AMIRI-Black jeans", category: "Homme", subcategory: "Pantalons", price: 45000, oldPrice: 0, img: "pantalonhomme (1).jpg", badge: "new" },
    { id: 42, name: "Chrome Hearts jeans", category: "Homme", subcategory: "Pantalons", price: 36500, oldPrice: 50000, img: "pantalonhomme (2).jpg", badge: "sale" },
    { id: 43, name: "AMIRI Black Baggy Fit jeans", category: "Homme", subcategory: "Pantalons", price: 40000, oldPrice: 0, img: "pantalonhomme (3).jpg", badge: "" },   
    { id: 44, name: "AMIRI-MX1", category: "Homme", subcategory: "Pantalons", price: 30000, oldPrice: 0, img: "pantalonhomme (4).jpg", badge: "" },
    { id: 45, name: "NIKE", category: "Homme", subcategory: "Chaussures", price: 55000, oldPrice: 0, img: "chaussureshomme (1).jpg", badge: "" },
    { id: 46, name: "NEW BALANCE", category: "Homme", subcategory: "Chaussures", price: 50000, oldPrice: 65000, img: "chaussureshomme (2).jpg", badge: "sale" },
    { id: 47, name: "NIKE", category: "Homme", subcategory: "Chaussures", price: 58000, oldPrice: 0, img: "chaussureshomme (3).jpg", badge: "" },   
    { id: 48, name: "NIKE Air Force", category: "Homme", subcategory: "Chaussures", price: 58500, oldPrice: 0, img: "chaussureshomme (4).jpg", badge: "" },
    { id: 49, name: "Cravate Soie", category: "Homme", subcategory: "Accessoires", price: 10000, oldPrice: 0, img: "https://images.unsplash.com/photo-1589756823695-278bc923f962?w=400&h=500&fit=crop", badge: "new" },
    { id: 50, name: "Ceinture Cuir", category: "Homme", subcategory: "Accessoires", price: 15000, oldPrice: 0, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop", badge: "" },
    { id: 51, name: "Montre Homme", category: "Homme", subcategory: "Accessoires", price: 10000, oldPrice: 0, img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=500&fit=crop", badge: "" },
    { id: 52, name: "Lunettes Soleil", category: "Homme", subcategory: "Accessoires", price: 12000, oldPrice: 0, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop", badge: "new" },
    // ============ ENFANT (Kids) - 30 produits ============
    { id: 53, name: "Robe Fillette", category: "Enfant", subcategory: "Filles", price: 52000, oldPrice: 0, img: "filles (1).jpg", badge: "new" },
    { id: 54, name: "assembles", category: "Enfant", subcategory: "Filles", price: 45000, oldPrice: 0, img: "filles (2).jpg", badge: "" },
    { id: 55, name: "assembles", category: "Enfant", subcategory: "Filles", price: 49000, oldPrice: 0, img: "filles (3).jpg", badge: "" },
    { id: 56, name: "robes princesses", category: "Enfant", subcategory: "Filles", price: 29000, oldPrice: 0, img: "filles (4).jpg", badge: "new" },
    { id: 57, name: "assemble", category: "Enfant", subcategory: "Garçons", price: 28000, oldPrice: 0, img: "garcons (1).jpg", badge: "" },
    { id: 58, name: "assemble sport", category: "Enfant", subcategory: "Garçons", price: 30000, oldPrice: 0, img: "garcons (2).jpg", badge: "" },
    { id: 59, name: "assemble", category: "Enfant", subcategory: "Garçons", price: 25000, oldPrice: 0, img: "garcons (3).jpg", badge: "" },
    { id: 60, name: "Veste enfant", category: "Enfant", subcategory: "Garçons", price: 35000, oldPrice: 0, img: "garcons (4).jpg", badge: "" },
    { id: 61, name: "Ensemble Bébé", category: "Enfant", subcategory: "Bébés", price: 15000, oldPrice: 0, img: "bébé (1).jpg", badge: "" },
    { id: 62, name: "Ensemble Bébé", category: "Enfant", subcategory: "Bébés", price: 18000, oldPrice: 0, img: "bébé (2).jpg", badge: "new" },
    { id: 63, name: "Ensemble Bébé", category: "Enfant", subcategory: "Bébés", price: 10000, oldPrice: 0, img: "bébé (3).jpg", badge: "" },
    { id: 64, name: "Ensemble Bébé", category: "Enfant", subcategory: "Bébés", price: 16000, oldPrice: 0, img: "bébé (4).jpg", badge: "" },
    { id: 65, name: "Chaussures Enfant", category: "Enfant", subcategory: "Chaussures", price: 10000, oldPrice: 0, img: "images/basketkids (1).jpg", badge: "" },
    { id: 66, name: "Chaussures Enfant", category: "Enfant", subcategory: "Chaussures", price: 7000, oldPrice: 0, img: "images/basketkids (2).jpg", badge: "" },
    { id: 67, name: "Baskets Enfant", category: "Enfant", subcategory: "Chaussures", price: 12000, oldPrice: 0, img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=500&fit=crop", badge: "" },
    { id: 68, name: "Lunettes Enfant", category: "Enfant", subcategory: "Accessoires", price: 6000, oldPrice: 0, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=500&fit=crop", badge: "" },
    { id: 69, name: "Montre Enfant", category: "Enfant", subcategory: "Accessoires", price: 8000, oldPrice: 0, img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=500&fit=crop", badge: "" },
    { id: 70, name: "Collier Enfant", category: "Enfant", subcategory: "Filles", price: 5000, oldPrice: 0, img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop", badge: "" },
    { id: 71, name: "Ensemble Bébé", category: "Enfant", subcategory: "Bébés", price: 12000, oldPrice: 0, img: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=500&fit=crop", badge: "new" }
];

// ===== CART STATE =====
let cart = JSON.parse(localStorage.getItem('zandoCart')) || [];

// ===== FORMAT PRICE =====
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FC";
}

// ===== RENDER PRODUCTS =====
function renderProducts(category = 'all', containerId = 'productGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let filtered = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    container.innerHTML = filtered.map(product => `
        <div class="product-card" data-category="${product.category}">
            ${product.badge ? `<div class="product-badge ${product.badge}">${product.badge === 'sale' ? 'PROMO' : 'NOUVEAU'}</div>` : ''}
            <div class="product-image">
                <img src="${product.img}" alt="${product.name}" loading="lazy" 
                     style="width:100%;height:100%;object-fit:cover;transition:transform 0.3s ease;"
                     onmouseover="this.style.transform='scale(1.08)'" 
                     onmouseout="this.style.transform='scale(1)'"
                     onerror="this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f1f5f9;color:#94a3b8;font-size:3rem;\\'>📷</div>'">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-category">${product.subcategory}</div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">Ajouter au panier</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== ADD TO CART =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    showNotification('✓', `<strong>${product.name}</strong> ajouté au panier`);
    
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => { cartBtn.style.transform = 'scale(1)'; }, 300);
}

// ===== REMOVE FROM CART =====
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// ===== UPDATE QUANTITY =====
function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += delta;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    saveCart();
    updateCartUI();
}

// ===== SAVE CART =====
function saveCart() {
    localStorage.setItem('zandoCart', JSON.stringify(cart));
}

// ===== UPDATE CART UI =====
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) cartCount.textContent = totalItems;
    
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <div class="empty-icon">🛒</div>
                <h4>Votre panier est vide</h4>
                <p>Ajoutez des articles depuis notre boutique</p>
            </div>
        `;
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) checkoutBtn.disabled = true;
        const cartTotal = document.getElementById('cartTotal');
        if (cartTotal) cartTotal.textContent = '0 FC';
        return;
    }
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" onerror="this.parentElement.innerHTML='📷'">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Supprimer</button>
                </div>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) cartTotal.textContent = formatPrice(total);
}

// ===== TOGGLE CART =====
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
    document.body.style.overflow = sidebar && sidebar.classList.contains('open') ? 'hidden' : '';
}

// ===== CHECKOUT VIA WHATSAPP =====
function checkoutWhatsApp() {
    if (cart.length === 0) {
        showNotification('⚠️', 'Votre panier est vide');
        return;
    }
    
    const phoneNumber = '243976520957';
    
    let message = '🛍️ *NOUVELLE COMMANDE ZANDO FASHION* 🛍️\n\n';
    message += '📋 *Détails de la commande :*\n';
    message += '━━━━━━━━━━━━━━━━━━\n\n';
    
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*\n`;
        message += `   Quantité: ${item.quantity}\n`;
        message += `   Prix: ${formatPrice(item.price * item.quantity)}\n\n`;
    });
    
    message += '━━━━━━━━━━━━━━━━━━\n';
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `💰 *TOTAL: ${formatPrice(total)}*\n\n`;
    message += '📍 *Retrait au Marché Central de Kinshasa (ZANDO)*\n';
    message += '🚚 *Livraison disponible partout à Kinshasa*\n\n';
    message += '✅ _Merci de votre confiance !_';
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(icon, text) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notif = document.createElement('div');
    notif.className = 'notification show';
    notif.innerHTML = `
        <span class="notif-icon">${icon}</span>
        <span class="notif-text">${text}</span>
    `;
    
    container.appendChild(notif);
    
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// ===== MOBILE MENU =====
function toggleMenu() {
    const nav = document.querySelector('nav');
    const toggle = document.querySelector('.menu-toggle');
    nav.classList.toggle('open');
    
    const spans = toggle.querySelectorAll('span');
    if (nav.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
}

// ===== FILTER BUTTONS =====
function filterProducts(category, button) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');
    renderProducts(category);
}

// ===== NEWSLETTER =====
function handleNewsletter(event) {
    event.preventDefault();
    const input = event.target.querySelector('input');
    if (input && input.value) {
        showNotification('✓', 'Inscription réussie à la newsletter !');
        input.value = '';
    }
    return false;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    renderProducts('all', 'productGrid');
    updateCartUI();
    
    const overlay = document.getElementById('cartOverlay');
    if (overlay) {
        overlay.addEventListener('click', toggleCart);
    }
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    console.log('%cZANDO FASHION - Kinshasa', 'font-size: 20px; font-weight: bold; color: #0a1929;');
    console.log('%c90 produits du Marché Central de Kinshasa', 'font-size: 14px; color: #d4a853;');
});
