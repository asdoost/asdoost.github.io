document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       GLOBAL ELEMENTS
       ========================================= */
    const htmlElement = document.documentElement;
    const themeSwitch = document.getElementById('theme');
    const sidebar = document.getElementById('offcanvasNavbar');
    const sidebarTogglerBtn = document.getElementById('sidebar-toggler');

    // Integrated feature selectors
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const filterBtns = document.querySelectorAll('[data-filter]');
    
    // Select both types of content
    const blogCards = document.querySelectorAll('.blog-card');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    const fadeElements = document.querySelectorAll('.fade-in');
    const pageBtns = document.querySelectorAll('.pagination .page-link');
    const lightbox = document.getElementById('lightbox');

    /* =========================================
       1. THEME TOGGLER
       ========================================= */
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-bs-theme', currentTheme);
    if (themeSwitch && currentTheme === 'dark') {
        themeSwitch.checked = true;
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('change', function () {
            const theme = this.checked ? 'dark' : 'light';
            htmlElement.setAttribute('data-bs-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }

    /* =========================================
       2. SIDEBAR ICON TOGGLER
       ========================================= */
    const sidebarIcon = sidebarTogglerBtn ? sidebarTogglerBtn.querySelector('.material-symbols-outlined') : null;

    if (sidebar && sidebarIcon) {
        sidebar.addEventListener('show.bs.offcanvas', () => {
            sidebarIcon.textContent = 'close';
        });
        sidebar.addEventListener('hide.bs.offcanvas', () => {
            sidebarIcon.textContent = 'menu';
        });
    }

    /* =========================================
       3. SEARCH FUNCTIONALITY (FIXED)
       ========================================= */
    function performSearch() {
        if (!searchInput) return;

        const query = searchInput.value.toLowerCase().trim();

        // 1. SEARCH FOR BLOG CARDS (If they exist)
        if (blogCards.length > 0) {
            blogCards.forEach(card => {
                const title = card.querySelector('.blog-card-title a')?.textContent.toLowerCase() || '';
                const excerpt = card.querySelector('.blog-card-excerpt')?.textContent.toLowerCase() || '';
                const category = card.dataset.category?.toLowerCase() || '';

                const matches = query === '' ||
                    title.includes(query) ||
                    excerpt.includes(query) ||
                    category.includes(query);

                card.classList.toggle('hidden', !matches);
            });
        }

        // 2. SEARCH FOR GALLERY ITEMS (If they exist)
        if (galleryItems.length > 0) {
            galleryItems.forEach(item => {
                // Look inside the overlay for text
                const title = item.querySelector('.gallery-overlay h4')?.textContent.toLowerCase() || '';
                const categoryText = item.querySelector('.gallery-overlay p')?.textContent.toLowerCase() || '';
                const dataCategory = item.dataset.category?.toLowerCase() || '';

                const matches = query === '' ||
                    title.includes(query) ||
                    categoryText.includes(query) ||
                    dataCategory.includes(query);

                item.classList.toggle('hidden', !matches);
            });
        }

        // Reset filter buttons to 'All' when searching
        if (filterBtns.length) {
            filterBtns.forEach(b => b.classList.remove('active'));
            // Assuming the first button is always "All"
            if (filterBtns[0]) filterBtns[0].classList.add('active');
        }
    }

    if (searchInput) {
        if (searchBtn) searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
        // Optional: Live search as you type
        searchInput.addEventListener('input', performSearch);
    }

    /* =========================================
       4. FILTER FUNCTIONALITY
       ========================================= */
    if (filterBtns.length) {
        // Determine if we are filtering blog cards or gallery items
        const filterableItems = blogCards.length ? blogCards : galleryItems;

        if (filterableItems.length) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // 1. Update active button class
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // 2. Get filter value
                    const filterValue = btn.dataset.filter.toLowerCase();

                    // 3. Loop through items
                    filterableItems.forEach((item, index) => {
                        const itemCategory = item.dataset.category ? item.dataset.category.toLowerCase() : '';
                        
                        const matches = filterValue === 'all' || filterValue === 'همه' || itemCategory === filterValue;
                        
                        item.classList.toggle('hidden', !matches);

                        // Reset animation for visible items
                        if (matches) {
                            item.style.animation = 'none';
                            item.offsetHeight; /* trigger reflow */
                            item.style.animation = null; 
                            item.style.animationDelay = `${index * 0.05}s`;
                        }
                    });
                    
                    // Clear search input when clicking a filter
                    if(searchInput) searchInput.value = '';
                });
            });
        }
    }

    /* =========================================
       5. SCROLL ANIMATION
       ========================================= */
    if (fadeElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        fadeElements.forEach(el => observer.observe(el));
    }

    /* =========================================
       6. PAGINATION SCROLL
       ========================================= */
    if (pageBtns.length) {
        pageBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (btn.querySelector('.material-symbols-outlined')) return;

                pageBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const targetSection = document.getElementById('blog') || document.getElementById('gallery');
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    /* =========================================
       7. LIGHTBOX FUNCTIONALITY
       ========================================= */
    if (lightbox && galleryItems.length) {
        const lightboxElements = {
            img: document.getElementById('lightbox-img'),
            title: document.getElementById('lightbox-title'),
            category: document.getElementById('lightbox-category'),
            counter: document.getElementById('lightbox-counter'),
            closeBtn: document.getElementById('lightbox-close'),
            prevBtn: document.getElementById('lightbox-prev'),
            nextBtn: document.getElementById('lightbox-next')
        };

        let currentIndex = 0;
        let visibleItems = [];

        // Helper to get only currently visible images (respects search & filters)
        const updateVisibleItems = () => {
            visibleItems = Array.from(galleryItems).filter(
                item => !item.classList.contains('hidden') && getComputedStyle(item).display !== 'none'
            );
        };

        const updateLightboxContent = () => {
            if (visibleItems.length === 0) return;
            
            const item = visibleItems[currentIndex];
            const img = item.querySelector('img');
            const titleEl = item.querySelector('.gallery-overlay h4');
            const categoryEl = item.querySelector('.gallery-overlay p');

            if (lightboxElements.img && img) {
                // Directly use the src (removed the specific 'w=800' replace logic as your paths are local)
                lightboxElements.img.src = img.src;
                lightboxElements.img.alt = img.alt;
            }
            
            if (lightboxElements.title) {
                lightboxElements.title.textContent = titleEl ? titleEl.textContent : '';
            }
            
            if (lightboxElements.category) {
                lightboxElements.category.textContent = categoryEl ? categoryEl.textContent : '';
            }
            
            if (lightboxElements.counter) {
                lightboxElements.counter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
            }
        };

        const openLightbox = (targetItem) => {
            updateVisibleItems();
            currentIndex = visibleItems.indexOf(targetItem);
            
            // If item is not found in visible list (e.g. somehow hidden), don't open
            if (currentIndex === -1) return;

            updateLightboxContent();
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        };

        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
            // Clear src to stop video/loading (optional)
            if(lightboxElements.img) setTimeout(() => lightboxElements.img.src = '', 200);
        };

        const navigate = (direction) => {
            if (visibleItems.length === 0) return;
            // RTL Logic Check: 
            // In Persian (RTL), 'Next' button logically means the next item in the array,
            // even if the arrow points left. The logic here is correct for Array Index.
            currentIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length;
            updateLightboxContent();
        };

        // Event Listeners for Items
        galleryItems.forEach(item => {
            // Click on the whole item, or specific button
            item.addEventListener('click', (e) => {
                // Optional: prevent opening if clicking specifically on a link inside (if you had one)
                openLightbox(item);
            });
        });

        // Event Listeners for Controls
        lightboxElements.closeBtn?.addEventListener('click', closeLightbox);
        lightboxElements.prevBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            navigate(-1);
        });
        lightboxElements.nextBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            navigate(1);
        });

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Keyboard Navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            
            switch (e.key) {
                case 'Escape': 
                    closeLightbox(); 
                    break;
                case 'ArrowLeft': 
                    navigate(-1); 
                    break;
                case 'ArrowRight': 
                    navigate(1); 
                    break;
            }
        });
    }
});