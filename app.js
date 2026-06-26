// ============================================================
// Venezuela Earthquake Emergency Portal — app.js
// ============================================================
// Cloudinary credentials (unsigned upload preset is the safest
// approach for a public static site; the API secret is used here
// only to generate a SHA-1 signature client-side via Web Crypto).
// ============================================================

let CLOUDINARY_CLOUD_NAME   = localStorage.getItem("cloudinary_cloud_name") || "dndiosy4u";
let CLOUDINARY_UPLOAD_PRESET = localStorage.getItem("cloudinary_upload_preset") || "venezuela_ayuda"; // unsigned preset

// ============================================================
// Firebase configuration & initialization
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyBuzYagg3Q8Y4aAOiTlXFpbTWZnZ6foR4Y",
  authDomain: "click-shop-app.firebaseapp.com",
  databaseURL: "https://click-shop-app-default-rtdb.firebaseio.com",
  projectId: "click-shop-app",
  storageBucket: "click-shop-app.firebasestorage.app",
  messagingSenderId: "233795372315",
  appId: "1:233795372315:web:9521d8ff6168eab4413fbe"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ──────────────────────────────────────────────────────────────
// 1. STATIC RESOURCES DATABASE
// ──────────────────────────────────────────────────────────────
const OFFICIAL_RESOURCES = [
    {
        id: "r1",
        title: "Venezuela Te Busca",
        category: "people",
        desc: "Plataforma ciudadana y colaborativa creada a raíz del sismo del 24 de junio de 2026. Centraliza información sobre personas desaparecidas para facilitar el reencuentro de familiares.",
        url: "https://venezuelatebusca.com/",
        location: "Nacional",
        tags: ["Busqueda", "Ciudadano", "Colaborativo"],
        image: ""
    },
    {
        id: "r2",
        title: "Desaparecidos Terremoto Venezuela",
        category: "people",
        desc: "Directorio web abierto e independiente para registrar reportes de personas incomunicadas y facilitar información de contacto sobre personas rescatadas.",
        url: "https://desaparecidosterremotovenezuela.com",
        location: "Nacional",
        tags: ["Busqueda", "Ciudadano", "Registro"],
        image: ""
    },
    {
        id: "r3",
        title: "FUNVISIS — Reportes Sísmicos Oficiales",
        category: "news",
        desc: "Fundación Venezolana de Investigaciones Sismológicas. Monitoreo constante de réplicas, epicentros, intensidades y boletines científicos oficiales en tiempo real.",
        url: "https://www.funvisis.gob.ve",
        location: "Nacional",
        tags: ["Oficial", "Sismologia", "Alertas"],
        image: ""
    },
    {
        id: "r4",
        title: "Digitel — Llamadas y SMS Gratuitos",
        category: "news",
        desc: "Llamadas y mensajería de texto (SMS) sin costo durante 48 horas tras el sismo. Aplica para clientes en Caracas, La Guaira, Morón, Valencia, San Diego, Maracay, San Felipe y Barquisimeto.",
        url: "https://www.digitel.com.ve",
        location: "Zonas Afectadas",
        tags: ["Digitel", "Gratuito", "Comunicado"],
        image: ""
    },
    {
        id: "r5",
        title: "Centros de Acopio Carabobo — Todos Con Vzla",
        category: "donations",
        desc: "Puntos activos de recolección en Valencia (El Viñedo - Ed. Talislandia Mezzanina), Miranda (Galpón Los Pinto), Bejuma (Av. Los Fundadores), Montalbán (Casa de la Cultura) y San Diego (Iglesia La Esmeralda). Se recibe agua, alimentos, insumos médicos y ropa.",
        url: "https://www.instagram.com/todosconvzla",
        location: "Carabobo",
        tags: ["Acopio", "Donacion", "Carabobo"],
        image: ""
    },
    {
        id: "r6",
        title: "Cruz Roja Venezolana — Contacto Familiar (RCF)",
        category: "people",
        desc: "Servicio de Restablecimiento del Contacto entre Familiares. Si perdiste comunicación con algún familiar, contacta al 0422-7994880. Operado por la Sociedad Venezolana de la Cruz Roja.",
        url: "https://www.cruzroja.org.ve",
        location: "Nacional",
        tags: ["CruzRoja", "Familiar", "Oficial"],
        image: ""
    },
    {
        id: "r7",
        title: "Primeros Auxilios Psicológicos — Psicólogos Sin Fronteras",
        category: "health",
        desc: "Línea de atención telefónica gratuita. Soporte y contención emocional para víctimas del sismo. Horario: lunes a viernes, 8:30 AM a 9:00 PM. Contacto: 0412-7225080.",
        url: "tel:04127225080",
        location: "Nacional",
        tags: ["Salud Mental", "Gratis", "Soporte"],
        image: ""
    },
    {
        id: "r8",
        title: "Cecodap — Atención a Niñez y Adolescencia",
        category: "health",
        desc: "Canales de atención psicológica priorizados para niños y jóvenes afectados por el sismo. Atiende ansiedad, duelo, terrores nocturnos y riesgo suicida. WhatsApp: +58424-2842359 / +58414-2696823. Correo: cecodap.sap@gmail.com",
        url: "https://www.cecodap.org.ve",
        location: "Nacional",
        tags: ["Ninos", "Adolescentes", "Gratis"],
        image: ""
    }
];

// ──────────────────────────────────────────────────────────────
// 2. STATIC FLYER GALLERY
// ──────────────────────────────────────────────────────────────
const STATIC_GALLERY = [
    {
        id: "g1",
        title: "Listado de Pacientes — Hospital Miguel Pérez Carreño",
        desc: "Lista transcrita de personas heridas ingresadas en La Yaguara, trasladadas desde La Guaira.",
        image: "https://placehold.co/800x600/0f172a/94a3b8?text=Listado+Pacientes%0AH.+P%C3%A9rez+Carre%C3%B1o",
        date: "25 de junio de 2026"
    },
    {
        id: "g2",
        title: "Restablecimiento del Contacto Familiar — Cruz Roja",
        desc: "Comunicado oficial con el número de contacto para ubicar familiares incomunicados. Número: 0422-7994880.",
        image: "https://placehold.co/800x600/0f172a/ef4444?text=Cruz+Roja+Venezolana%0AContacto%3A+0422-7994880",
        date: "24 de junio de 2026"
    },
    {
        id: "g3",
        title: "Solicitud de Apoyo Psicológico — Psicólogos Carabobo",
        desc: "Folleto con código QR para solicitar primeros auxilios psicológicos y contención emocional gratuita.",
        image: "https://placehold.co/800x600/0f172a/818cf8?text=Apoyo+Psicol%C3%B3gico%0APsic%C3%B3logos+Carabobo",
        date: "25 de junio de 2026"
    },
    {
        id: "g4",
        title: "Atención Psicológica Niñez — Cecodap & Unicef",
        desc: "Canales de soporte telefónico gratuito para niños y adolescentes con ansiedad, duelo o riesgo suicida.",
        image: "https://placehold.co/800x600/0f172a/34d399?text=Cecodap+%26+Unicef%0ANi%C3%B1ez+y+Adolescencia",
        date: "24 de junio de 2026"
    },
    {
        id: "g5",
        title: "Comunicado Situación — Bomberos de Maracaibo",
        desc: "Comunicado institucional: completa calma en Maracaibo, equipos desplegados. Contacto 24h: 0414-1479760.",
        image: "https://placehold.co/800x600/0f172a/f59e0b?text=Bomberos+de+Maracaibo%0A0414-1479760",
        date: "24 de junio de 2026"
    },
    {
        id: "g6",
        title: "Centro de Acopio Valencia — El Viñedo",
        desc: "Av. Monseñor Adams, Ed. Talislandia Mezzanina. Se recibe agua, alimentos, insumos médicos y ropa.",
        image: "https://placehold.co/800x600/0f172a/60a5fa?text=Centro+de+Acopio%0AValencia+El+Vi%C3%B1edo",
        date: "24 de junio de 2026"
    },
    {
        id: "g7",
        title: "Centros de Acopio Municipios Carabobo",
        desc: "Puntos activos en Miranda, Bejuma, Montalbán, San Diego, Carlos Arvelo y Diego Ibarra.",
        image: "https://placehold.co/800x600/0f172a/60a5fa?text=Acopio+Carabobo%0AMirandas+y+Municipios",
        date: "24 de junio de 2026"
    },
    {
        id: "g8",
        title: "Llamadas y SMS Gratuitos — Comunicado Digitel",
        desc: "48 horas de llamadas y mensajes sin costo en zonas afectadas. Aplica a clientes Digitel.",
        image: "https://placehold.co/800x600/0f172a/a78bfa?text=Digitel%0ASMS+y+Llamadas+Gratis+48h",
        date: "24 de junio de 2026"
    }
];

// ──────────────────────────────────────────────────────────────
// 3. PATIENTS DATABASE (Transcribed from Hospital communiqué)
// ──────────────────────────────────────────────────────────────
const PATIENTS = [
    { name: "Adriana Vastidas",    id: "17.856.045", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Alejandra Soja",      id: "6.904.629",  facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Alexandra Cárdenas",  id: "28.143.770", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Alvaro Ortiz",        id: "4.163.469",  facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Amilcar Stabilitto",  id: "23.241.059", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Ana Aguilera",        id: "20.003.134", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Ana Dias",            id: "10.576.803", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Ana Fernandez",       id: "25.699.054", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Anabela Morillo",     id: "34.588.981", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Angel Fernandez",     id: "16.310.014", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Ariana Sandoval",     id: "34.518.879", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Ayari Castillo",      id: "26.327.913", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Barbara Quintero",    id: "13.422.890", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Candelario Novis",    id: "9.416.493",  facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Celiana Mijares",     id: "19.734.177", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Cenaida Paredez",     id: "6.405.488",  facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "César Pacheco",       id: "26.327.366", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Crisbel Granado",     id: "23.926.261", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Crisdeilis Quintero", id: "32.865.296", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Cruz Hernández",      id: "4.636.722",  facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Dayana Rondón",       id: "Sin cédula", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Diego Garcia",        id: "33.423.811", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Duñar Lopez",         id: "12.115.323", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Eduar Arana",         id: "Sin cédula", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Eiban Yegue",         id: "24.058.780", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Elianni Idalgo",      id: "32.976.229", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Elisabeth Chacón",    id: "27.374.286", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Elizabeth Gonzalez",  id: "17.709.218", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Emira Guerra",        id: "26.019.884", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Eric Godoy",          id: "18.749.225", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Fleici Valero",       id: "13.574.764", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Francis Medina",      id: "2.856.59 (ilegible)", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Fran Rondón",         id: "19.659.867", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Rosalinda Viera",     id: "13.717.087", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Samuel Peroza",       id: "33.020.891", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Thais Lopez",         id: "13.641.870", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Valeria Azocar",      id: "28.544.619", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Veronica Bastardo",   id: "30.170.686", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Victoria Miranda",    id: "34.054.588", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Viviana Carrizo",     id: "33.232.603", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Franley di Lopez",    id: "Sin cédula", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Gabriel Brizuela",    id: "32.781.459", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Gabriel Goncalvez",   id: "82.230.906", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Genesis Bracamonte",  id: "31.428.533", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Gonzalo León",        id: "22.916.224", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Heilimar Garcia",     id: "32.543.420", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Ibsen Iglesias",      id: "32.359.883", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Isabel Gonzales",     id: "29.701.695", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Isabel Torres",       id: "4.718.019",  facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Juan Salazar",        id: "27.044.236", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Judid Paredes",       id: "3.883.421",  facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Juver Garcia",        id: "27.377.514", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Karleidi Rivero",     id: "36.091.784", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Leonardo Becerra",    id: "34.800.366", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Lesvia Morales",      id: "5.965.096",  facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Lourdes Oropeza",     id: "14.312.752", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Mailin Lopez",        id: "15.541.666", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Manuel Gomez",        id: "18.814.839", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Manuela De Anzola",   id: "296.723",    facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Marcela Bernal",      id: "6.049.995",  facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Maria Montolla",      id: "25.025.734", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Maria Quillen",       id: "6.059.288",  facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Maria Zamora",        id: "27.044.236", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Meri Chavez",         id: "81.462.470", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Merido Bueno",        id: "17.158.021", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Milagro Palma",       id: "Sin cédula", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Milerbis Gonzalez",   id: "26.468.240", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Nathacha Medina",     id: "29.565.365", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Nayibi Molina",       id: "29.768.360", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Oriana Ramírez",      id: "27.606.264", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Petra Sucre",         id: "2.945.823",  facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Rodrigo Fernandez",   id: "Sin cédula", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Rosa Marcano",        id: "4.498.435",  facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Wilian Alvarez",      id: "16.125.101", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Wuilliams Martinez",  id: "19.367.804", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Yadira Cordero",      id: "12.763.837", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Yaneli Acosta",       id: "31.760.907", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Yenni Marcano",       id: "18.384.289", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Yodalis Navas",       id: "30.072.743", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Yonny Ortuño",        id: "5.199.652",  facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Zoraida Martínez",    id: "6.092.167",  facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" }
];

// ──────────────────────────────────────────────────────────────
// 4. SVG CATEGORY ICONS
// ──────────────────────────────────────────────────────────────
const CATEGORY_ICONS = {
    people: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    news:    `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    donations:`<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
    health:  `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>`
};
const CATEGORY_NAMES = {
    people: "Búsqueda de Personas",
    news: "Reportes y Noticias",
    donations: "Donaciones y Acopio",
    health: "Salud y Refugios"
};

// ──────────────────────────────────────────────────────────────
// 5. APP STATE
// ──────────────────────────────────────────────────────────────
let resources = [];
let currentCategory = "all";
let currentSearch = "";
let currentPatientSearch = "";

// ──────────────────────────────────────────────────────────────
// 6. CLOUDINARY — SHA-1 SIGNED UPLOAD (Web Crypto API)
// ──────────────────────────────────────────────────────────────

/**
 * Upload a File object to Cloudinary using an UNSIGNED upload preset.
 * No server or API secret needed — safe for static/public sites.
 * 
 * IMPORTANT: You must create a FREE Cloudinary account and configure an
 * UNSIGNED upload preset. Then enter your Cloud Name and Preset via the
 * "Configurar Cloudinary" button in the footer.
 */
async function uploadToCloudinary(file, folder = "venezuela_ayuda") {
    // Validate config before attempting upload
    if (!CLOUDINARY_CLOUD_NAME) {
        throw new Error(
            'Cloudinary no está configurado. Haz clic en "Configurar Cloudinary" en el footer ' +
            'e ingresa tu Cloud Name y un Upload Preset sin firma (Unsigned).'
        );
    }
    if (!CLOUDINARY_UPLOAD_PRESET) {
        throw new Error('Falta el Upload Preset de Cloudinary. Configúralo en el footer.');
    }

    const formData = new FormData();
    formData.append("file",           file);
    formData.append("upload_preset",  CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder",         folder);

    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const res  = await fetch(endpoint, { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok || data.error) {
        const msg = data.error?.message || "Error al subir la imagen";
        if (res.status === 401) {
            throw new Error(
                `Error de autorización (401): El preset "${CLOUDINARY_UPLOAD_PRESET}" puede no ser Unsigned. ` +
                'Ve a cloudinary.com/console/settings/upload, crea un preset de tipo "Unsigned" y actualiza la configuración.'
            );
        }
        throw new Error(msg);
    }
    return data.secure_url;
}

// ──────────────────────────────────────────────────────────────
// 7. FIREBASE UPLOAD TRACKING (Allows users to delete only their own posts)
// ──────────────────────────────────────────────────────────────
function trackMyUpload(key, type) {
    try {
        const storageKey = type === "resource" ? "ve_my_resources" : "ve_my_gallery";
        const list = JSON.parse(localStorage.getItem(storageKey) || "[]");
        list.push(key);
        localStorage.setItem(storageKey, JSON.stringify(list));
    } catch (e) { /* ignore */ }
}

function isMyUpload(key, type) {
    try {
        const storageKey = type === "resource" ? "ve_my_resources" : "ve_my_gallery";
        const list = JSON.parse(localStorage.getItem(storageKey) || "[]");
        return list.includes(key);
    } catch (e) {
        return false;
    }
}

// ──────────────────────────────────────────────────────────────
// 9. TOAST NOTIFICATIONS
// ──────────────────────────────────────────────────────────────
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast";
    if (type === "error") toast.style.borderLeftColor = "#ef4444";
    if (type === "info")  toast.style.borderLeftColor = "#6366f1";

    toast.innerHTML = `<span>${message}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"
             stroke-linecap="round" stroke-linejoin="round" style="cursor:pointer;opacity:.7"
             onclick="this.parentElement.remove()">
            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("fade-out");
        toast.addEventListener("animationend", () => toast.remove());
    }, 4000);
}

// ──────────────────────────────────────────────────────────────
// 10. HELPERS
// ──────────────────────────────────────────────────────────────
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, t =>
        ({ "&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;" }[t] || t));
}

function removeAccents(str) {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// ──────────────────────────────────────────────────────────────
// 11. RENDER: RESOURCE CARDS (Links tab)
// ──────────────────────────────────────────────────────────────
function renderCards(list) {
    const grid = document.getElementById("resources-grid");
    const noResults = document.getElementById("no-results");
    const count = document.getElementById("results-count");
    grid.innerHTML = "";

    if (!list.length) {
        grid.style.display = "none";
        noResults.style.display = "flex";
        count.textContent = "Sin resultados";
        return;
    }

    grid.style.display = "grid";
    noResults.style.display = "none";
    count.textContent = `Mostrando ${list.length} ${list.length === 1 ? "recurso" : "recursos"}`;

    list.forEach(item => {
        const card = document.createElement("article");
        card.className = `resource-card card-cat-${item.category}`;

        const isUserResource = isMyUpload(item.id, "resource");
        const deleteBtnHTML = isUserResource
            ? `<button class="resource-delete-btn" data-id="${item.id}" title="Eliminar enlace" onclick="deleteResourceItem('${item.id}',event)">
                   <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M9 6V4h6v2"></path></svg>
               </button>`
            : "";

        const tagsHTML = item.tags.map(t =>
            `<span class="badge" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:var(--text-secondary);font-size:.65rem">${t}</span>`
        ).join(" ");

        const mediaHTML = item.image
            ? `<div class="card-media">
                   <img class="card-img" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}"
                        onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
                   <div class="card-illustration bg-grad-${item.category}" style="display:none">
                       ${CATEGORY_ICONS[item.category]||""}
                   </div>
               </div>`
            : `<div class="card-media">
                   <div class="card-illustration bg-grad-${item.category}">
                       ${CATEGORY_ICONS[item.category]||""}
                       <span style="font-size:.8rem;font-weight:600;opacity:.9">${CATEGORY_NAMES[item.category]}</span>
                   </div>
               </div>`;

        card.innerHTML = `
            ${mediaHTML}
            ${deleteBtnHTML}
            <div class="card-badges">
                <span class="badge badge-${item.category}">${CATEGORY_NAMES[item.category]}</span>
            </div>
            ${item.location ? `<span class="badge-location">
                <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                ${escapeHTML(item.location)}</span>` : ""}
            <div class="card-body">
                <h3 class="card-title">${escapeHTML(item.title)}</h3>
                ${item.desc ? `<p class="card-desc">${escapeHTML(item.desc)}</p>` : ""}
                <div style="margin-bottom:1.25rem;display:flex;flex-wrap:wrap;gap:.25rem">${tagsHTML}</div>
                <div class="card-actions">
                    <a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer" class="btn-open-link">
                        <span>Visitar Sitio</span>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                    <button class="btn-copy" data-url="${escapeHTML(item.url)}">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                    </button>
                </div>
            </div>`;
        grid.appendChild(card);
    });

    grid.querySelectorAll(".btn-copy").forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            const url = this.dataset.url;
            navigator.clipboard.writeText(url).then(() => {
                showToast("Enlace copiado al portapapeles");
                const orig = this.innerHTML;
                this.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                this.style.color = "var(--color-donations)";
                this.style.borderColor = "var(--color-donations)";
                setTimeout(() => { this.innerHTML = orig; this.style.color = ""; this.style.borderColor = ""; }, 1500);
            }).catch(() => showToast("Error al copiar", "error"));
        });
    });
}

// ──────────────────────────────────────────────────────────────
// 12. RENDER: GALLERY (Flyers tab)
// ──────────────────────────────────────────────────────────────
function renderGallery(items) {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;
    grid.innerHTML = "";

    if (!items.length) {
        grid.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:3rem 1rem;grid-column:1/-1">No hay imágenes en la galería.</p>`;
        return;
    }

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "gallery-card";
        card.dataset.id = item.id;

        const isUserItem = isMyUpload(item.id, "gallery");
        const deleteBtn = isUserItem
            ? `<button class="gallery-delete-btn" data-id="${item.id}" title="Eliminar imagen" onclick="deleteGalleryItem('${item.id}',event)">
                   <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
               </button>`
            : "";

        card.innerHTML = `
            <div class="gallery-card-img-wrapper">
                <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}"
                     loading="lazy"
                     onerror="this.src='https://placehold.co/600x400/0f172a/94a3b8?text=Comunicado'">
                ${deleteBtn}
            </div>
            <div class="gallery-card-info">
                <h3 class="gallery-card-title">${escapeHTML(item.title)}</h3>
                ${item.desc ? `<p class="gallery-card-desc">${escapeHTML(item.desc)}</p>` : ""}
                <span class="gallery-card-meta">${escapeHTML(item.date || "")}</span>
            </div>`;
        card.addEventListener("click", (e) => {
            if (e.target.closest(".gallery-delete-btn")) return;
            openLightbox(item.image, item.title);
        });
        grid.appendChild(card);
    });
}

function deleteGalleryItem(id, e) {
    e.stopPropagation();
    if (!confirm("¿Eliminar esta imagen de la galería?")) return;
    db.ref("gallery/" + id).remove()
        .then(() => {
            showToast("Imagen eliminada de la galería");
        })
        .catch(err => {
            showToast("Error al eliminar imagen: " + err.message, "error");
        });
}

function deleteResourceItem(id, e) {
    e.stopPropagation();
    if (!confirm("¿Eliminar este enlace del directorio?")) return;
    db.ref("resources/" + id).remove()
        .then(() => {
            showToast("Enlace eliminado del directorio");
        })
        .catch(err => {
            showToast("Error al eliminar enlace: " + err.message, "error");
        });
}

// ──────────────────────────────────────────────────────────────
// 13. LIGHTBOX
// ──────────────────────────────────────────────────────────────
function openLightbox(src, caption) {
    document.getElementById("lightbox-img").src = src;
    document.getElementById("lightbox-caption").textContent = caption;
    document.getElementById("lightbox-modal").classList.add("open");
    document.body.style.overflow = "hidden";
}
function closeLightbox() {
    document.getElementById("lightbox-modal").classList.remove("open");
    document.body.style.overflow = "";
}

// ──────────────────────────────────────────────────────────────
// 14. RENDER: PATIENTS TABLE
// ──────────────────────────────────────────────────────────────
function renderPatients(list) {
    const tbody = document.getElementById("patients-table-body");
    const tableWrap = document.querySelector(".table-responsive");
    const noRes = document.getElementById("no-patients-results");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (!list.length) {
        tableWrap.style.display = "none";
        noRes.style.display = "flex";
        return;
    }
    tableWrap.style.display = "block";
    noRes.style.display = "none";

    list.forEach(p => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${escapeHTML(p.name)}</strong></td>
            <td>${escapeHTML(p.id)}</td>
            <td>${escapeHTML(p.facility)}</td>
            <td>${escapeHTML(p.origin)}</td>`;
        tbody.appendChild(row);
    });
}

// ──────────────────────────────────────────────────────────────
// 15. FILTER FUNCTIONS
// ──────────────────────────────────────────────────────────────
function filterItems() {
    const q = removeAccents(currentSearch.toLowerCase());
    const filtered = resources.filter(item => {
        const catOk = currentCategory === "all" || item.category === currentCategory;
        const txtOk = !q || [item.title, item.desc, item.location, ...item.tags].some(f => 
            f && removeAccents(f.toLowerCase()).includes(q)
        );
        return catOk && txtOk;
    });
    renderCards(filtered);
}

function filterPatients() {
    const q = removeAccents(currentPatientSearch.toLowerCase().replace(/\./g, ""));
    const filtered = PATIENTS.filter(p =>
        removeAccents(p.name.toLowerCase()).includes(q) ||
        removeAccents(p.id.replace(/\./g, "").toLowerCase()).includes(q) ||
        removeAccents(p.origin.toLowerCase()).includes(q)
    );
    renderPatients(filtered);
}

// ──────────────────────────────────────────────────────────────
// 16. MAIN EVENT SETUP
// ──────────────────────────────────────────────────────────────
function setupEventListeners() {

    // ── Helper modal close functions ──
    const imgPreviewWrap = document.getElementById("img-preview-wrapper");
    const uploadDropArea = document.getElementById("upload-drop-area");
    const uploadStatus   = document.getElementById("upload-status");

    function closeSuggestModal() {
        const modal = document.getElementById("suggest-modal");
        modal.classList.remove("open");
        document.body.style.overflow = "";
        document.getElementById("suggest-form").reset();
        if (imgPreviewWrap) imgPreviewWrap.style.display = "none";
        if (uploadDropArea) uploadDropArea.style.display = "flex";
        if (uploadStatus)   uploadStatus.textContent = "";
    }

    const galleryUploadModal = document.getElementById("gallery-upload-modal");
    const galleryPreviewWrap = document.getElementById("gallery-preview-wrapper");
    const galleryDropArea    = document.getElementById("gallery-drop-area");
    const galleryStatus      = document.getElementById("gallery-upload-status");
    let galleryCurrentTab    = "file"; // track active tab

    // Gallery tab switching (file vs URL) — exposed globally for inline onclick
    window.switchGalleryTab = function(tab) {
        galleryCurrentTab = tab;
        const modeFile = document.getElementById("gallery-mode-file");
        const modeUrl  = document.getElementById("gallery-mode-url");
        const tabFile  = document.getElementById("gallery-tab-file");
        const tabUrl   = document.getElementById("gallery-tab-url");
        if (tab === "file") {
            modeFile.style.display = "block";
            modeUrl.style.display  = "none";
            tabFile.style.borderBottom = "2px solid var(--color-people)";
            tabUrl.style.borderBottom  = "none";
        } else {
            modeFile.style.display = "none";
            modeUrl.style.display  = "block";
            tabFile.style.borderBottom = "none";
            tabUrl.style.borderBottom  = "2px solid var(--color-people)";
        }
    };

    // URL input preview
    const galleryImgUrlInput = document.getElementById("gallery-img-url");
    const galleryUrlPreviewWrap = document.getElementById("gallery-url-preview-wrapper");
    const galleryUrlPreview  = document.getElementById("gallery-url-preview");
    if (galleryImgUrlInput) {
        galleryImgUrlInput.addEventListener("input", function() {
            const url = this.value.trim();
            if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
                galleryUrlPreview.src = url;
                galleryUrlPreviewWrap.style.display = "block";
            } else {
                galleryUrlPreviewWrap.style.display = "none";
            }
        });
    }

    function closeGalleryModal() {
        galleryUploadModal.classList.remove("open");
        document.body.style.overflow = "";
        document.getElementById("gallery-upload-form").reset();
        if (galleryPreviewWrap) galleryPreviewWrap.style.display = "none";
        if (galleryDropArea)    galleryDropArea.style.display = "flex";
        if (galleryStatus)      galleryStatus.textContent = "";
        if (galleryUrlPreviewWrap) galleryUrlPreviewWrap.style.display = "none";
        // Reset to file tab
        window.switchGalleryTab("file");
    }

    const settingsModal = document.getElementById("settings-modal");
    const settingsForm  = document.getElementById("settings-form");
    const cloudNameInput   = document.getElementById("settings-cloud-name");
    const uploadPresetInput = document.getElementById("settings-upload-preset");

    function closeSettingsModal() {
        if (settingsModal) {
            settingsModal.classList.remove("open");
            document.body.style.overflow = "";
        }
    }

    // ── Navigation tabs ──
    document.querySelectorAll(".nav-tab").forEach(tab => {
        tab.addEventListener("click", function() {
            document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
            document.querySelectorAll(".view-container").forEach(v => v.classList.remove("active"));
            this.classList.add("active");
            document.getElementById(this.dataset.target).classList.add("active");
        });
    });

    // ── ESC key closes any open modal ──
    document.addEventListener("keydown", function(e) {
        if (e.key !== "Escape") return;
        if (document.getElementById("suggest-modal").classList.contains("open")) {
            closeSuggestModal();
        }
        if (document.getElementById("gallery-upload-modal").classList.contains("open")) {
            closeGalleryModal();
        }
        if (document.getElementById("settings-modal")?.classList.contains("open")) {
            closeSettingsModal();
        }
        if (document.getElementById("lightbox-modal").classList.contains("open")) {
            closeLightbox();
        }
    });

    // ── Lightbox ──
    document.getElementById("close-lightbox").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-modal").addEventListener("click", function(e) {
        if (e.target === this) closeLightbox();
    });

    // ── Resource search ──
    const searchInput  = document.getElementById("search-input");
    const clearSearch  = document.getElementById("clear-search");
    searchInput.addEventListener("input", function() {
        currentSearch = this.value;
        clearSearch.style.display = currentSearch ? "flex" : "none";
        filterItems();
    });
    clearSearch.addEventListener("click", () => {
        searchInput.value = ""; currentSearch = "";
        clearSearch.style.display = "none";
        searchInput.focus(); filterItems();
    });

    // ── Category tabs ──
    document.getElementById("filter-tabs").addEventListener("click", function(e) {
        const btn = e.target.closest(".tab-btn");
        if (!btn) return;
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.category;
        filterItems();
    });

    // ── Reset filters ──
    document.getElementById("reset-filters").addEventListener("click", () => {
        document.getElementById("search-input").value = "";
        document.getElementById("clear-search").style.display = "none";
        currentSearch = ""; currentCategory = "all";
        document.querySelector('[data-category="all"]').classList.add("active");
        document.querySelectorAll(".tab-btn:not([data-category='all'])").forEach(b => b.classList.remove("active"));
        filterItems();
    });

    // ── Patient search ──
    const patInput = document.getElementById("patient-search-input");
    const patClear = document.getElementById("clear-patient-search");
    patInput.addEventListener("input", function() {
        currentPatientSearch = this.value;
        patClear.style.display = currentPatientSearch ? "flex" : "none";
        filterPatients();
    });
    patClear.addEventListener("click", () => {
        patInput.value = ""; currentPatientSearch = "";
        patClear.style.display = "none";
        patInput.focus(); filterPatients();
    });

    // ── Open suggest / add link modal ──
    document.getElementById("open-suggest-modal").addEventListener("click", () => {
        document.getElementById("suggest-form").reset();
        if (imgPreviewWrap) imgPreviewWrap.style.display = "none";
        if (uploadDropArea) uploadDropArea.style.display = "flex";
        if (uploadStatus)   uploadStatus.textContent = "";
        document.getElementById("suggest-modal").classList.add("open");
        document.body.style.overflow = "hidden";
    });

    // ── Close suggest modal ──
    document.getElementById("close-modal").addEventListener("click", closeSuggestModal);
    document.getElementById("suggest-modal").addEventListener("click", function(e) {
        if (e.target === this) closeSuggestModal();
    });

    // ── Image preview in the suggest modal ──
    const imgFileInput  = document.getElementById("link-image-file");
    const imgPreview    = document.getElementById("img-preview");

    if (imgFileInput) {
        imgFileInput.addEventListener("change", function() {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                imgPreview.src = e.target.result;
                imgPreviewWrap.style.display = "block";
                if (uploadDropArea) uploadDropArea.style.display = "none";
            };
            reader.readAsDataURL(file);
        });
    }

    // ── Add Link form submission (with optional Cloudinary image upload) ──
    document.getElementById("suggest-form").addEventListener("submit", async function(e) {
        e.preventDefault();

        const submitBtn  = this.querySelector('button[type="submit"]');
        const title      = document.getElementById("link-title").value.trim();
        const category   = document.getElementById("link-category").value;
        const location   = document.getElementById("link-location").value.trim() || "Nacional";
        const url        = document.getElementById("link-url").value.trim();
        const desc       = document.getElementById("link-desc").value.trim();
        const fileInput  = document.getElementById("link-image-file");
        const file       = fileInput?.files[0];

        // Determine add-to-gallery flag
        const addToGallery = document.getElementById("add-to-gallery")?.checked;

        let imageUrl = "";

        if (file) {
            submitBtn.disabled = true;
            submitBtn.querySelector("span").textContent = "Subiendo imagen...";
            if (uploadStatus) { uploadStatus.textContent = "Subiendo a Cloudinary..."; uploadStatus.style.color = "#94a3b8"; }

            try {
                imageUrl = await uploadToCloudinary(file);
                if (uploadStatus) { uploadStatus.textContent = "Imagen subida correctamente."; uploadStatus.style.color = "#34d399"; }
                showToast("Imagen subida a Cloudinary correctamente");
            } catch (err) {
                if (uploadStatus) { uploadStatus.textContent = "Error: " + err.message; uploadStatus.style.color = "#ef4444"; }
                showToast("Error al subir la imagen: " + err.message, "error");
                submitBtn.disabled = false;
                submitBtn.querySelector("span").textContent = "Agregar Enlace";
                return;
            }
        }

        const tags = [location, CATEGORY_NAMES[category].split(" ")[0]];
        if (title.toLowerCase().includes("cruz")) tags.push("CruzRoja");

        submitBtn.disabled = true;
        submitBtn.querySelector("span").textContent = "Guardando...";

        const newResource = { title, category, desc, url, location, tags, image: imageUrl };
        const newRef = db.ref("resources").push();
        newRef.set(newResource)
            .then(() => {
                trackMyUpload(newRef.key, "resource");
                showToast("Enlace agregado correctamente");

                // Optionally also save in gallery
                if (addToGallery && imageUrl) {
                    const galleryItem = {
                        title,
                        desc,
                        image: imageUrl,
                        date: new Date().toLocaleDateString("es-VE", { year:"numeric", month:"long", day:"numeric" })
                    };
                    const newGalleryRef = db.ref("gallery").push();
                    newGalleryRef.set(galleryItem)
                        .then(() => {
                            trackMyUpload(newGalleryRef.key, "gallery");
                        });
                }
                closeSuggestModal();
            })
            .catch(err => {
                showToast("Error al guardar en base de datos: " + err.message, "error");
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.querySelector("span").textContent = "Agregar Enlace";
            });
    });

    // ── Gallery upload modal ──
    const galleryFileInput   = document.getElementById("gallery-file-input");
    const galleryPreview     = document.getElementById("gallery-preview");

    document.getElementById("open-gallery-upload").addEventListener("click", () => {
        document.getElementById("gallery-upload-form").reset();
        if (galleryPreviewWrap) galleryPreviewWrap.style.display = "none";
        if (galleryDropArea)    galleryDropArea.style.display = "flex";
        if (galleryStatus)      galleryStatus.textContent = "";
        galleryUploadModal.classList.add("open");
        document.body.style.overflow = "hidden";
    });

    document.getElementById("close-gallery-modal").addEventListener("click", closeGalleryModal);
    galleryUploadModal.addEventListener("click", function(e) {
        if (e.target === this) closeGalleryModal();
    });

    // Preview selected image
    if (galleryFileInput) {
        galleryFileInput.addEventListener("change", function() {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                galleryPreview.src = e.target.result;
                galleryPreviewWrap.style.display = "block";
                if (galleryDropArea) galleryDropArea.style.display = "none";
            };
            reader.readAsDataURL(file);
        });
    }

    // Submit gallery upload form
    document.getElementById("gallery-upload-form").addEventListener("submit", async function(e) {
        e.preventDefault();
        const submitBtn = document.getElementById("gallery-upload-btn");
        const title     = document.getElementById("gallery-img-title").value.trim();
        const file      = galleryFileInput?.files[0];
        const directUrl = (document.getElementById("gallery-img-url")?.value || "").trim();

        // URL mode — use URL directly, no Cloudinary needed
        if (galleryCurrentTab === "url") {
            if (!directUrl) {
                showToast("Por favor pega una URL de imagen", "error");
                return;
            }
            if (!title) {
                showToast("Por favor escribe un título", "error");
                return;
            }
            submitBtn.disabled = true;
            submitBtn.querySelector("span").textContent = "Guardando...";
            const galleryItem = {
                title,
                desc: "",
                image: directUrl,
                date: new Date().toLocaleDateString("es-VE", { year:"numeric", month:"long", day:"numeric" })
            };
            const newGalleryRef = db.ref("gallery").push();
            try {
                await newGalleryRef.set(galleryItem);
                trackMyUpload(newGalleryRef.key, "gallery");
                showToast("Imagen agregada a la galería correctamente");
                closeGalleryModal();
            } catch(err) {
                showToast("Error al guardar: " + err.message, "error");
            } finally {
                submitBtn.disabled = false;
                submitBtn.querySelector("span").textContent = "Subir a la Galería";
            }
            return;
        }

        // File mode — requires Cloudinary configured
        if (!file) {
            showToast("Por favor selecciona una imagen o cambia al modo URL", "error");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.querySelector("span").textContent = "Subiendo...";
        if (galleryStatus) { galleryStatus.textContent = "Subiendo a Cloudinary..."; galleryStatus.style.color = "#94a3b8"; }

        try {
            const imageUrl = await uploadToCloudinary(file, "venezuela_ayuda_gallery");
            if (galleryStatus) { galleryStatus.textContent = "Imagen subida correctamente."; galleryStatus.style.color = "#34d399"; }

            const galleryItem = {
                title,
                desc: "",
                image: imageUrl,
                date: new Date().toLocaleDateString("es-VE", { year:"numeric", month:"long", day:"numeric" })
            };
            const newGalleryRef = db.ref("gallery").push();
            await newGalleryRef.set(galleryItem);
            trackMyUpload(newGalleryRef.key, "gallery");
            showToast("Imagen agregada a la galería correctamente");
            closeGalleryModal();
        } catch (err) {
            if (galleryStatus) { galleryStatus.textContent = "Error: " + err.message; galleryStatus.style.color = "#ef4444"; }
            showToast("Error: " + err.message, "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector("span").textContent = "Subir a la Galería";
        }
    });

    // ── Settings modal ──
    document.getElementById("open-settings-btn")?.addEventListener("click", () => {
        if (cloudNameInput) cloudNameInput.value = CLOUDINARY_CLOUD_NAME;
        if (uploadPresetInput) uploadPresetInput.value = CLOUDINARY_UPLOAD_PRESET;
        if (settingsModal) {
            settingsModal.classList.add("open");
            document.body.style.overflow = "hidden";
        }
    });

    document.getElementById("close-settings-modal")?.addEventListener("click", closeSettingsModal);
    settingsModal?.addEventListener("click", function(e) {
        if (e.target === this) closeSettingsModal();
    });

    settingsForm?.addEventListener("submit", function(e) {
        e.preventDefault();
        const newCloudName = cloudNameInput.value.trim();
        const newPreset = uploadPresetInput.value.trim();

        if (!newCloudName || !newPreset) {
            showToast("Por favor, rellena todos los campos", "error");
            return;
        }

        CLOUDINARY_CLOUD_NAME = newCloudName;
        CLOUDINARY_UPLOAD_PRESET = newPreset;
        localStorage.setItem("cloudinary_cloud_name", newCloudName);
        localStorage.setItem("cloudinary_upload_preset", newPreset);

        showToast("Configuración guardada correctamente");
        closeSettingsModal();
    });

    document.getElementById("btn-reset-settings")?.addEventListener("click", () => {
        if (cloudNameInput) cloudNameInput.value = "dndiosy4u";
        if (uploadPresetInput) uploadPresetInput.value = "venezuela_ayuda";
    });
}

// ──────────────────────────────────────────────────────────────
// 17. INIT
// ──────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
    // Initial render with static data
    resources = [...OFFICIAL_RESOURCES];
    renderCards(resources);
    renderGallery(STATIC_GALLERY);
    renderPatients(PATIENTS);

    // Setup Firebase listeners
    db.ref("resources").on("value", snapshot => {
        const firebaseResources = [];
        snapshot.forEach(childSnapshot => {
            const item = childSnapshot.val();
            item.id = childSnapshot.key;
            firebaseResources.push(item);
        });
        resources = [...firebaseResources, ...OFFICIAL_RESOURCES];
        filterItems();
    });

    db.ref("gallery").on("value", snapshot => {
        const firebaseGallery = [];
        snapshot.forEach(childSnapshot => {
            const item = childSnapshot.val();
            item.id = childSnapshot.key;
            firebaseGallery.push(item);
        });
        const allGalleryItems = [...firebaseGallery, ...STATIC_GALLERY];
        renderGallery(allGalleryItems);
    });

    setupEventListeners();
});
