// Venezuela Earthquake Emergency Portal - JavaScript Application
// Handles rendering, searching, filtering, tab switching, lightbox, and local storage bookmarks

// 1. Initial Database of Emergency Resources (June 24, 2026 Earthquake)
// Removed all social media (X.com) profiles to keep it strictly focused on central sites and files
const OFFICIAL_RESOURCES = [
    {
        id: "1",
        title: "Venezuela Te Busca",
        category: "people",
        desc: "Plataforma ciudadana y colaborativa creada a raíz del sismo del 24 de junio de 2026. Centraliza información sobre personas desaparecidas para facilitar el reencuentro de familiares.",
        url: "https://venezuelatebusca.com/",
        location: "Nacional",
        tags: ["Busqueda", "Ciudadano", "Colaborativo"],
        image: ""
    },
    {
        id: "2",
        title: "Desaparecidos Terremoto Venezuela",
        category: "people",
        desc: "Directorio web abierto e independiente para registrar reportes de personas incomunicadas y facilitar información de contacto sobre personas rescatadas.",
        url: "https://desaparecidosterremotovenezuela.com",
        location: "Nacional",
        tags: ["Busqueda", "Ciudadano", "Registro"],
        image: ""
    },
    {
        id: "3",
        title: "FUNVISIS - Reportes Sísmicos Oficiales",
        category: "news",
        desc: "Fundación Venezolana de Investigaciones Sismológicas. Monitoreo constante de réplicas, epicentros, intensidades y boletines científicos oficiales en tiempo real.",
        url: "https://www.funvisis.gob.ve",
        location: "Nacional",
        tags: ["Oficial", "Sismologia", "Alertas"],
        image: ""
    },
    {
        id: "4",
        title: "Digitel - Comunicado de Servicios Gratuitos",
        category: "news",
        desc: "Llamadas y mensajería de texto (SMS) sin costo durante 48 horas tras el sismo. Aplica para clientes en Caracas, La Guaira, Morón, Valencia, San Diego, Maracay, San Felipe y Barquisimeto.",
        url: "https://www.digitel.com.ve",
        location: "Zonas Afectadas",
        tags: ["Digitel", "Gratuito", "Comunicado"],
        image: ""
    }
];

// 2. Database of Flyer/Image Items
const GALLERY_ITEMS = [
    {
        id: "g1",
        title: "Listado de Pacientes - Hospital Miguel Pérez Carreño",
        desc: "Lista física transcrita de personas heridas ingresadas en el hospital de La Yaguara (Caracas) trasladadas desde La Guaira tras el sismo.",
        image: "imagenes/pacientes_perez_carreno.jpg",
        date: "25 de junio de 2026"
    },
    {
        id: "g2",
        title: "Restablecimiento del Contacto Familiar - Cruz Roja Venezolana",
        desc: "Información de contacto oficial de la Cruz Roja para ubicar a familiares incomunicados tras el terremoto. Número de contacto: 0422-7994880.",
        image: "imagenes/cruz_roja_contacto.jpg",
        date: "24 de junio de 2026"
    },
    {
        id: "g3",
        title: "Solicitud de Apoyo Psicológico - Colegio de Psicólogos de Carabobo",
        desc: "Folleto oficial con código QR para solicitar primeros auxilios psicológicos y contención emocional gratuita frente a la emergencia.",
        image: "imagenes/psicologia_carabobo.jpg",
        date: "25 de junio de 2026"
    },
    {
        id: "g4",
        title: "Atención Psicológica para Niñez y Adolescencia - Cecodap",
        desc: "Canales de soporte telefónico gratuito priorizado en depresión, ansiedad, duelo y conductas de riesgo para niños y adolescentes.",
        image: "imagenes/cecodap_ninos.jpg",
        date: "24 de junio de 2026"
    },
    {
        id: "g5",
        title: "Comunicado de Situación - Bomberos de Maracaibo",
        desc: "Comunicado institucional de la alerta sismo. Reporta completa calma y despliegue preventivo en Maracaibo, sin heridos ni daños materiales. Contacto directo: 0414-1479760.",
        image: "imagenes/bomberos_maracaibo.jpg",
        date: "24 de junio de 2026"
    },
    {
        id: "g6",
        title: "Centros de Acopio en Valencia - El Viñedo",
        desc: "Ubicación del centro de acopio principal para recolección de agua potable, alimentos no perecederos, ropa e insumos médicos en Valencia, Carabobo.",
        image: "imagenes/acopio_valencia.jpg",
        date: "24 de junio de 2026"
    },
    {
        id: "g7",
        title: "Centros de Acopio en Municipios de Carabobo",
        desc: "Direcciones de los centros de acopio activos en Miranda, Bejuma, Montalbán y San Diego para canalizar la recolección de ayuda humanitaria.",
        image: "imagenes/acopio_carabobo.jpg",
        date: "24 de junio de 2026"
    },
    {
        id: "g8",
        title: "Solidaridad y Llamadas Libres - Digitel",
        desc: "Comunicado oficial que detalla la habilitación gratuita de llamadas y SMS durante 48 horas en las localidades más afectadas por el sismo.",
        image: "imagenes/comunicado_digitel.jpg",
        date: "24 de junio de 2026"
    }
];

// 3. Database of Hospitalized Patients (Transcribed from Pérez Carreño Image)
const PATIENTS = [
    { name: "Adriana Vastidas", id: "17.856.045", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Alejandra Soja", id: "6.904.629", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Alexandra Cárdenas", id: "28.143.770", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Alvaro Ortiz", id: "4.163.469", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Amilcar Stabilitto", id: "23.241.059", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Ana Aguilera", id: "20.003.134", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Ana Dias", id: "10.576.803", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Ana Fernandez", id: "25.699.054", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Anabela Morillo", id: "34.588.981", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Angel Fernandez", id: "16.310.014", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Ariana Sandoval", id: "34.518.879", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Ayari Castillo", id: "26.327.913", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Barbara Quintero", id: "13.422.890", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Candelario Novis", id: "9.416.493", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Celiana Mijares", id: "19.734.177", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Cenaida Paredez", id: "6.405.488", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "César Pacheco", id: "26.327.366", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Crisbel Granado", id: "23.926.261", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Crisdeilis Quintero", id: "32.865.296", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Cruz Hernández", id: "4.636.722", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Dayana Rondón", id: "18 años (Sin cédula)", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Diego Garcia", id: "33.423.811", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Duñar Lopez", id: "12.115.323", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Eduar Arana", id: "Sin cédula", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Eiban Yegue", id: "24.058.780", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Elianni Idalgo", id: "32.976.229", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Elisabeth Chacón", id: "27.374.286", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Elizabeth Gonzalez", id: "17.709.218", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Emira Guerra", id: "26.019.884", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Eric Godoy", id: "18.749.225", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Fleici Valero", id: "13.574.764", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Francis Medina", id: "2.856.59 (ilegible)", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Fran Rondón", id: "19.659.867", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Rosalinda Viera", id: "13.717.087", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Samuel Peroza", id: "33.020.891", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Thais Lopez", id: "13.641.870", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Valeria Azocar", id: "28.544.619", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Veronica Bastardo", id: "30.170.686", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Victoria Miranda", id: "34.054.588", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Viviana Carrizo", id: "33.232.603", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Franley di Lopez", id: "Sin cédula", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Gabriel Brizuela", id: "32.781.459", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Gabriel Goncalvez", id: "82.230.906", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Genesis Bracamonte", id: "31.428.533", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Gonzalo León", id: "22.916.224", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Heilimar Garcia", id: "32.543.420", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Ibsen Iglesias", id: "32.359.883", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Isabel Gonzales", id: "29.701.695", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Isabel Torres", id: "4.718.019", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Juan Salazar", id: "27.044.236", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Judid Paredes", id: "3.883.421", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Juver Garcia", id: "27.377.514", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Karleidi Rivero", id: "36.091.784", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Leonardo Becerra", id: "34.800.366", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Lesvia Morales", id: "5.965.096", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Lourdes Oropeza", id: "14.312.752", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Mailin Lopez", id: "15.541.666", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Manuel Gomez", id: "18.814.839", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Manuela De Anzola", id: "296.723", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Marcela Bernal", id: "6.049.995", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Maria Montolla", id: "25.025.734", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Maria Quillen", id: "6.059.288", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Maria Zamora", id: "27.044.236", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Meri Chavez", id: "81.462.470", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Merido Bueno", id: "17.158.021", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Milagro Palma", id: "Sin cédula", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Milerbis Gonzalez", id: "26.468.240", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Nathacha Medina", id: "29.565.365", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Nayibi Molina", id: "29.768.360", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Oriana Ramírez", id: "27.606.264", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Petra Sucre", id: "2.945.823", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Rodrigo Fernandez", id: "Sin cédula", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Rosa Marcano", id: "4.498.435", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Wilian Alvarez", id: "16.125.101", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Wuilliams Martinez", id: "19.367.804", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Yadira Cordero", id: "12.763.837", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Yaneli Acosta", id: "31.760.907", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Yenni Marcano", id: "18.384.289", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Yodalis Navas", id: "30.072.743", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Yonny Ortuño", id: "5.199.652", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" },
    { name: "Zoraida Martínez", id: "6.092.167", facility: "Hospital Miguel Pérez Carreño", origin: "La Guaira" }
];

// App State
let resources = [];
let currentCategory = "all";
let currentSearch = "";
let currentPatientSearch = "";

// SVG Fallback Icons for Premium look without images
const CATEGORY_ICONS = {
    people: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
             </svg>`,
    news: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
            </svg>`,
    donations: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>`,
    health: `<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
             </svg>`
};

const CATEGORY_NAMES = {
    people: "Búsqueda de Personas",
    news: "Reportes y Noticias",
    donations: "Donaciones y Acopio",
    health: "Salud y Refugios"
};

// DOM Elements
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search");
const filterTabs = document.getElementById("filter-tabs");
const resourcesGrid = document.getElementById("resources-grid");
const resultsCount = document.getElementById("results-count");
const noResults = document.getElementById("no-results");
const resetFiltersBtn = document.getElementById("reset-filters");

// Nav tab switching elements
const navTabs = document.querySelectorAll(".nav-tab");
const viewContainers = document.querySelectorAll(".view-container");

// Gallery Grid Element
const galleryGrid = document.getElementById("gallery-grid");

// Lightbox Elements
const lightboxModal = document.getElementById("lightbox-modal");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const closeLightboxBtn = document.getElementById("close-lightbox");

// Patients Elements
const patientsTableBody = document.getElementById("patients-table-body");
const patientSearchInput = document.getElementById("patient-search-input");
const clearPatientSearchBtn = document.getElementById("clear-patient-search");
const noPatientsResults = document.getElementById("no-patients-results");

// Suggest Modal Elements
const suggestModal = document.getElementById("suggest-modal");
const openModalBtn = document.getElementById("open-suggest-modal");
const closeModalBtn = document.getElementById("close-modal");
const suggestForm = document.getElementById("suggest-form");

// Toast Notification System
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "toast-error" : ""}`;
    
    if (type === "error") {
        toast.style.borderLeftColor = "var(--accent-red)";
    }
    
    toast.innerHTML = `
        <span>${message}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="cursor:pointer; opacity: 0.7;" onclick="this.parentElement.remove()">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add("fade-out");
        toast.addEventListener("animationend", () => {
            toast.remove();
        });
    }, 3500);
}

// Load resources from localStorage + original list
function loadResources() {
    const stored = localStorage.getItem("ve_earthquake_resources");
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            resources = [...parsed, ...OFFICIAL_RESOURCES];
        } catch (e) {
            resources = [...OFFICIAL_RESOURCES];
        }
    } else {
        resources = [...OFFICIAL_RESOURCES];
    }
}

// Render Resources to Grid
function renderCards(filteredList) {
    resourcesGrid.innerHTML = "";
    
    if (filteredList.length === 0) {
        resourcesGrid.style.display = "none";
        noResults.style.display = "flex";
        resultsCount.textContent = "Mostrando 0 recursos de ayuda";
        return;
    }
    
    resourcesGrid.style.display = "grid";
    noResults.style.display = "none";
    resultsCount.textContent = `Mostrando ${filteredList.length} ${filteredList.length === 1 ? 'recurso' : 'recursos'} de ayuda`;
    
    filteredList.forEach(item => {
        const card = document.createElement("article");
        card.className = `resource-card card-cat-${item.category}`;
        card.setAttribute("data-id", item.id);
        
        const tagsHTML = item.tags.map(tag => `<span class="badge" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: var(--text-secondary); font-size: 0.65rem;">${tag}</span>`).join(" ");
        
        let mediaHTML = "";
        if (item.image && item.image.trim() !== "") {
            mediaHTML = `
                <div class="card-media">
                    <img class="card-img" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="card-illustration bg-grad-${item.category}" style="display:none;">
                        ${CATEGORY_ICONS[item.category] || ""}
                        <span style="font-size: 0.8rem; font-weight:600;">${CATEGORY_NAMES[item.category]}</span>
                    </div>
                </div>
            `;
        } else {
            mediaHTML = `
                <div class="card-media">
                    <div class="card-illustration bg-grad-${item.category}">
                        ${CATEGORY_ICONS[item.category] || ""}
                        <span style="font-size: 0.8rem; font-weight:600; opacity: 0.9;">${CATEGORY_NAMES[item.category]}</span>
                    </div>
                </div>
            `;
        }
        
        card.innerHTML = `
            ${mediaHTML}
            <div class="card-badges">
                <span class="badge badge-${item.category}">${CATEGORY_NAMES[item.category]}</span>
            </div>
            ${item.location ? `
                <span class="badge-location">
                    <svg viewBox="0 0 24 24" width="10" height="10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    ${escapeHTML(item.location)}
                </span>
            ` : ""}
            <div class="card-body">
                <h3 class="card-title">${escapeHTML(item.title)}</h3>
                <p class="card-desc">${escapeHTML(item.desc)}</p>
                <div style="margin-bottom: 1.25rem; display:flex; flex-wrap:wrap; gap:0.25rem;">
                    ${tagsHTML}
                </div>
                <div class="card-actions">
                    <a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer" class="btn-open-link">
                        <span>Visitar Sitio</span>
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                    <button class="btn-copy" data-url="${escapeHTML(item.url)}">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                    </button>
                </div>
            </div>
        `;
        
        resourcesGrid.appendChild(card);
    });
    
    // Bind click events on copy button
    document.querySelectorAll(".btn-copy").forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            const url = this.getAttribute("data-url");
            navigator.clipboard.writeText(url)
                .then(() => {
                    showToast("Enlace copiado al portapapeles");
                    const originalIcon = this.innerHTML;
                    this.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                    this.style.color = "var(--color-donations)";
                    this.style.borderColor = "var(--color-donations)";
                    setTimeout(() => {
                        this.innerHTML = originalIcon;
                        this.style.color = "";
                        this.style.borderColor = "";
                    }, 1500);
                })
                .catch(() => {
                    showToast("Error al copiar enlace", "error");
                });
        });
    });
}

// 4. Render Gallery Items
function renderGallery() {
    galleryGrid.innerHTML = "";
    
    GALLERY_ITEMS.forEach(item => {
        const card = document.createElement("div");
        card.className = "gallery-card";
        card.setAttribute("data-img", item.image);
        card.setAttribute("data-title", item.title);
        
        card.innerHTML = `
            <div class="gallery-card-img-wrapper">
                <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" onerror="this.src='https://placehold.co/600x800/0f172a/94a3b8?text=Comunicado+Informativo';">
            </div>
            <div class="gallery-card-info">
                <h3 class="gallery-card-title">${escapeHTML(item.title)}</h3>
                <p class="gallery-card-desc">${escapeHTML(item.desc)}</p>
                <span class="gallery-card-meta">Aviso: ${escapeHTML(item.date)}</span>
            </div>
        `;
        
        // Open Lightbox on click
        card.addEventListener("click", function() {
            const imgPath = this.getAttribute("data-img");
            const title = this.getAttribute("data-title");
            
            lightboxImg.src = imgPath;
            lightboxCaption.textContent = title;
            lightboxModal.classList.add("open");
            document.body.style.overflow = "hidden";
        });
        
        galleryGrid.appendChild(card);
    });
}

// 5. Render Admitted Patients Table
function renderPatients(list) {
    patientsTableBody.innerHTML = "";
    
    if (list.length === 0) {
        document.querySelector(".table-responsive").style.display = "none";
        noPatientsResults.style.display = "flex";
        return;
    }
    
    document.querySelector(".table-responsive").style.display = "block";
    noPatientsResults.style.display = "none";
    
    list.forEach(patient => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${escapeHTML(patient.name)}</strong></td>
            <td>${escapeHTML(patient.id)}</td>
            <td>${escapeHTML(patient.facility)}</td>
            <td>${escapeHTML(patient.origin)}</td>
        `;
        patientsTableBody.appendChild(row);
    });
}

// Escape HTML helper to prevent XSS
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Filter Resources Action
function filterItems() {
    const searchString = currentSearch.toLowerCase().trim();
    
    const filtered = resources.filter(item => {
        const matchCategory = currentCategory === "all" || item.category === currentCategory;
        const matchSearch = !searchString || 
            item.title.toLowerCase().includes(searchString) ||
            item.desc.toLowerCase().includes(searchString) ||
            (item.location && item.location.toLowerCase().includes(searchString)) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchString));
            
        return matchCategory && matchSearch;
    });
    
    renderCards(filtered);
}

// Filter Patients Action
function filterPatients() {
    const searchString = currentPatientSearch.toLowerCase().trim();
    
    const filtered = PATIENTS.filter(patient => {
        return patient.name.toLowerCase().includes(searchString) ||
               patient.id.replace(/\./g, "").includes(searchString.replace(/\./g, "")) ||
               patient.origin.toLowerCase().includes(searchString);
    });
    
    renderPatients(filtered);
}

// Setup Event Handlers
function setupEventListeners() {
    // Top Main Navigation Tabs switching
    navTabs.forEach(tab => {
        tab.addEventListener("click", function() {
            const target = this.getAttribute("data-target");
            
            navTabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            
            viewContainers.forEach(container => {
                container.classList.remove("active");
                if (container.id === target) {
                    container.classList.add("active");
                }
            });
        });
    });

    // Lightbox Modal close handlers
    closeLightboxBtn.addEventListener("click", function() {
        lightboxModal.classList.remove("open");
        document.body.style.overflow = "";
    });
    
    lightboxModal.addEventListener("click", function(e) {
        if (e.target === lightboxModal || e.target.closest(".close-lightbox-btn")) {
            lightboxModal.classList.remove("open");
            document.body.style.overflow = "";
        }
    });

    // Search input typing (links view)
    searchInput.addEventListener("input", function(e) {
        currentSearch = e.target.value;
        if (currentSearch.length > 0) {
            clearSearchBtn.style.display = "flex";
        } else {
            clearSearchBtn.style.display = "none";
        }
        filterItems();
    });
    
    // Clear search (links view)
    clearSearchBtn.addEventListener("click", function() {
        searchInput.value = "";
        currentSearch = "";
        clearSearchBtn.style.display = "none";
        searchInput.focus();
        filterItems();
    });

    // Patient search input typing
    patientSearchInput.addEventListener("input", function(e) {
        currentPatientSearch = e.target.value;
        if (currentPatientSearch.length > 0) {
            clearPatientSearchBtn.style.display = "flex";
        } else {
            clearPatientSearchBtn.style.display = "none";
        }
        filterPatients();
    });

    // Clear patient search
    clearPatientSearchBtn.addEventListener("click", function() {
        patientSearchInput.value = "";
        currentPatientSearch = "";
        clearPatientSearchBtn.style.display = "none";
        patientSearchInput.focus();
        filterPatients();
    });
    
    // Category tabs clicking (links view)
    filterTabs.addEventListener("click", function(e) {
        const btn = e.target.closest(".tab-btn");
        if (!btn) return;
        
        document.querySelectorAll(".tab-btn").forEach(tab => tab.classList.remove("active"));
        btn.classList.add("active");
        
        currentCategory = btn.getAttribute("data-category");
        filterItems();
    });
    
    // Reset filters (links view)
    resetFiltersBtn.addEventListener("click", function() {
        searchInput.value = "";
        currentSearch = "";
        clearSearchBtn.style.display = "none";
        
        document.querySelectorAll(".tab-btn").forEach(tab => tab.classList.remove("active"));
        document.querySelector('[data-category="all"]').classList.add("active");
        currentCategory = "all";
        
        filterItems();
    });
    
    // Open suggest modal
    openModalBtn.addEventListener("click", function() {
        suggestModal.classList.add("open");
        document.body.style.overflow = "hidden";
    });
    
    // Close modal
    closeModalBtn.addEventListener("click", function() {
        suggestModal.classList.remove("open");
        document.body.style.overflow = "";
    });
    
    suggestModal.addEventListener("click", function(e) {
        if (e.target === suggestModal) {
            suggestModal.classList.remove("open");
            document.body.style.overflow = "";
        }
    });
    
    // Add Link Form Submission
    suggestForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        const title = document.getElementById("link-title").value.trim();
        const category = document.getElementById("link-category").value;
        const location = document.getElementById("link-location").value.trim() || "Nacional";
        const url = document.getElementById("link-url").value.trim();
        const desc = document.getElementById("link-desc").value.trim();
        const image = document.getElementById("link-image").value.trim();
        
        const tags = [location, CATEGORY_NAMES[category].split(" ")[0]];
        if (title.toLowerCase().includes("cruz")) tags.push("CruzRoja");
        if (title.toLowerCase().includes("oficial")) tags.push("Oficial");
        
        const newResource = {
            id: Date.now().toString(),
            title,
            category,
            desc,
            url,
            location,
            tags,
            image
        };
        
        const stored = localStorage.getItem("ve_earthquake_resources");
        let localList = [];
        if (stored) {
            try {
                localList = JSON.parse(stored);
            } catch (err) {
                localList = [];
            }
        }
        localList.unshift(newResource);
        localStorage.setItem("ve_earthquake_resources", JSON.stringify(localList));
        
        showToast("Enlace agregado con éxito");
        
        loadResources();
        filterItems();
        
        suggestModal.classList.remove("open");
        document.body.style.overflow = "";
        suggestForm.reset();
        
        console.log("Nuevo recurso JSON:");
        console.log(JSON.stringify(newResource, null, 4));
    });
}

// Document ready entry point
document.addEventListener("DOMContentLoaded", function() {
    loadResources();
    renderCards(resources);
    renderGallery();
    renderPatients(PATIENTS);
    setupEventListeners();
});
