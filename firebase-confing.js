// ===== Configuration Firebase =====
// Configuration de votre projet Firebase

const firebaseConfig = {
    apiKey: "AIzaSyC5L_8MGfEejkx6LcM9z_6XnkknJPt4Fnw",
    authDomain: "premier-b4342.firebaseapp.com",
    projectId: "premier-b4342",
    storageBucket: "premier-b4342.firebasestorage.app",
    messagingSenderId: "1055490878890",
    appId: "1:1055490878890:web:717b3dc4adf788a94f8fd3",
    measurementId: "G-G1Q4QDF367"
};

// Initialisation Firebase (SDK v8 compat)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// ===== Fonctions Firebase =====

// Charger tous les produits depuis Firestore
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

// Ajouter un produit
async function addProductToFirebase(product) {
    try {
        const docRef = await db.collection('products').add(product);
        return docRef.id;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du produit:', error);
        throw error;
    }
}

// Mettre à jour un produit
async function updateProductInFirebase(productId, data) {
    try {
        await db.collection('products').doc(productId).update(data);
        return true;
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
        throw error;
    }
}

// Supprimer un produit
async function deleteProductFromFirebase(productId) {
    try {
        await db.collection('products').doc(productId).delete();
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        throw error;
    }
}

// ===== Upload d'images =====

// Uploader une image vers Firebase Storage
async function uploadProductImage(file) {
    try {
        // Créer un nom de fichier unique
        const timestamp = Date.now();
        const fileName = `products/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = storage.ref(fileName);
        
        // Uploader le fichier
        const snapshot = await storageRef.put(file);
        
        // Récupérer l'URL de téléchargement
        const downloadURL = await snapshot.ref.getDownloadURL();
        return downloadURL;
    } catch (error) {
        console.error('Erreur lors de l\'upload de l\'image:', error);
        throw error;
    }
}

// ===== Authentification admin =====

// Connexion admin
async function adminLogin(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Erreur de connexion:', error);
        let message = 'Email ou mot de passe incorrect';

        // Messages d'erreur Firebase en français
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

// Déconnexion admin
async function adminLogout() {
    try {
        await auth.signOut();
        return true;
    } catch (error) {
        console.error('Erreur de déconnexion:', error);
        return false;
    }
}

// Vérifier si l'utilisateur est connecté
function isAdminLoggedIn() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged(user => {
            resolve(user ? true : false);
        });
    });
}