// ===== Firebase Configuration =====

// Configuration Firebase (à remplir avec vos propres identifiants)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialisation Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ===== Auth Admin =====
async function adminLogin(email, password) {
    try {
        await auth.signInWithEmailAndPassword(email, password);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

async function adminLogout() {
    await auth.signOut();
}

async function isAdminLoggedIn() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(!!user);
        });
    });
}

// ===== Firestore Produits =====
async function loadProductsFromFirebase() {
    try {
        const snapshot = await db.collection('products').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Erreur chargement produits:', error);
        return null;
    }
}

async function addProductToFirebase(productData) {
    const docRef = await db.collection('products').add(productData);
    return docRef.id;
}

async function updateProductInFirebase(productId, productData) {
    await db.collection('products').doc(productId).update(productData);
}

async function deleteProductFromFirebase(productId) {
    await db.collection('products').doc(productId).delete();
}

// ===== Storage Upload =====
async function uploadProductImage(file) {
    const ref = storage.ref('products/' + Date.now() + '_' + file.name);
    await ref.put(file);
    return await ref.getDownloadURL();
}
