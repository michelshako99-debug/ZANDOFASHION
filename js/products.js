const products = [
    ];

/* =========================================================
   OPTIONS DE TAILLE / COULEUR PAR DÉFAUT
   ========================================================= */

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const COLOR_MAP = {
    'noir': '#000000', 'noire': '#000000',
    'blanc': '#FFFFFF', 'blanche': '#FFFFFF',
    'rouge': '#EF4444',
    'bleu': '#2563EB',
    'vert': '#10B981',
    'jaune': '#FACC15',
    'orange': '#F59E0B',
    'rose': '#EC4899',
    'gris': '#9CA3AF', 'grise': '#9CA3AF',
    'beige': '#D2B48C',
    'marron': '#8B4513',
    'violet': '#8B5CF6',
    'bleu foncé': '#00008B',
};

const DEFAULT_COLORS = [
    { name: 'Noir', value: '#000000' },
    { name: 'Blanc', value: '#FFFFFF' },
    { name: 'Rouge', value: '#EF4444' },
    { name: 'Bleu', value: '#2563EB' },
    { name: 'Beige', value: '#D2B48C' },
    { name: 'Gris', value: '#9CA3AF' },
    { name: 'bleu foncé', value: '#00008B' },
];

/* Normalise les tailles / couleurs : un produit sans définition
   reçoit les valeurs par défaut. Les couleurs en chaîne simple
   (Firestore / localStorage) sont converties en {name, value}. */
function normalizeOptions(product) {
    if (!product) return product;
    if (!Array.isArray(product.sizes) || product.sizes.length === 0) {
        product.sizes = DEFAULT_SIZES.slice();
    }
    if (!Array.isArray(product.colors) || product.colors.length === 0) {
        product.colors = DEFAULT_COLORS.map(c => ({ name: c.name, value: c.value }));
    } else {
        product.colors = product.colors.map(c => {
            if (typeof c === 'string') {
                return { name: c, value: COLOR_MAP[c.toLowerCase()] || c };
            }
            if (c && typeof c === 'object') {
                const name = c.name || c.label || c.value || '';
                return {
                    name: name,
                    value: c.value || COLOR_MAP[String(name).toLowerCase()] || '#888888'
                };
            }
            return { name: String(c), value: '#888888' };
        });
    }
    return product;
}

/* Applique les tailles / couleurs par défaut aux produits statiques */
products.forEach(normalizeOptions);

window.DEFAULT_SIZES = DEFAULT_SIZES;
window.DEFAULT_COLORS = DEFAULT_COLORS;
window.COLOR_MAP = COLOR_MAP;
window.normalizeOptions = normalizeOptions;
