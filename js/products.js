// ===== CART STATE =====
let cart = JSON.parse(localStorage.getItem('zandoCart')) || [];

// ===== FORMAT PRICE =====
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FC";
}

// ===== FIRESTORE SYNC =====
async function loadProductsFromFirestore() {
    try {
        const snapshot = await db.collection('products').get();
        const firestoreProducts = [];
        snapshot.forEach(doc => {
            firestoreProducts.push({ id: doc.id, ...doc.data() });
        });
        return firestoreProducts;
    } catch (error) {
        console.error('Erreur chargement Firestore:', error);
        return null;
    }
}

async function initProducts() {
    const existingIds = new Set(products.map(p => p.id));

    const localProducts = JSON.parse(localStorage.getItem('zandoProducts')) || [];
    localProducts.forEach(p => {
        if (!existingIds.has(p.id)) {
            products.push(p);
            existingIds.add(p.id);
        }
    });

    try {
        const firestoreProducts = await loadProductsFromFirestore();
        if (firestoreProducts && firestoreProducts.length > 0) {
            firestoreProducts.forEach(p => {
                if (!existingIds.has(p.id)) {
                    products.push(p);
                    existingIds.add(p.id);
                }
            });
        }
    } catch (error) {
        console.error('Erreur Firestore, utilisation du catalogue local + localStorage:', error);
    }

    document.dispatchEvent(new CustomEvent('products-loaded'));
}

// ===== RENDER HELPERS =====
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}

function createProductCard(product) {
    normalizeOptions(product);
    const card = document.createElement('div');
    card.className = 'product-card';
    card.classList.add('product-card-animate');
    card.dataset.category = product.category || '';

    if (product.badge) {
        const badge = document.createElement('div');
        badge.className = `product-badge ${product.badge}`;
        badge.textContent = product.badge === 'sale' ? 'PROMO' : 'NOUVEAU';
        card.appendChild(badge);
    }

    const imageContainer = document.createElement('div');
    imageContainer.className = 'product-image';

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = product.name || '';
    img.onerror = () => {
        imageContainer.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f1f5f9;color:#94a3b8;font-size:0.8rem;padding:0.5rem;text-align:center;word-break:break-all;">Image: ${product.img || 'aucune'}</div>`;
    };
    img.src = product.img || '';
    imageContainer.appendChild(img);

    card.appendChild(imageContainer);

    const info = document.createElement('div');
    info.className = 'product-info';

    const title = document.createElement('h3');
    title.textContent = product.name || 'Produit sans nom';
    info.appendChild(title);

    const categoryEl = document.createElement('div');
    categoryEl.className = 'product-category';
    categoryEl.textContent = product.subcategory || '';
    info.appendChild(categoryEl);

    const priceEl = document.createElement('div');
    priceEl.className = 'product-price';

    const currentPrice = document.createElement('span');
    currentPrice.className = 'current-price';
    currentPrice.textContent = formatPrice(product.price);
    priceEl.appendChild(currentPrice);

    if (product.oldPrice) {
        const oldPrice = document.createElement('span');
        oldPrice.className = 'old-price';
        oldPrice.textContent = formatPrice(product.oldPrice);
        priceEl.appendChild(oldPrice);
    }
    info.appendChild(priceEl);

    if (Array.isArray(product.colors) && product.colors.length) {
        const colorWrap = document.createElement('div');
        colorWrap.className = 'variant-selector color-selector';

        const colorLabel = document.createElement('span');
        colorLabel.className = 'variant-label';
        colorLabel.textContent = 'Couleur :';
        colorWrap.appendChild(colorLabel);

        product.colors.forEach((c, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'color-dot';
            dot.dataset.color = c.value;
            dot.setAttribute('title', c.name);
            dot.style.background = c.value;
            dot.style.borderColor = c.value === '#FFFFFF' ? 'rgba(0,0,0,.2)' : 'transparent';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                colorWrap.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
            });
            colorWrap.appendChild(dot);
        });
        info.appendChild(colorWrap);
    }

    if (Array.isArray(product.sizes) && product.sizes.length) {
        const sizeWrap = document.createElement('div');
        sizeWrap.className = 'variant-selector size-selector';

        const sizeLabel = document.createElement('span');
        sizeLabel.className = 'variant-label';
        sizeLabel.textContent = 'Taille :';
        sizeWrap.appendChild(sizeLabel);

        product.sizes.forEach((s, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'size-btn';
            btn.dataset.size = s;
            btn.textContent = s;
            if (i === 0) btn.classList.add('active');
            btn.addEventListener('click', () => {
                sizeWrap.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
            sizeWrap.appendChild(btn);
        });
        info.appendChild(sizeWrap);
    }

    const actions = document.createElement('div');
    actions.className = 'product-actions';

    const btn = document.createElement('button');
    btn.className = 'btn-add-cart';
    btn.dataset.productId = product.id;
    btn.textContent = 'Ajouter au panier';
    actions.appendChild(btn);

    info.appendChild(actions);
    card.appendChild(info);

    return card;
}

// ===== RENDER PRODUCTS =====
function renderProducts(category = 'all', containerId = 'productGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    let filtered = category === 'all'
        ? products
        : products.filter(p => p.category === category);

    container.innerHTML = '';
    filtered.forEach((product, index) => {
        const card = createProductCard(product);
        card.style.animationDelay = (index * 0.05) + 's';
        container.appendChild(card);
    });

    attachCartListeners(container);
}

function attachCartListeners(container) {
    container.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.productId;
            if (!productId) return;
            const card = e.currentTarget.closest('.product-card');
            const sizeBtn = card ? card.querySelector('.size-btn.active') : null;
            const colorDot = card ? card.querySelector('.color-dot.active') : null;
            const selectedSize = sizeBtn ? sizeBtn.dataset.size : null;
            const selectedColor = colorDot ? colorDot.dataset.color : null;
            addToCart(productId, selectedSize, selectedColor);
        });
    });
}

// ===== ADD TO CART =====
function addToCart(productId, size, color) {

    const product = products.find(
        p => String(p.id) === String(productId)
    );

    if (!product) {
        console.error('Produit introuvable :', productId);
        return;
    }

    let colorLabel = color;
    if (color) {
        const match = product.colors
            ? product.colors.find(c => c.value === color)
            : null;
        if (match) colorLabel = match.name;
    }

    const existingItem = cart.find(
        item => String(item.id) === String(productId)
            && item.size === size
            && item.color === colorLabel
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1,
            size: size || null,
            color: colorLabel || null
        });
    }

    saveCart();
    updateCartUI();

    let added = `<strong>${product.name}</strong> ajouté au panier`;
    if (size) added += ` (Taille: ${size})`;
    if (colorLabel) added += ` (Couleur: ${colorLabel})`;

    showNotification(
        '✓',
        added
    );
    
    const cartBtn = document.querySelector('.cart-btn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => { cartBtn.style.transform = 'scale(1)'; }, 300);
}

function getItemId(item) {
    if (item.itemId) return item.itemId;
    return String(item.id) + '|' + (item.size || '') + '|' + (item.color || '');
}

// ===== REMOVE FROM CART =====
function removeFromCart(itemId) {
    cart = cart.filter(item => getItemId(item) !== String(itemId));
    saveCart();
    updateCartUI();
}

// ===== UPDATE QUANTITY =====
function updateQuantity(itemId, delta) {
    const item = cart.find(item => String(getItemId(item)) === String(itemId));
    if (!item) return;
    
    item.quantity += delta;
    
    if (item.quantity <= 0) {
        removeFromCart(getItemId(item));
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
    
    cartItemsContainer.innerHTML = cart.map(item => {
        const cartItemId = getItemId(item);
        let variant = '';
        if (item.size || item.color) {
            const parts = [];
            if (item.size) parts.push('Taille : ' + item.size);
            if (item.color) parts.push('Couleur : ' + item.color);
            variant = `<div class="cart-item-variant">${parts.join(' · ')}</div>`;
        }

        return `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:6px;" onerror="this.parentElement.innerHTML='📷'">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                ${variant}
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQuantity('${escapeHtml(cartItemId)}', -1)">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${escapeHtml(cartItemId)}', 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart('${escapeHtml(cartItemId)}')">Supprimer</button>
                </div>
            </div>
        </div>
    `;
    }).join('');
    
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
        if (item.size) message += `   Taille: ${item.size}\n`;
        if (item.color) message += `   Couleur: ${item.color}\n`;
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
// ===== INIT =====
document.addEventListener('DOMContentLoaded', function () {

    updateCartUI();

    if (window.firebaseReady) {
        initProducts();
    } else {
        document.addEventListener('firebase-ready', () => {
            initProducts();
        });
    }

    renderProducts('all', 'productGrid');

    // ===== Filtres de catégories =====
    document.querySelectorAll('.category-filter').forEach(cb => {
        cb.addEventListener('change', () => {

            if (cb.value === 'all' && cb.checked) {
                document.querySelectorAll('.category-filter').forEach(other => {
                    if (other.value !== 'all') {
                        other.checked = false;
                    }
                });
            }

            if (cb.value !== 'all' && cb.checked) {
                const allCheckbox = document.querySelector(
                    '.category-filter[value="all"]'
                );

                if (allCheckbox) {
                    allCheckbox.checked = false;
                }
            }

            // Utiliser directement renderProducts
            const checked = [...document.querySelectorAll('.category-filter:checked')]
                .map(cb => cb.value);

            if (checked.length === 0 || checked.includes('all')) {
                renderProducts('all', 'productGrid');
            } else {
                renderProducts(checked[0], 'productGrid');
            }
        });
    });

    // ===== Filtres de prix =====
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');

    if (priceMin && priceMax) {

        priceMin.addEventListener('input', () => {

            if (parseInt(priceMin.value) > parseInt(priceMax.value)) {
                priceMax.value = priceMin.value;
            }

            const minLabel = document.getElementById('price-min-label');

            if (minLabel) {
                minLabel.textContent = priceMin.value + ' FC';
            }
        });

        priceMax.addEventListener('input', () => {

            if (parseInt(priceMax.value) < parseInt(priceMin.value)) {
                priceMin.value = priceMax.value;
            }

            const maxLabel = document.getElementById('price-max-label');

            if (maxLabel) {
                maxLabel.textContent = priceMax.value + ' FC';
            }
        });
    }

    // ===== Tri =====
    const sortSelect = document.getElementById('sort-select');

    if (sortSelect) {
        sortSelect.addEventListener('change', () => {

            const container = document.getElementById('productGrid');

            if (!container) return;

            let sortedProducts = [...products];

            switch (sortSelect.value) {

                case 'price-low':
                    sortedProducts.sort((a, b) => a.price - b.price);
                    break;

                case 'price-high':
                    sortedProducts.sort((a, b) => b.price - a.price);
                    break;

                case 'newest':
                    sortedProducts.reverse();
                    break;
            }

            container.innerHTML = '';
            sortedProducts.forEach((product, index) => {
                const card = createProductCard(product);
                card.style.animationDelay = (index * 0.05) + 's';
                container.appendChild(card);
            });
            attachCartListeners(container);
        });
    }

});
