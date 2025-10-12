// Product search logic
function searchProducts(query) {
    query = query.trim().toLowerCase();
    if (!query) {
        renderGallery(currentCategory);
        return;
    }
    const filtered = products[currentCategory].filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.details.toLowerCase().includes(query)
    );
    gallery.innerHTML = '';
    filtered.forEach((product, i) => {
        const card = document.createElement('div');
        card.className = `product-card scroll-reveal delay-${(i % 4) + 1}`;
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <button class="view-btn" data-id="${product.id}" data-category="${currentCategory}">View Details</button>
        `;
        gallery.appendChild(card);
    });
    revealOnScroll();
    return filtered;
}

// Search suggestion functionality
function showSearchSuggestions(query, inputId, suggestionsId) {
    const input = document.getElementById(inputId);
    const suggestionsContainer = document.getElementById(suggestionsId);
    
    query = query.trim().toLowerCase();
    if (!query) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.remove('active');
        return;
    }
    
    // Search all categories for suggestions
    let allSuggestions = [];
    for (const category in products) {
        const matches = products[category].filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.details.toLowerCase().includes(query)
        );
        
        matches.forEach(product => {
            allSuggestions.push({
                ...product,
                category: category
            });
        });
    }
    
    // Limit suggestions to top 5
    allSuggestions = allSuggestions.slice(0, 5);
    
    if (allSuggestions.length > 0) {
        suggestionsContainer.innerHTML = '';
        allSuggestions.forEach(product => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.dataset.id = product.id;
            item.dataset.category = product.category;
            
            // Highlight the matching part of the name
            const regex = new RegExp(`(${query})`, 'gi');
            const highlightedName = product.name.replace(regex, '<span style="color:#ff9800;font-weight:bold;">$1</span>');
            
            item.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="suggestion-text">
                    <h4>${highlightedName}</h4>
                    <p>${product.description}</p>
                </div>
            `;
            
            item.addEventListener('click', function() {
                // Change to the product's category if needed
                if (product.category !== currentCategory) {
                    tabs.forEach(tab => {
                        if (tab.getAttribute('data-category') === product.category) {
                            tab.click();
                        }
                    });
                }
                
                // Show the product modal
                const targetProduct = products[product.category].find(p => p.id === product.id);
                if (targetProduct) showModal(targetProduct, product.category);
                
                // Clear the search input and hide suggestions
                input.value = '';
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.classList.remove('active');
            });
            
            suggestionsContainer.appendChild(item);
        });
        
        suggestionsContainer.classList.add('active');
    } else {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.remove('active');
    }
}

// Search input event listeners
const navSearchInput = document.getElementById('nav-search-input');
navSearchInput.addEventListener('input', function(e) {
    const query = e.target.value;
    searchProducts(query);
    showSearchSuggestions(query, 'nav-search-input', 'nav-search-suggestions');
});

const mobileSearchInput = document.getElementById('mobile-search-input');
mobileSearchInput.addEventListener('input', function(e) {
    const query = e.target.value;
    searchProducts(query);
    showSearchSuggestions(query, 'mobile-search-input', 'mobile-search-suggestions');
});

// Hide suggestions when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-search')) {
        document.querySelectorAll('.search-suggestions').forEach(el => {
            el.classList.remove('active');
            setTimeout(() => { el.innerHTML = ''; }, 300);
        });
    }
});
// Review card slideshow logic
const reviews = [
    {
        text: 'Great selection and friendly staff! Highly recommend TryTruckNTrailer.',
        reviewer: 'Alex P.',
        rating: 5
    },
    {
        text: 'Smooth buying process and excellent after-sales support.',
        reviewer: 'Jamie L.',
        rating: 4
    },
    {
        text: 'Found the perfect trailer for my business. Thank you!',
        reviewer: 'Morgan S.',
        rating: 5
    }
];
let reviewIndex = 0;
const reviewCardsContainer = document.querySelector('.review-slideshow-cards');
const reviewDotsContainer = document.querySelector('.review-slideshow-dots');
function renderReviewSlideshow() {
    reviewCardsContainer.innerHTML = '';
    reviews.forEach((review, i) => {
        const card = document.createElement('div');
        card.className = 'review-card' + (i === reviewIndex ? ' active' : '');
        // Star ratings
        let stars = '';
        for (let s = 1; s <= 5; s++) {
            stars += `<i class="fa${s <= review.rating ? 's' : 'r'} fa-star"></i>`;
        }
        card.innerHTML = `
            <div class="stars">${stars}</div>
            <p>"${review.text}"</p>
            <div class="reviewer">- ${review.reviewer}</div>
        `;
        reviewCardsContainer.appendChild(card);
    });
    // Dots
    reviewDotsContainer.innerHTML = '';
    reviews.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'review-slideshow-dot' + (i === reviewIndex ? ' active' : '');
        dot.onclick = () => { reviewIndex = i; renderReviewSlideshow(); };
        reviewDotsContainer.appendChild(dot);
    });
}
function nextReview() {
    reviewIndex = (reviewIndex + 1) % reviews.length;
    renderReviewSlideshow();
}
function prevReview() {
    reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length;
    renderReviewSlideshow();
}
document.querySelector('.review-slideshow-btn.next').onclick = nextReview;
document.querySelector('.review-slideshow-btn.prev').onclick = prevReview;
renderReviewSlideshow();
let reviewSlideshowTimer = setInterval(nextReview, 5000);
reviewCardsContainer.addEventListener('mouseenter', () => clearInterval(reviewSlideshowTimer));
reviewCardsContainer.addEventListener('mouseleave', () => reviewSlideshowTimer = setInterval(nextReview, 5000));
// Enhanced Inventory Section Logic
const inventoryData = [
    {
        id: 'inv1',
        name: 'Freightliner Cascadia',
        image: 'image/truck1.jpg',
        description: '2022 Freightliner Cascadia with modern features and excellent condition.',
        details: 'Full service history, warranty included, ready for long hauls.',
        price: 'R985,500',
        year: 2022,
        category: 'truck',
        featured: true,
        specs: {
            engine: '450 HP Detroit Diesel',
            transmission: 'Automatic',
            mileage: '120,000 miles',
            axles: 'Tandem rear axles',
            sleeper: 'Large sleeper cab'
        }
    },
    {
        id: 'inv2',
        name: 'Kenworth T680',
        image: 'image/truck2.jpg',
        description: '2021 Kenworth T680, excellent fuel economy and driver comfort.',
        details: 'Fuel efficient, comfortable sleeper cab, financing available.',
        price: 'R478,900',
        year: 2021,
        category: 'truck',
        featured: false,
        specs: {
            engine: '400 HP Cummins',
            transmission: 'Manual 10-speed',
            mileage: '98,000 miles',
            axles: 'Tandem rear axles',
            sleeper: 'Premium sleeper package'
        }
    },
    {
        id: 'inv3',
        name: 'Volvo VNL 760',
        image: 'image/truck3.jpg',
        description: '2020 Volvo VNL 760 with advanced safety features and spacious interior.',
        details: 'Advanced safety features, spacious interior, one owner.',
        price: 'R172,500',
        year: 2020,
        category: 'truck',
        featured: false,
        specs: {
            engine: '425 HP Volvo D13',
            transmission: 'I-Shift Automated',
            mileage: '150,000 miles',
            axles: 'Tandem rear axles',
            sleeper: 'XL sleeper with amenities'
        }
    },
    {
        id: 'inv4',
        name: 'Premium Heavy Duty Truck',
        image: 'image/truck4.jpg',
        description: '2023 Premium Heavy Duty Truck with latest technology and comfort features.',
        details: 'Best-in-class fuel economy, extended warranty, financing options available.',
        price: 'R295,000',
        year: 2023,
        category: 'truck',
        featured: false,
        specs: {
            engine: '500 HP High-Torque',
            transmission: 'Automatic with Economy Mode',
            mileage: '45,000 miles',
            axles: 'Heavy duty axles',
            sleeper: 'Luxury sleeper package'
        }
    },
    {
        id: 'inv5',
        name: 'Utility 53ft Dry Van',
        image: 'image/trailer1.jpg',
        description: '2022 Utility 53ft Dry Van with swing doors and aluminum roof.',
        details: 'Lightweight, durable, DOT inspected, ready for work.',
        price: 'R132,900',
        year: 2022,
        category: 'trailer',
        featured: false,
        specs: {
            length: '53 feet',
            doors: 'Swing doors',
            roof: 'Aluminum',
            floor: 'Hardwood',
            height: 'Standard 13\'6"'
        }
    },
    {
        id: 'inv6',
        name: 'Fontaine Flatbed',
        image: 'image/trailer2.jpg',
        description: '2021 Fontaine Flatbed with 48ft steel frame, perfect for versatile loads.',
        details: 'Versatile, easy loading, excellent condition.',
        price: 'R228,500',
        year: 2021,
        category: 'trailer',
        featured: false,
        specs: {
            length: '48 feet',
            deck: 'Steel',
            capacity: '48,000 lbs',
            axles: 'Tandem',
            features: 'Winch track and straps included'
        }
    },
    {
        id: 'inv7',
        name: 'Great Dane Reefer',
        image: 'image/trailer3.jpg',
        description: '2020 Great Dane Reefer with Thermo King unit, ideal for temperature-sensitive cargo.',
        details: 'Temperature controlled, low hours, perfect for perishables.',
        price: 'R345,000',
        year: 2020,
        category: 'trailer',
        featured: false,
        specs: {
            length: '53 feet',
            refrigeration: 'Thermo King',
            doors: 'Swing doors with seals',
            insulation: 'Premium insulation',
            features: 'Multi-temp zones'
        }
    },
    {
        id: 'inv8',
        name: 'Premium Heavy Duty Trailer',
        image: 'image/trailer4.jpg',
        description: '2023 Premium Heavy Duty Trailer with robust build and advanced features.',
        details: 'Heavy-duty construction, advanced features, financing available.',
        price: 'R238,700',
        year: 2023,
        category: 'trailer',
        featured: true,
        specs: {
            length: '48 feet',
            construction: 'Heavy-duty steel',
            capacity: '55,000 lbs',
            features: 'Air ride suspension',
            warranty: '2-year comprehensive'
        }
    }
];

// Variables for inventory pagination
let currentFilter = 'all';
let currentSort = 'newest';
let itemsPerPage = 4;
let currentPage = 1;

// Function to render inventory grid
function renderInventoryGrid() {
    const inventoryGrid = document.getElementById('inventory-grid');
    const mobileSwiper = document.getElementById('mobile-inventory-swiper');
    const filteredItems = filterInventoryItems();
    const paginatedItems = paginateItems(filteredItems);
    
    // Clear existing content
    inventoryGrid.innerHTML = '';
    mobileSwiper.innerHTML = '';
    
    // Create pagination bullets for mobile
    const paginationContainer = document.getElementById('mobile-swiper-pagination');
    paginationContainer.innerHTML = '';
    
    // Render items for desktop grid
    paginatedItems.forEach(item => {
        const card = createInventoryCard(item);
        inventoryGrid.appendChild(card);
    });
    
    // Render all filtered items for mobile swiper
    filteredItems.forEach((item, index) => {
        // Create mobile swiper slide
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = createInventoryCardHTML(item);
        mobileSwiper.appendChild(slide);
        
        // Create pagination bullet
        const bullet = document.createElement('span');
        bullet.className = 'swiper-pagination-bullet' + (index === 0 ? ' swiper-pagination-bullet-active' : '');
        bullet.setAttribute('data-index', index);
        bullet.addEventListener('click', () => {
            // Scroll to this slide
            const slideWidth = slide.offsetWidth;
            mobileSwiper.scrollTo({
                left: slideWidth * index,
                behavior: 'smooth'
            });
            
            // Update active bullet
            document.querySelectorAll('.swiper-pagination-bullet').forEach(b => {
                b.classList.remove('swiper-pagination-bullet-active');
            });
            bullet.classList.add('swiper-pagination-bullet-active');
        });
        paginationContainer.appendChild(bullet);
    });
    
    // Update load more button visibility
    updateLoadMoreButton(filteredItems.length > itemsPerPage * currentPage);
    
    // Render featured vehicle
    renderFeaturedVehicle();
    
    // Initialize scroll detection for mobile swiper
    initializeMobileSwiper();
}

// Create HTML for inventory card
function createInventoryCardHTML(item) {
    // Extract year from description if available
    const year = item.year || '';
    
    return `
        <div class="inventory-card" data-id="${item.id}">
            <span class="card-label">${item.category === 'truck' ? 'Truck' : 'Trailer'}</span>
            <div class="card-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="card-content">
                <h3 class="card-title">${item.name}</h3>
                <div class="card-info-list">
                    <span class="card-info-item"><i class="fa fa-calendar"></i> ${year}</span>
                    ${item.specs && item.specs.engine ? 
                        `<span class="card-info-item"><i class="fa fa-engine"></i> ${item.specs.engine.split(' ')[0]} HP</span>` : ''}
                    ${item.specs && item.specs.mileage ? 
                        `<span class="card-info-item"><i class="fa fa-tachometer-alt"></i> ${item.specs.mileage.split(' ')[0]}k</span>` : ''}
                    ${item.specs && item.specs.length ? 
                        `<span class="card-info-item"><i class="fa fa-ruler-horizontal"></i> ${item.specs.length}</span>` : ''}
                </div>
                <p class="card-description">${item.description}</p>
                <div class="card-meta">
                    <div class="card-price">${item.price}</div>
                    <button class="card-action view-inventory-btn" data-id="${item.id}">
                        Details <i class="fa fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Render inventory card DOM element
function createInventoryCard(item) {
    const card = document.createElement('div');
    
    // Add animation classes with staggered delays based on position
    const index = inventoryData.indexOf(item);
    const delay = (index % 5) + 1;
    
    // Use different animation styles for variety
    const animStyles = ['fade-in', 'slide-left', 'slide-right', 'zoom-in'];
    const animStyle = animStyles[index % animStyles.length];
    
    card.className = `inventory-card scroll-reveal ${animStyle} delay-${delay}`;
    card.innerHTML = createInventoryCardHTML(item);
    
    // Add click event to view details button
    card.querySelector('.view-inventory-btn').addEventListener('click', () => {
        showInventoryDetails(item);
    });
    
    return card;
}

// Filter inventory items based on current filter
function filterInventoryItems() {
    let filtered = [...inventoryData];
    
    // Apply category filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(item => item.category === currentFilter);
    }
    
    // Apply sorting
    switch(currentSort) {
        case 'newest':
            filtered.sort((a, b) => b.year - a.year);
            break;
        case 'oldest':
            filtered.sort((a, b) => a.year - b.year);
            break;
        case 'name-asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }
    
    return filtered;
}

// Paginate items for the current page
function paginateItems(items) {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    return items.slice(startIndex, endIndex);
}

// Update load more button visibility
function updateLoadMoreButton(hasMore) {
    const loadMoreBtn = document.getElementById('load-more');
    if (hasMore) {
        loadMoreBtn.style.display = 'flex';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

// Render the featured vehicle section
function renderFeaturedVehicle() {
    const featuredContainer = document.getElementById('featured-vehicle');
    const featuredItem = inventoryData.find(item => item.featured) || inventoryData[0];
    
    featuredContainer.innerHTML = `
        <div class="featured-image">
            <img src="${featuredItem.image}" alt="${featuredItem.name}">
        </div>
        <div class="featured-content">
            <h3 class="featured-title">${featuredItem.name}</h3>
            <p class="featured-description">${featuredItem.description}</p>
            <div class="featured-specs">
                ${featuredItem.year ? `<div class="featured-spec-item">
                    <i class="fa fa-calendar"></i>
                    <span>Year: ${featuredItem.year}</span>
                </div>` : ''}
                ${featuredItem.specs ? Object.entries(featuredItem.specs).map(([key, value]) => `
                    <div class="featured-spec-item">
                        <i class="fa fa-check-circle"></i>
                        <span>${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}</span>
                    </div>
                `).join('') : ''}
            </div>
            <div class="featured-price">${featuredItem.price}</div>
            <div class="featured-actions">
                <button class="featured-btn primary" data-id="${featuredItem.id}">
                    <i class="fa fa-info-circle"></i> View Details
                </button>
                <button class="featured-btn secondary" data-id="${featuredItem.id}">
                    <i class="fa fa-paper-plane"></i> Inquire
                </button>
            </div>
        </div>
    `;
    
    // Add click handlers to featured buttons
    featuredContainer.querySelector('.featured-btn.primary').addEventListener('click', () => {
        showInventoryDetails(featuredItem);
    });
    
    featuredContainer.querySelector('.featured-btn.secondary').addEventListener('click', () => {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
}

// Show inventory item details (using the existing modal)
function showInventoryDetails(item) {
    // Create a formatted product object compatible with the existing showModal function
    const formattedProduct = {
        id: item.id,
        name: item.name,
        image: item.image,
        description: `${item.year} ${item.name}, ${item.specs ? (item.specs.engine || '') : ''}, ${item.specs ? (item.specs.transmission || '') : ''}, ${item.specs ? (item.specs.mileage || '') : ''}.`,
        details: item.details
    };
    
    // Use the existing modal function
    showModal(formattedProduct, item.category === 'truck' ? 'trucks' : 'trailers');
}

// Initialize mobile swiper scroll detection
function initializeMobileSwiper() {
    const swiper = document.getElementById('mobile-inventory-swiper');
    
    // Update pagination on scroll
    swiper.addEventListener('scroll', () => {
        const slideWidth = swiper.querySelector('.swiper-slide')?.offsetWidth || 0;
        if (slideWidth === 0) return;
        
        const currentIndex = Math.round(swiper.scrollLeft / slideWidth);
        
        document.querySelectorAll('.swiper-pagination-bullet').forEach((bullet, index) => {
            if (index === currentIndex) {
                bullet.classList.add('swiper-pagination-bullet-active');
            } else {
                bullet.classList.remove('swiper-pagination-bullet-active');
            }
        });
    });
}

// Initialize event listeners for inventory section
function initInventoryEvents() {
    // Filter button click events
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Set current filter
            currentFilter = btn.getAttribute('data-filter');
            currentPage = 1; // Reset to first page
            renderInventoryGrid();
        });
    });
    
    // Sort select change event
    const sortSelect = document.getElementById('inventory-sort');
    sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        renderInventoryGrid();
    });
    
    // Load more button click
    const loadMoreBtn = document.getElementById('load-more');
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderInventoryGrid();
    });
}

// Apply scroll reveal to inventory items after they're loaded
function applyScrollRevealToInventory() {
    const inventoryItems = document.querySelectorAll('.inventory-card');
    inventoryItems.forEach((item, i) => {
        // Add delay to stagger the animations
        setTimeout(() => {
            item.classList.add('visible');
        }, 150 * (i % 5));
    });
}

// Initialize inventory section on page load
document.addEventListener('DOMContentLoaded', () => {
    initInventoryEvents();
    renderInventoryGrid();
    
    // Apply scroll reveal after a short delay to ensure DOM is ready
    setTimeout(applyScrollRevealToInventory, 500);
});
// Modern FAQ logic with categories and search
document.addEventListener('DOMContentLoaded', function() {
    // FAQ category filtering
    const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqCategoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            faqCategoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Show/hide FAQ items based on category
            faqItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    // Add animation for items that become visible
                    item.classList.add('scroll-reveal', 'fade-in');
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 100);
                } else {
                    item.style.display = 'none';
                    item.classList.remove('visible');
                }
            });
        });
    });
    
    // FAQ accordion functionality
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.faq-item');
            
            // Toggle this item
            item.classList.toggle('active');
            
            // Close other items
            document.querySelectorAll('.faq-item').forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            
            // Scroll into view if needed (for mobile)
            if (item.classList.contains('active') && window.innerWidth < 768) {
                setTimeout(() => {
                    const offset = item.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({
                        top: offset,
                        behavior: 'smooth'
                    });
                }, 400);
            }
        });
    });
    
    // FAQ search functionality could be added here
    // This would involve filtering FAQ items based on user input
});
// Toggle menu logic
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
menuToggle.addEventListener('click', function() {
    mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('open');
});
// Animate hamburger icon
menuToggle.addEventListener('click', function() {
    if (menuToggle.classList.contains('open')) {
        menuToggle.querySelectorAll('.bar')[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        menuToggle.querySelectorAll('.bar')[1].style.opacity = '0';
        menuToggle.querySelectorAll('.bar')[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
    } else {
        menuToggle.querySelectorAll('.bar')[0].style.transform = '';
        menuToggle.querySelectorAll('.bar')[1].style.opacity = '1';
        menuToggle.querySelectorAll('.bar')[2].style.transform = '';
    }
});
// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.querySelectorAll('.bar')[0].style.transform = '';
        menuToggle.querySelectorAll('.bar')[1].style.opacity = '1';
        menuToggle.querySelectorAll('.bar')[2].style.transform = '';
    });
});
// Demo data for trucks and trailers
const products = {
    trucks: [
        {
            id: 't1',
            name: 'Freightliner Cascadia',
            image: 'image/truck1.jpg',
            description: '2022 Freightliner Cascadia, 450HP, Automatic, 120,000 miles.',
            details: 'Full service history, warranty included, ready for long hauls.'
        },
        {
            id: 't2',
            name: 'Kenworth T680',
            image: 'image/truck2.jpg',
            description: '2021 Kenworth T680, 400HP, Manual, 98,000 miles.',
            details: 'Fuel efficient, comfortable sleeper cab, financing available.'
        },
        {
            id: 't3',
            name: 'Volvo VNL 760',
            image: 'image/truck3.jpg',
            description: '2020 Volvo VNL 760, 425HP, Automatic, 150,000 miles.',
            details: 'Advanced safety features, spacious interior, one owner.'
        }
    ],
    trailers: [
        {
            id: 'tr1',
            name: 'Utility 53ft Dry Van',
            image: 'image/trailer1.jpg',
            description: '2022 Utility 53ft Dry Van, swing doors, aluminum roof.',
            details: 'Lightweight, durable, DOT inspected, ready for work.'
        },
        {
            id: 'tr2',
            name: 'Fontaine Flatbed',
            image: 'image/trailer2.jpg',
            description: '2021 Fontaine Flatbed, 48ft, steel frame.',
            details: 'Versatile, easy loading, excellent condition.'
        },
        {
            id: 'tr3',
            name: 'Great Dane Reefer',
            image: 'image/trailer3.jpg',
            description: '2020 Great Dane Reefer, 53ft, Thermo King unit.',
            details: 'Temperature controlled, low hours, perfect for perishables.'
        }
    ]
};

const gallery = document.getElementById('product-gallery');
const tabs = document.querySelectorAll('.tab-btn');
const modal = document.getElementById('product-modal');
const modalDetails = document.getElementById('modal-product-details');
const moreLikeThis = document.getElementById('more-like-this');
const closeBtn = document.querySelector('.close-btn');

let currentCategory = 'trucks';

function renderGallery(category) {
    gallery.innerHTML = '';
    
    // Animation styles to cycle through for product cards
    const animationStyles = ['fade-in', 'slide-left', 'slide-right', 'zoom-in', 'rotate-in'];
    
    products[category].forEach((product, i) => {
        const card = document.createElement('div');
        const animStyle = animationStyles[i % animationStyles.length];
        card.className = `product-card scroll-reveal ${animStyle} delay-${(i % 5) + 1}`;
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <button class="view-btn" data-id="${product.id}" data-category="${category}">View Details</button>
        `;
        gallery.appendChild(card);
    });
    
    // Run the reveal check after populating gallery
    setTimeout(revealOnScroll, 100);
}

function showModal(product, category) {
    // Parse description into logical fields
    let descFields = [];
    if (category === 'trucks') {
        // Example: '2022 Freightliner Cascadia, 450HP, Automatic, 120,000 miles.'
        const descParts = product.description.split(',');
        if (descParts.length >= 4) {
            descFields.push(`<strong>Model:</strong> ${product.name}`);
            descFields.push(`<strong>Year:</strong> ${descParts[0].match(/\d{4}/) ? descParts[0].match(/\d{4}/)[0] : descParts[0]}`);
            descFields.push(`<strong>Engine:</strong> ${descParts[1].trim()}`);
            descFields.push(`<strong>Transmission:</strong> ${descParts[2].trim()}`);
            descFields.push(`<strong>Mileage:</strong> ${descParts[3].trim()}`);
        } else {
            descFields.push(product.description);
        }
    } else if (category === 'trailers') {
        // Example: '2022 Utility 53ft Dry Van, swing doors, aluminum roof.'
        const descParts = product.description.split(',');
        if (descParts.length >= 3) {
            descFields.push(`<strong>Model:</strong> ${product.name}`);
            descFields.push(`<strong>Year:</strong> ${descParts[0].match(/\d{4}/) ? descParts[0].match(/\d{4}/)[0] : descParts[0]}`);
            descFields.push(`<strong>Type:</strong> ${descParts[0].replace(/\d{4}/, '').trim()}`);
            descFields.push(`<strong>Doors:</strong> ${descParts[1].trim()}`);
            descFields.push(`<strong>Roof:</strong> ${descParts[2].trim()}`);
        } else {
            descFields.push(product.description);
        }
    } else {
        descFields.push(product.description);
    }

    modalDetails.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <div class="modal-desc-fields">
            ${descFields.map(f => `<p>${f}</p>`).join('')}
        </div>
        <p><strong>Details:</strong> ${product.details}</p>
        <button class="get-quote-btn"><i class="fa fa-paper-plane"></i> Get Quote</button>
    `;
    // More like this
    const more = products[category].filter(p => p.id !== product.id);
    if (more.length) {
        moreLikeThis.innerHTML = '<h4>More Like This</h4><div class="more-like-list"></div>';
        const list = moreLikeThis.querySelector('.more-like-list');
        more.forEach((p, i) => {
            const card = document.createElement('div');
            card.className = `more-like-card scroll-reveal delay-${(i % 4) + 1}`;
            card.innerHTML = `<img src="${p.image}" alt="${p.name}" style="width:100px;height:60px;border-radius:6px;"><div>${p.name}</div>`;
            card.onclick = () => showModal(p, category);
            list.appendChild(card);
        });
    } else {
        moreLikeThis.innerHTML = '';
    }
    modal.classList.remove('hidden');
    setTimeout(revealOnScroll, 100); // Animate modal items
}
// Hero Slider and Collection Functionality
document.addEventListener('DOMContentLoaded', function() {
    initHeroSlider();
    initCollectionFilters();
});

// Hero Slider Functionality
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.querySelector('.hero-arrow.prev');
    const nextBtn = document.querySelector('.hero-arrow.next');
    
    if(!slides.length) return;
    
    let currentSlide = 0;
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Initialize the first slide
    slides[0].classList.add('active');
    dots[0].classList.add('active');
    
    // Next slide function
    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }
    
    // Previous slide function
    function prevSlide() {
        goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
    }
    
    // Go to specific slide
    function goToSlide(n) {
        // Remove active class from current slide and dot
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        // Set new current slide
        currentSlide = n;
        
        // Add active class to new slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        // Reset the interval timer
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Event listeners
    if(prevBtn) prevBtn.addEventListener('click', function() {
        prevSlide();
    });
    
    if(nextBtn) nextBtn.addEventListener('click', function() {
        nextSlide();
    });
    
    // Add click events to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            goToSlide(index);
        });
    });
}

// Collection Filters Functionality
function initCollectionFilters() {
    const categoryButtons = document.querySelectorAll('.category-tabs .tab-btn');
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input');
    const sortSelect = document.querySelector('.sorting-options select');
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-btn');
    
    // Collection items
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Update result count
    function updateResultCount() {
        const visibleItems = document.querySelectorAll('.gallery-item:not([style*="display: none"])');
        const resultsInfo = document.querySelector('.results-info');
        
        if (resultsInfo) {
            resultsInfo.textContent = `${visibleItems.length} vehicles found`;
        }
    }
    
    // Filter by category
    if (categoryButtons) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    if (category === 'all') {
                        item.style.display = 'flex';
                    } else {
                        if (item.getAttribute('data-category') === category) {
                            item.style.display = 'flex';
                        } else {
                            item.style.display = 'none';
                        }
                    }
                });
                
                updateResultCount();
            });
        });
    }
    
    // Filter by checkbox filters
    if (filterCheckboxes) {
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                filterItems();
            });
        });
    }
    
    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const itemsArray = Array.from(galleryItems);
            
            itemsArray.sort((a, b) => {
                if (sortValue === 'price-asc') {
                    return getPriceValue(a) - getPriceValue(b);
                } else if (sortValue === 'price-desc') {
                    return getPriceValue(b) - getPriceValue(a);
                } else if (sortValue === 'name-asc') {
                    return getNameValue(a).localeCompare(getNameValue(b));
                } else if (sortValue === 'name-desc') {
                    return getNameValue(b).localeCompare(getNameValue(a));
                }
                return 0;
            });
            
            // Re-append items in new order
            const galleryGrid = document.querySelector('.gallery-grid');
            if (galleryGrid) {
                itemsArray.forEach(item => {
                    galleryGrid.appendChild(item);
                });
            }
        });
    }
    
    // Helper function to get price value for sorting
    function getPriceValue(item) {
        const priceElement = item.querySelector('.gallery-item-price');
        if (priceElement) {
            const price = priceElement.textContent.replace(/[^\d.]/g, '');
            return parseFloat(price) || 0;
        }
        return 0;
    }
    
    // Helper function to get name value for sorting
    function getNameValue(item) {
        const nameElement = item.querySelector('.gallery-item-title');
        if (nameElement) {
            return nameElement.textContent.trim();
        }
        return '';
    }
    
    // Search functionality
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            searchItems();
        });
        
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                searchItems();
            }
        });
    }
    
    // Search items function
    function searchItems() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        galleryItems.forEach(item => {
            const title = item.querySelector('.gallery-item-title').textContent.toLowerCase();
            const subtitle = item.querySelector('.gallery-item-subtitle')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchTerm) || subtitle.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
        
        updateResultCount();
    }
    
    // Combined filter function
    function filterItems() {
        const checkedFilters = Array.from(filterCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
        
        galleryItems.forEach(item => {
            // Skip items already hidden by category filter
            if (item.style.display === 'none') return;
            
            // If no filters are selected, show all items
            if (checkedFilters.length === 0) {
                item.style.display = 'flex';
                return;
            }
            
            // Check if item matches any selected filter
            const features = Array.from(item.querySelectorAll('.gallery-item-feature'))
                .map(feature => feature.textContent.toLowerCase().trim());
            
            const hasMatchingFeature = checkedFilters.some(filter => 
                features.some(feature => feature.includes(filter.toLowerCase()))
            );
            
            item.style.display = hasMatchingFeature ? 'flex' : 'none';
        });
        
        updateResultCount();
    }
    
    // Initialize the result count
    updateResultCount();
    
    // Add favorite functionality
    const favoriteButtons = document.querySelectorAll('.gallery-item-favorite');
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle the 'active' class
            this.classList.toggle('active');
            
            // Change the icon
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.className = 'fas fa-heart';
            } else {
                icon.className = 'far fa-heart';
            }
        });
    });
    
    // Pagination functionality
    const pageButtons = document.querySelectorAll('.page-btn');
    const pageIndicator = document.querySelector('.current-page');
    
    if (pageButtons.length && pageIndicator) {
        const itemsPerPage = 6;
        let currentPage = 1;
        const totalItems = galleryItems.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Update displayed page number
        pageIndicator.textContent = currentPage;
        
        // Show items for current page
        function showPage(page) {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            
            galleryItems.forEach((item, index) => {
                // Skip items filtered out
                if (item.style.display === 'none') return;
                
                if (index >= start && index < end) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Update page indicator
            pageIndicator.textContent = page;
            
            // Disable/Enable page buttons
            document.querySelector('.page-btn.prev').disabled = page === 1;
            document.querySelector('.page-btn.next').disabled = page === totalPages;
        }
        
        // Next page button
        document.querySelector('.page-btn.next').addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                showPage(currentPage);
            }
        });
        
        // Previous page button
        document.querySelector('.page-btn.prev').addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
            }
        });
        
        // Initialize first page
        showPage(1);
    }
}

// Enhanced Dynamic Scroll Reveal Animation
window.addEventListener('DOMContentLoaded', () => {
    // Animation styles to cycle through
    const animationStyles = ['fade-in', 'slide-left', 'slide-right', 'zoom-in', 'rotate-in'];
    
    // Apply to section headings with decorative line
    document.querySelectorAll('section h2').forEach((heading, i) => {
        heading.classList.add('scroll-reveal', 'with-line', `delay-${(i % 3) + 1}`);
    });
    
    // Apply to major sections with different animation styles
    document.querySelectorAll('.about-section, .faqs-section, .reviews-section, .contact-section, .image-gallery-section').forEach((section, i) => {
        section.classList.add('scroll-reveal', animationStyles[i % animationStyles.length], `delay-${(i % 3) + 2}`);
    });
    
    // Apply to gallery items with alternating animations
    document.querySelectorAll('.product-card').forEach((card, i) => {
        const col = i % 4; // Column position
        const animStyle = col % 2 === 0 ? 'slide-left' : 'slide-right';
        card.classList.add('scroll-reveal', animStyle, `delay-${col + 1}`);
    });
    
    // Apply to FAQ items with staggered delays
    document.querySelectorAll('.faq-item').forEach((item, i) => {
        item.classList.add('scroll-reveal', 'fade-in', `delay-${(i % 6) + 1}`);
    });
    
    // Apply to review cards
    document.querySelectorAll('.review-card').forEach((card) => {
        card.classList.add('scroll-reveal', 'zoom-in');
    });
    
    // Apply to contact form elements
    document.querySelectorAll('.form-group').forEach((group, i) => {
        group.classList.add('scroll-reveal', 'slide-right', `delay-${i + 1}`);
    });
    
    // Initialize inventory section
    initInventoryEvents();
    renderInventoryGrid();
    
    // Run initial check for scroll reveals
    setTimeout(revealOnScroll, 300);
});

// Enhanced scroll reveal logic with intersection observer
function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal:not(.visible)');
    
    // Use Intersection Observer if available for better performance
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Once visible, no need to observe anymore
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.15 // trigger when 15% of the element is visible
        });
        
        reveals.forEach(el => observer.observe(el));
    } else {
        // Fallback for browsers without Intersection Observer
        const windowHeight = window.innerHeight;
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < windowHeight - 50) {
                el.classList.add('visible');
            }
        });
    }
}

// Add more scroll events to handle elements entering viewport during scroll
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('resize', revealOnScroll);

// Add scroll trigger for navbar transformation
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scroll-reveal', 'visible', 'scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Tab switching
for (const tab of tabs) {
    tab.onclick = function() {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.getAttribute('data-category');
        renderGallery(currentCategory);
    };
}

// Gallery click
gallery.onclick = function(e) {
    const btn = e.target.closest('.view-btn');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const category = btn.getAttribute('data-category');
    const product = products[category].find(p => p.id === id);
    if (product) showModal(product, category);
};

// Close modal
closeBtn.onclick = function() {
    modal.classList.add('hidden');
};
modal.onclick = function(e) {
    if (e.target === modal) modal.classList.add('hidden');
};

// Handle Get Quote button
document.addEventListener('click', function(e) {
    if (e.target && (e.target.classList.contains('get-quote-btn') || e.target.parentElement.classList.contains('get-quote-btn'))) {
        alert('Thank you for your interest! A representative will contact you soon about this vehicle.');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }
});

// Initial render
renderGallery(currentCategory);

// Enhanced Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Form field animations and validation
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        
        formInputs.forEach(input => {
            // Add placeholder attribute to make floating labels work
            input.setAttribute('placeholder', ' ');
            
            // Focus animation
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                
                // Simple validation
                if (this.value.trim() !== '') {
                    this.classList.add('filled');
                    this.parentElement.classList.add('has-content');
                } else {
                    this.classList.remove('filled');
                    this.parentElement.classList.remove('has-content');
                }
                
                // Add simple validation feedback
                if (this.hasAttribute('required') && this.value.trim() === '') {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
            
            // Handle select elements specially
            if (input.tagName === 'SELECT') {
                input.addEventListener('change', function() {
                    if (this.value) {
                        this.classList.add('filled');
                        this.parentElement.classList.add('has-content');
                    } else {
                        this.classList.remove('filled');
                        this.parentElement.classList.remove('has-content');
                    }
                });
            }
        });
        
        // Form submission with animation
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            let isValid = true;
            formInputs.forEach(input => {
                if (input.hasAttribute('required') && input.value.trim() === '') {
                    input.classList.add('error');
                    isValid = false;
                }
            });
            
            if (!isValid) {
                return;
            }
            
            // Disable submit button and show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (would be replaced with actual AJAX call)
            setTimeout(() => {
                // Show success message
                const formNote = document.querySelector('.form-note');
                formNote.textContent = 'Message sent successfully!';
                formNote.style.color = '#4CAF50';
                formNote.style.fontWeight = '600';
                
                // Reset button
                submitBtn.innerHTML = '<i class="fa fa-check"></i> Sent!';
                submitBtn.style.backgroundColor = '#4CAF50';
                
                // Reset form after delay
                setTimeout(() => {
                    contactForm.reset();
                    formInputs.forEach(input => {
                        input.classList.remove('filled', 'error');
                        input.parentElement.classList.remove('has-content');
                    });
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                    formNote.textContent = 'We\'ll respond within 24 business hours';
                    formNote.style.color = '';
                    formNote.style.fontWeight = '';
                }, 3000);
                
            }, 1500);
        });
        
        // Auto-populate inquiry type if coming from a product
        const populateInquiryType = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const inquiryType = urlParams.get('inquiry');
            const inquirySelect = document.getElementById('inquiry-type');
            
            if (inquiryType && inquirySelect) {
                inquirySelect.value = inquiryType;
                inquirySelect.dispatchEvent(new Event('change'));
            }
        };
        
        populateInquiryType();
    }
});
