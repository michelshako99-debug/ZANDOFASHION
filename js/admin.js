// ===== Variables globales =====
let adminProducts = [];

/* Palette élargie de couleurs utilisables dans le sélecteur visuel */
const ADMIN_COLORS = [
    { name: 'Noir', value: '#000000' },
    { name: 'Blanc', value: '#FFFFFF' },
    { name: 'Gris clair', value: '#E5E7EB' },
    { name: 'Gris', value: '#9CA3AF' },
    { name: 'Anthracite', value: '#374151' },
    { name: 'Rouge', value: '#EF4444' },
    { name: 'Bordeaux', value: '#991B1B' },
    { name: 'Corail', value: '#FF6B6B' },
    { name: 'Rose', value: '#EC4899' },
    { name: 'Rose pâle', value: '#FBCDD6' },
    { name: 'Violet', value: '#8B5CF6' },
    { name: 'Mauve', value: '#A855F7' },
    { name: 'Bleu nuit', value: '#1E3A8A' },
    { name: 'Bleu foncé', value: '#00008B' },
    { name: 'Bleu', value: '#2563EB' },
    { name: 'Bleu clair', value: '#3B82F6' },
    { name: 'Turquoise', value: '#14B8A8' },
    { name: 'Vert', value: '#10B981' },
    { name: 'Vert olive', value: '#65A30D' },
    { name: 'Vert foncé', value: '#166534' },
    { name: 'Jaune', value: '#FACC15' },
    { name: 'Ambré', value: '#F59E0B' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Marron', value: '#8B4513' },
    { name: 'Chocolat', value: '#45230B' },
    { name: 'Beige', value: '#D2B48C' },
    { name: 'Crème', value: '#FEF3C7' },
    { name: 'Or', value: '#D4AF37' },
    { name: 'Argent', value: '#CBD5E1' },
    { name: 'Bronze', value: '#CD7F32' }
];

function renderColorPalette(selectedValues) {
    const palette = document.getElementById('color-palette');
    if (!palette) return;

    palette.innerHTML = '';

    ADMIN_COLORS.forEach(c => {
        const selected = selectedValues.includes(c.value);
        const swatch = document.createElement('button');
        swatch.type = 'button';
        swatch.className = 'color-swatch' + (selected ? ' selected' : '');
        if (c.value === '#FFFFFF') swatch.classList.add('white-swatch');
        swatch.dataset.colorValue = c.value;
        swatch.dataset.colorName = c.name;
        swatch.style.background = c.value;
        swatch.title = c.name;
        swatch.addEventListener('click', (e) => {
            e.preventDefault();
            swatch.classList.toggle('selected');
            updateSelectedColorsCount();
        });
        palette.appendChild(swatch);
    });

    updateSelectedColorsCount();
}

function updateSelectedColorsCount() {
    const count = document.querySelectorAll('#color-palette .color-swatch.selected').length;
    const countEl = document.getElementById('selected-colors-count');
    if (countEl) countEl.textContent = count;
}

function getSelectedColors() {
    return Array.from(document.querySelectorAll('#color-palette .color-swatch.selected'))
        .map(s => ({ name: s.dataset.colorName, value: s.dataset.colorValue }));
}

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

// ===== Gestion de la connexion =====
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const result = await adminLogin(email, password);
    if (result.success) {
        document.getElementById('login-error').style.display = 'none';
        showDashboard();
    } else {
        const errorEl = document.getElementById('login-error');
        errorEl.textContent = result.message || 'Email ou mot de passe incorrect';
        errorEl.style.display = 'block';
    }
}

async function handleLogout() {
    await adminLogout();
    showLogin();
}

// ===== Affichage des vues =====
function showLogin() {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('admin-header-actions').style.display = 'none';
}

function showDashboard() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    document.getElementById('admin-header-actions').style.display = 'flex';

    const user = auth.currentUser;
    if (user) {
        document.getElementById('admin-email').textContent = user.email;
    }

    loadAdminProducts();
}

// ===== Gestion des produits =====
async function loadAdminProducts() {
    const products = await loadProductsFromFirebase();
    if (products) {
        adminProducts = products;
        renderProductsTable();
        updateStats();
    } else {
        // Fallback sur les données locales si Firebase n'est pas configuré
        adminProducts = getLocalProducts();
        renderProductsTable();
        updateStats();
    }
}

// Produits locaux de secours (identiques au site public)
function getLocalProducts() {
    return products;
}

// ===== Affichage du tableau =====
function renderProductsTable() {
    const tbody = document.getElementById('products-table-body');

    if (adminProducts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        <i class="fas fa-box-open"></i>
                        <p>Aucun produit. Cliquez sur "Ajouter un Produit" pour commencer.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = adminProducts.map(product => {
        const image = product.img || product.image || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80';
        const name = product.name || 'Produit sans nom';
        const category = product.category || 'accessoire';
        const price = product.price || 0;
        const oldPrice = product.oldPrice ? formatAdminPrice(product.oldPrice) : '-';
        const badge = product.badge ? `<span class="product-category-cell" style="background:rgba(239,68,68,0.1); color:var(--danger);">${escapeHtml(product.badge)}</span>` : '-';
        const id = product.id;

        return `
            <tr>
                <td><img src="${escapeHtml(image)}" alt="${escapeHtml(name)}" class="product-thumb"></td>
                <td class="product-name-cell">${escapeHtml(name)}</td>
                <td><span class="product-category-cell">${escapeHtml(category)}</span></td>
                <td class="product-price-cell">${formatAdminPrice(price)}</td>
                <td class="old-price-cell">${oldPrice}</td>
                <td>${badge}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" data-id="${id}" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" data-id="${id}" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    const tableWrapper = document.querySelector('.admin-table-wrapper');
    if (tableWrapper) {
        tableWrapper.querySelectorAll('.btn-edit, .btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const actionBtn = e.currentTarget;
                const productId = actionBtn.dataset.id;
                if (actionBtn.classList.contains('btn-edit')) {
                    openEditModal(productId);
                } else if (actionBtn.classList.contains('btn-delete')) {
                    handleDelete(productId);
                }
            });
        });
    }
}

function formatAdminPrice(price) {
    return parseFloat(price).toFixed(2).replace('.', ',') + ' FC';
}

// ===== Statistiques =====
function updateStats() {
    document.getElementById('stat-products').textContent = adminProducts.length;

    const promoCount = adminProducts.filter(p => p.badge).length;
    document.getElementById('stat-promo').textContent = promoCount;

    const categories = new Set(adminProducts.map(p => p.category));
    document.getElementById('stat-categories').textContent = categories.size;

    const totalValue = adminProducts.reduce((sum, p) => sum + parseFloat(p.price), 0);
    document.getElementById('stat-stock').textContent = totalValue.toFixed(0).replace('.', ',') + 'FC';
}

// ===== Modal Ajouter/Modifier =====
function openAddModal() {
    document.getElementById('modal-title').textContent = 'Ajouter un Produit';
    document.getElementById('product-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-category').value = '';
    document.getElementById('product-badge').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-old-price').value = '';
    document.getElementById('product-image').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-sizes').value = '';
    renderColorPalette([]);
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('product-modal').classList.add('active');
}

function openEditModal(productId) {
    const product = adminProducts.find(p => String(p.id) === String(productId));
    if (!product) return;

    document.getElementById('modal-title').textContent = 'Modifier le Produit';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-badge').value = product.badge || '';
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-old-price').value = product.oldPrice || '';
    document.getElementById('product-image').value = product.image || product.img || '';
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-sizes').value = Array.isArray(product.sizes) ? product.sizes.join(', ') : '';

    const selectedColorValues = Array.isArray(product.colors)
        ? product.colors.map(c => typeof c === 'string' ? c : (c && c.value) ? c.value : null).filter(Boolean)
        : [];
    renderColorPalette(selectedColorValues);

    const preview = document.getElementById('image-preview');
    preview.src = product.image || product.img || '';
    preview.style.display = 'block';

    document.getElementById('product-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
}

// ===== Soumission du formulaire produit =====
async function handleProductSubmit(event) {
    event.preventDefault();

    const productId = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        subcategory: document.getElementById('product-subcategory').value || '',
        price: parseFloat(document.getElementById('product-price').value),
        oldPrice: document.getElementById('product-old-price').value ? parseFloat(document.getElementById('product-old-price').value) : null,
        img: document.getElementById('product-image').value,
        badge: document.getElementById('product-badge').value || '',
        description: document.getElementById('product-description').value,
        sizes: document.getElementById('product-sizes').value
            ? document.getElementById('product-sizes').value.split(',').map(s => s.trim()).filter(Boolean)
            : [],
        colors: getSelectedColors() || []
    };

    try {
        if (productId) {
            // Modification
            await updateProductInFirebase(productId, productData);
            showAdminToast('Produit modifié avec succès !');
        } else {
            // Ajout
            await addProductToFirebase(productData);
            showAdminToast('Produit ajouté avec succès !');
        }
        closeModal();
        loadAdminProducts();
    } catch (error) {
        // Fallback local si Firebase n'est pas configuré
        if (productId) {
            const index = adminProducts.findIndex(p => String(p.id) === String(productId));
            if (index !== -1) {
                adminProducts[index] = { ...adminProducts[index], ...productData };
            }
        } else {
            productData.id = Date.now().toString();
            adminProducts.push(productData);
        }
        renderProductsTable();
        updateStats();
        closeModal();
        showAdminToast('Produit enregistré (mode local)');
    }

    saveProductsToLocal();
}

function saveProductsToLocal() {
    localStorage.setItem('zandoProducts', JSON.stringify(adminProducts));
}

// ===== Suppression =====
async function handleDelete(productId) {
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return;

    try {
        await deleteProductFromFirebase(productId);
        showAdminToast('Produit supprimé !');
    } catch (error) {
        // Fallback local
        adminProducts = adminProducts.filter(p => String(p.id) !== String(productId));
        showAdminToast('Produit supprimé (mode local)');
    }
    loadAdminProducts();
    saveProductsToLocal();
}

// ===== Aperçu image =====
document.getElementById('product-image').addEventListener('input', function() {
    const preview = document.getElementById('image-preview');
    if (this.value) {
        preview.src = this.value;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
});

// ===== Upload d'image depuis l'appareil =====
document.getElementById('product-image-file').addEventListener('change', async function(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier que c'est bien une image
    if (!file.type.startsWith('image/')) {
        showAdminToast('Veuillez sélectionner un fichier image');
        return;
    }

    // Afficher la progression
    const progressDiv = document.getElementById('upload-progress');
    const progressFill = document.getElementById('progress-fill');
    const statusEl = document.getElementById('upload-status');
    progressDiv.style.display = 'block';
    progressFill.style.width = '10%';
    statusEl.textContent = 'Upload en cours...';

    try {
        // Uploader l'image vers Cloudinary
        const downloadURL = await uploadProductImage(file);
        
        // Mettre à jour le champ URL et l'aperçu
        const imageInput = document.getElementById('product-image');
        imageInput.value = downloadURL;
        imageInput.removeAttribute('required');
        
        const preview = document.getElementById('image-preview');
        preview.src = downloadURL;
        preview.style.display = 'block';

        // Afficher la progression complète
        progressFill.style.width = '100%';
        statusEl.textContent = 'Photo téléchargée avec succès !';
        
        setTimeout(() => {
            progressDiv.style.display = 'none';
        }, 2000);

        showAdminToast('Photo ajoutée avec succès !');
    } catch (error) {
        console.error('Erreur upload (code):', error.code);
        console.error('Erreur upload (message):', error.message);
        console.error('Erreur upload (objet complet):', error);
        progressFill.style.width = '0%';

        let userMessage = 'Erreur lors de l\'upload. Vérifiez votre connexion internet et votre configuration Cloudinary.';
        if (error.message) {
            userMessage = error.message;
        }

        statusEl.textContent = userMessage;
        showAdminToast(userMessage);
    }
});

// ===== Toast admin =====
function showAdminToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== Initialisation =====
document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier si l'utilisateur est déjà connecté
    const loggedIn = await isAdminLoggedIn();
    if (loggedIn) {
        showDashboard();
    } else {
        showLogin();
    }
});
