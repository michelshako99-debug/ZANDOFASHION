const CLOUDINARY_CONFIG = {
    cloudName: 'idzs3xup',
    uploadPreset: 'zando-fashion',
    uploadUrl: 'https://api.cloudinary.com/v1_1/idzs3xup/image/upload'
};

// ===== Configuration Firebase =====

const firebaseConfig = {
    apiKey: "AIzaSyC5L_8MGfEejkx6LcM9z_6XnkknJPt4Fnw",
    authDomain: "premier-b4342.firebaseapp.com",
    projectId: "premier-b4342",
    storageBucket: "premier-b4342.firebasestorage.app",
    messagingSenderId: "1055490878890",
    appId: "1:1055490878890:web:717b3dc4adf788a94f8fd3",
    measurementId: "G-G1Q4QDF367"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// ===== Fonctions Firebase =====

async function loadProductsFromFirebase() {
    try {
        const snapshot = await db.collection('products').get();
        const products = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });
        return products;
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        return null;
    }
}

async function addProductToFirebase(product) {
    try {
        const docRef = await db.collection('products').add(product);
        return docRef.id;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du produit:', error);
        throw error;
    }
}

async function updateProductInFirebase(productId, data) {
    try {
        await db.collection('products').doc(productId).update(data);
        return true;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
        throw error;
    }
}

async function deleteProductFromFirebase(productId) {
    try {
        await db.collection('products').doc(productId).delete();
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        throw error;
    }
}

// ===== Upload d'images via Cloudinary =====

async function uploadProductImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

    console.log('[Cloudinary] Upload vers:', CLOUDINARY_CONFIG.uploadUrl);
    console.log('[Cloudinary] Preset:', CLOUDINARY_CONFIG.uploadPreset);
    console.log('[Cloudinary] Fichier:', file.name, file.type, file.size);

    const response = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
        method: 'POST',
        body: formData
    });

    console.log('[Cloudinary] Statut HTTP:', response.status);

    const responseText = await response.text();
    console.log('[Cloudinary] Réponse brute:', responseText);

    if (!response.ok) {
        throw new Error(`Erreur upload Cloudinary ${response.status}: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    if (!data.secure_url) {
        throw new Error('Cloudinary n\'a pas retourné d\'URL. Vérifiez le preset.');
    }

    return data.secure_url;
}

// ===== Authentification admin =====

async function adminLogin(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Erreur de connexion:', error);
        let message = 'Email ou mot de passe incorrect';

        switch (error.code) {
            case 'auth/user-not-found':
                message = 'Aucun compte trouvé avec cet email. Vérifiez que l\'utilisateur existe dans Firebase Authentication.';
                break;
            case 'auth/wrong-password':
                message = 'Mot de passe incorrect. Vérifiez le mot de passe de l\'utilisateur dans Firebase Authentication.';
                break;
            case 'auth/invalid-email':
                message = 'Format d\'email invalide.';
                break;
            case 'auth/user-disabled':
                message = 'Ce compte a été désactivé.';
                break;
            case 'auth/too-many-requests':
                message = 'Trop de tentatives. Réessayez plus tard.';
                break;
            case 'auth/operation-not-allowed':
                message = 'L\'authentification par email/mot de passe n\'est pas activée. Activez-la dans Firebase Console → Authentication → Sign-in method.';
                break;
            case 'auth/network-request-failed':
                message = 'Erreur réseau. Vérifiez votre connexion internet.';
                break;
            default:
                message = 'Erreur de connexion : ' + error.message;
        }

        return { success: false, message };
    }
}

async function adminLogout() {
    try {
        await auth.signOut();
        return true;
    } catch (error) {
        console.error('Erreur de déconnexion:', error);
        return false;
    }
}

function isAdminLoggedIn() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged(user => {
            resolve(user ? true : false);
        });
    });
}

window.firebaseReady = true;
document.dispatchEvent(new CustomEvent('firebase-ready'));
