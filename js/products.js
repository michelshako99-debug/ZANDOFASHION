const products=[];

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

/* =========================================================
   RECHERCHE INTELLIGENTE
   Normalisation / synonymes / fautes de frappe
   ========================================================= */

const SYNONYMS = {
    'tshirt': ['t-shirt', 'tee shirt', 'tee-shirt', 'shirt', 'maillot'],
    'chemise': ['chemise', 'shirt', 'chemisette'],
    'pantalon': ['pantalon', 'pantalons', 'jean', 'jeans', 'chino', 'bas'],
    'robe': ['robe', 'robes', 'jupe', 'jupon'],
    'pagne': ['pagne', 'pagnes', 'wrapper', 'foulard', 'tissu'],
    'chaussure': ['chaussure', 'chaussures', 'shoes', 'sandar', 'sabot', 'espadrille'],
    'chaussures': ['chaussure', 'chaussures', 'shoes', 'sandar', 'sabot', 'espadrille'],
    'accessoire': ['accessoire', 'accessoires', 'accessory', 'accessories', 'bijou', 'sac', 'ceinture', 'lunettes', 'casquette', 'chapeau'],
    'costume': ['costume', 'costumes', 'suit', 'veste', 'blazer', 'pantalon costume'],
    'ensemble': ['ensemble', 'ensembles', 'combo', 'set', 'deux pieces', '2 pieces'],
    'veste': ['veste', 'vestes', 'blazer', 'jacket', 'manteau', 'sweat', 'hoodie', 'pull', 'gilet'],
    'enfant': ['enfant', 'enfants', 'kids', 'bebe', 'bebes', 'garcon', 'fille', 'junior'],
    'homme': ['homme', 'hommes', 'man', 'men', 'masculin', 'garcon'],
    'femme': ['femme', 'femmes', 'woman', 'women', 'feminin', 'fille', 'madame'],
    'promo': ['promo', 'promotion', 'promotions', 'reduction', 'remise', 'solde', 'soldes', 'offre'],
    'bas': ['bas', 'legging', 'collant', 'pantalon'],
    'sweat': ['sweat', 'sweat shirt', 'hoodie', 'pull', 'sweat-shirt'],
    'casquette': ['casquette', 'chapeau', 'cap', 'bonnet', 'beret'],
    'sac': ['sac', 'sacoche', 'besace', 'handbag', 'pochette', 'portefeuille'],
    'montre': ['montre', 'bracelet', 'bijou', 'accessoire'],
    'parfum': ['parfum', 'fragrance', 'eau de toilette', 'edt', 'senteur'],
    'beret': ['beret', 'chapeau', 'casquette', 'bonnet'],
    'bonnet': ['bonnet', 'chapeau', 'casquette', 'beret'],
    'jupe': ['jupe', 'jupon', 'robe', 'tutu'],
    'sport': ['sport', 'sportif', 'training', 'running', 'gym', 'sportive'],
    'soir': ['soir', 'soiree', 'ceremonie', 'evening', 'habit'],
    'traditionnel': ['traditionnel', 'tradition', 'africain', 'africaine', 'coutume', 'ceremonial', 'mariage'],
    'enfantin': ['enfantin', 'bebe', 'bebes', 'kids'],
    'taille': ['taille', 'size', 'taille s', 'taille m', 'taille l', 'taille xl'],
};

function normalizeText(str) {
    if (!str) return '';
    return String(str)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function levenshtein(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;

    let prev = new Array(b.length + 1);
    let curr = new Array(b.length + 1);

    for (let j = 0; j <= b.length; j++) prev[j] = j;

    for (let i = 1; i <= a.length; i++) {
        curr[0] = i;
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
        }
        const tmp = prev;
        prev = curr;
        curr = tmp;
    }
    return prev[b.length];
}

function isFuzzyMatch(word, term) {
    if (word.length < 4 || term.length < 4) return false;
    const distance = levenshtein(word, term);
    return distance <= (term.length <= 5 ? 1 : 2);
}

function getProductKeywords(product) {
    if (!product) return [];
    const raw = product.keywords || product.tags || product.aliases || [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    if (typeof raw === 'string') {
        return raw.split(',').map(k => k.trim()).filter(Boolean);
    }
    return [];
}

function buildNormalizedSynonyms() {
    const map = {};
    Object.keys(SYNONYMS).forEach(key => {
        const normKey = normalizeText(key);
        if (!normKey) return;
        if (!map[normKey]) map[normKey] = [];
        SYNONYMS[key].forEach(v => {
            const normVal = normalizeText(v);
            if (normVal && map[normKey].indexOf(normVal) === -1) {
                map[normKey].push(normVal);
            }
        });
    });
    return map;
}

const SYNONYMS_NORM = buildNormalizedSynonyms();

function expandTerm(term) {
    const variants = new Set([term]);
    SYNONYMS_NORM[term] && SYNONYMS_NORM[term].forEach(v => variants.add(v));
    Object.keys(SYNONYMS_NORM).forEach(key => {
        if (SYNONYMS_NORM[key].indexOf(term) !== -1) variants.add(key);
    });
    return Array.from(variants).filter(v => v.length >= 2);
}

function getSearchTerms(term) {
    const base = normalizeText(term);
    if (!base) return [];

    const terms = new Set();
    terms.add(base);
    base.split(' ').forEach(w => { if (w.length >= 2) terms.add(w); });
    expandTerm(base).forEach(v => {
        if (v) terms.add(v);
        v.split(' ').forEach(w => { if (w.length >= 2) terms.add(w); });
    });

    return Array.from(terms).filter(t => t.length >= 2);
}

function scoreProduct(product, terms) {
    if (!terms.length) return 0;

    const name = normalizeText(product.name);
    const subcategory = normalizeText(product.subcategory);
    const category = normalizeText(product.category);
    const description = normalizeText(product.description);
    const keywords = getProductKeywords(product).map(k => normalizeText(k)).join(' ');
    const nameWords = name.split(' ').filter(Boolean);

    let score = 0;

    for (const term of terms) {
        if (name === term) score += 120;
        if (name.startsWith(term)) score += 60;
        if (name.includes(term)) score += 40;
        if (subcategory === term) score += 30;
        if (subcategory.includes(term)) score += 18;
        if (category.includes(term)) score += 12;
        if (keywords.includes(term)) score += 25;
        if (description.includes(term)) score += 6;

        if (nameWords.some(w => isFuzzyMatch(w, term))) score += 20;
        if (subcategory.split(' ').some(w => isFuzzyMatch(w, term))) score += 10;
    }

    return score;
}

function findProducts(term, limit) {
    const terms = getSearchTerms(term);
    if (!terms.length) return [];

    const scored = [];
    for (const product of products) {
        const score = scoreProduct(product, terms);
        if (score > 0) scored.push({ product, score });
    }

    scored.sort((a, b) => b.score - a.score);

    const list = scored.map(entry => entry.product);
    return typeof limit === 'number' ? list.slice(0, limit) : list;
}

window.DEFAULT_SIZES = DEFAULT_SIZES;
window.DEFAULT_COLORS = DEFAULT_COLORS;
window.COLOR_MAP = COLOR_MAP;
window.normalizeOptions = normalizeOptions;
window.SYNONYMS = SYNONYMS;
window.normalizeText = normalizeText;
window.levenshtein = levenshtein;
window.findProducts = findProducts;
