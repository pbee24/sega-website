/* --- Project Tabs --- */
function initProjectTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to current button and content
            btn.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

/* --- Project Image Gallery Switcher --- */
function switchProjectImage(mainImgId, thumbnailElement) {
    const mainImg = document.getElementById(mainImgId);
    if (!mainImg) return;

    // Change main image source
    mainImg.src = thumbnailElement.src;
    mainImg.alt = thumbnailElement.alt;

    // Update active thumbnail styling
    const thumbnailsContainer = thumbnailElement.parentElement;
    const thumbnails = thumbnailsContainer.querySelectorAll('.thumb');
    thumbnails.forEach(t => t.classList.remove('active'));
    thumbnailElement.classList.add('active');
}

/* --- Lightbox Gallery --- */
function initLightbox() {
    const galleryCards = document.querySelectorAll('.gallery-photo-card');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('lightboxClose');

    if (!lightbox || !lightboxImg) return;

    galleryCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });

    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });
}
