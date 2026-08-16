// ===== Variables globales =====
let adminProducts = [];

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

// Produits locaux de secours (mêmes que script.js)
function getLocalProducts() {
    return [
        { id: '1', name: 'Ordinateur Portable Pro', category: 'informatique', price: 899.99, oldPrice: 1099.99, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80', badge: '-18%', description: 'Ordinateur portable haute performance.' },
        { id: '2', name: 'Smartphone Galaxy X', category: 'smartphone', price: 699.99, oldPrice: 799.99, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', badge: '-12%', description: 'Smartphone avec écran AMOLED.' },
        { id: '3', name: 'Casque Audio Sans Fil', category: 'audio', price: 149.99, oldPrice: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', badge: '-25%', description: 'Casque sans fil avec réduction de bruit.' },
        { id: '4', name: 'Montre Connectée Smart', category: 'accessoire', price: 249.99, oldPrice: 299.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80', badge: '-17%', description: 'Montre connectée avec suivi de santé.' },
        { id: '5', name: 'Tablette Ultra HD', category: 'informatique', price: 449.99, oldPrice: 549.99, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80', badge: '-18%', description: 'Tablette avec écran 11" Ultra HD.' },
        { id: '6', name: 'Enceinte Bluetooth Pro', category: 'audio', price: 89.99, oldPrice: 129.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80', badge: '-31%', description: 'Enceinte portable avec son 360°.' },
        { id: '7', name: 'Appareil Photo Numérique', category: 'accessoire', price: 549.99, oldPrice: 649.99, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80', badge: '-15%', description: 'Appareil photo avec capteur 24MP.' },
        { id: '8', name: 'Clavier Mécanique RGB', category: 'informatique', price: 129.99, oldPrice: 159.99, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80', badge: '-19%', description: 'Clavier mécanique avec rétroéclairage RGB.' },
        { id: '9', name: 'Écouteurs Sans Fil', category: 'audio', price: 79.99, oldPrice: 99.99, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80', badge: '-20%', description: 'Écouteurs sans fil avec réduction de bruit.' },
        { id: '10', name: 'Console de Jeux Next', category: 'accessoire', price: 499.99, oldPrice: 599.99, image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=600&q=80', badge: '-17%', description: 'Console de jeux nouvelle génération.' },
        { id: '11', name: 'Smartphone Éco Plus', category: 'smartphone', price: 399.99, oldPrice: 449.99, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80', badge: '-11%', description: 'Smartphone abordable avec grande autonomie.' },
        { id: '12', name: 'Disque Dur Externe 2To', category: 'informatique', price: 99.99, oldPrice: 129.99, image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=600&q=80', badge: '-23%', description: 'Disque dur externe 2To USB 3.0.' }
    ];
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
        const image = product.image || 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80';
        const name = product.name || 'Produit sans nom';
        const category = product.category || 'accessoire';
        const price = product.price || 0;
        const oldPrice = product.oldPrice ? formatAdminPrice(product.oldPrice) : '-';
        const badge = product.badge ? `<span class="product-category-cell" style="background:rgba(239,68,68,0.1); color:var(--danger);">${product.badge}</span>` : '-';
        const id = product.id;

        return `
            <tr>
                <td><img src="${image}" alt="${name}" class="product-thumb"></td>
                <td class="product-name-cell">${name}</td>
                <td><span class="product-category-cell">${category}</span></td>
                <td class="product-price-cell">${formatAdminPrice(price)}</td>
                <td class="old-price-cell">${oldPrice}</td>
                <td>${badge}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="openEditModal('${id}')" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="handleDelete('${id}')" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function formatAdminPrice(price) {
    return parseFloat(price).toFixed(2).replace('.', ',') + '€';
}

// ===== Statistiques =====
function updateStats() {
    document.getElementById('stat-products').textContent = adminProducts.length;

    const promoCount = adminProducts.filter(p => p.badge).length;
    document.getElementById('stat-promo').textContent = promoCount;

    const categories = new Set(adminProducts.map(p => p.category));
    document.getElementById('stat-categories').textContent = categories.size;

    const totalValue = adminProducts.reduce((sum, p) => sum + parseFloat(p.price), 0);
    document.getElementById('stat-stock').textContent = totalValue.toFixed(0).replace('.', ',') + '€';
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
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('product-modal').classList.add('active');
}

function openEditModal(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modal-title').textContent = 'Modifier le Produit';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-badge').value = product.badge || '';
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-old-price').value = product.oldPrice || '';
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-description').value = product.description || '';

    const preview = document.getElementById('image-preview');
    preview.src = product.image;
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
        price: parseFloat(document.getElementById('product-price').value),
        oldPrice: document.getElementById('product-old-price').value ? parseFloat(document.getElementById('product-old-price').value) : null,
        image: document.getElementById('product-image').value,
        badge: document.getElementById('product-badge').value || '',
        description: document.getElementById('product-description').value,
        rating: 4.5,
        reviews: 0
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
            const index = adminProducts.findIndex(p => p.id === productId);
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
}

// ===== Suppression =====
async function handleDelete(productId) {
    if (!confirm('Voulez-vous vraiment supprimer ce produit ?')) return;

    try {
        await deleteProductFromFirebase(productId);
        showAdminToast('Produit supprimé !');
    } catch (error) {
        // Fallback local
        adminProducts = adminProducts.filter(p => p.id !== productId);
        showAdminToast('Produit supprimé (mode local)');
    }
    loadAdminProducts();
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
        // Uploader l'image vers Firebase Storage
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

        let userMessage = 'Erreur lors de l\'upload. Vérifiez que Firebase Storage est activé.';
        switch (error.code) {
            case 'storage/unauthorized':
                userMessage = 'Accès refusé (storage/unauthorized). Vérifiez les règles de sécurité Firebase Storage (Storage → Rules) et que vous êtes bien connecté.';
                break;
            case 'storage/unauthenticated':
                userMessage = 'Vous n\'êtes pas authentifié (storage/unauthenticated). Reconnectez-vous.';
                break;
            case 'storage/quota-exceeded':
                userMessage = 'Quota Storage dépassé. Ce projet doit être sur le plan Blaze (pay-as-you-go).';
                break;
            case 'storage/no-default-bucket':
                userMessage = 'Aucun bucket configuré (storage/no-default-bucket). Vérifiez storageBucket dans firebase-config.js.';
                break;
            case 'storage/unknown':
                userMessage = 'Erreur inconnue (storage/unknown). Vérifiez que Firebase Storage est bien activé dans la console et inspectez la console développeur (F12) pour plus de détails.';
                break;
            case 'storage/canceled':
                userMessage = 'Upload annulé.';
                break;
            case 'storage/retry-limit-exceeded':
                userMessage = 'Délai dépassé (storage/retry-limit-exceeded). Vérifiez votre connexion internet et réessayez.';
                break;
            default:
                if (error.code) {
                    userMessage = `Erreur (${error.code}) : ${error.message}`;
                } else if (error.message) {
                    userMessage = `Erreur : ${error.message}`;
                }
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