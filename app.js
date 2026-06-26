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
const OFFICIAL_RESOURCES = [];

// ──────────────────────────────────────────────────────────────
// 2. STATIC FLYER GALLERY
// ──────────────────────────────────────────────────────────────
const STATIC_GALLERY = [];




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
            ? `<button class="resource-delete-btn" data-id="${item.id}" title="Eliminar enlace">
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

        // Handle delete button click in card event listener
        card.addEventListener("click", (e) => {
            const deleteBtn = e.target.closest(".resource-delete-btn");
            if (deleteBtn) {
                deleteResourceItem(item.id, e);
            }
        });

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
            ? `<button class="gallery-delete-btn" data-id="${item.id}" title="Eliminar imagen">
                   <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
               </button>`
            : "";

        // Action buttons row
        const visitBtnHTML = item.url
            ? `<a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer" class="gallery-visit-btn">
                   <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                   Visitar enlace
               </a>`
            : "";

        const editBtnHTML = isUserItem
            ? `<button class="gallery-edit-btn">
                   <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                   Editar
               </button>`
            : "";

        const actionsRowHTML = (visitBtnHTML || editBtnHTML)
            ? `<div class="gallery-card-actions">${editBtnHTML}${visitBtnHTML}</div>`
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
                ${actionsRowHTML}
            </div>`;

        card.addEventListener("click", (e) => {
            const deleteBtnEl = e.target.closest(".gallery-delete-btn");
            const editBtnEl = e.target.closest(".gallery-edit-btn");
            const visitBtnEl = e.target.closest(".gallery-visit-btn");
            if (deleteBtnEl) {
                deleteGalleryItem(item.id, e);
                return;
            }
            if (editBtnEl) {
                openGalleryEditModal(item, e);
                return;
            }
            if (visitBtnEl) {
                e.stopPropagation();
                return;
            }
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
        if (document.getElementById("gallery-edit-modal")?.classList.contains("open")) {
            closeGalleryEditModal();
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
            submitBtn.disabled = true;
            submitBtn.querySelector("span").textContent = "Guardando...";
            const linkUrl = (document.getElementById("gallery-link-url")?.value || "").trim();
            const galleryItem = {
                title,
                desc: "",
                image: directUrl,
                url: linkUrl,
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

            const linkUrl = (document.getElementById("gallery-link-url")?.value || "").trim();
            const galleryItem = {
                title,
                desc: "",
                image: imageUrl,
                url: linkUrl,
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

    // ── Gallery Edit Modal ──
    const galleryEditModal = document.getElementById("gallery-edit-modal");

    function closeGalleryEditModal() {
        galleryEditModal.classList.remove("open");
        document.body.style.overflow = "";
    }

    // Exposed globally so it can be called from inline onclick in renderGallery
    window.openGalleryEditModal = function(item, e) {
        if (e) e.stopPropagation();
        document.getElementById("edit-gallery-id").value    = item.id;
        document.getElementById("edit-gallery-title").value = item.title || "";
        document.getElementById("edit-gallery-desc").value  = item.desc  || "";
        document.getElementById("edit-gallery-link").value  = item.url   || "";
        galleryEditModal.classList.add("open");
        document.body.style.overflow = "hidden";
    };

    document.getElementById("close-gallery-edit-modal")?.addEventListener("click", closeGalleryEditModal);
    document.getElementById("cancel-gallery-edit")?.addEventListener("click", closeGalleryEditModal);
    galleryEditModal?.addEventListener("click", function(e) {
        if (e.target === this) closeGalleryEditModal();
    });

    document.getElementById("save-gallery-edit")?.addEventListener("click", async function() {
        const id    = document.getElementById("edit-gallery-id").value;
        const title = document.getElementById("edit-gallery-title").value.trim();
        const desc  = document.getElementById("edit-gallery-desc").value.trim();
        const url   = document.getElementById("edit-gallery-link").value.trim();

        if (!id)    { showToast("Error: ID de publicación no encontrado", "error"); return; }

        this.disabled = true;
        this.textContent = "Guardando...";

        try {
            await db.ref("gallery/" + id).update({ title, desc, url });
            showToast("Publicación actualizada correctamente");
            closeGalleryEditModal();
        } catch(err) {
            showToast("Error al guardar: " + err.message, "error");
        } finally {
            this.disabled = false;
            this.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Guardar cambios`;
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
