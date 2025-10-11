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
}
document.getElementById('nav-search-input').addEventListener('input', function(e) {
    searchProducts(e.target.value);
});
document.getElementById('mobile-search-input').addEventListener('input', function(e) {
    searchProducts(e.target.value);
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
// Slideshow logic
const slideshowImages = [
    { src: 'image/truck1.jpg', alt: 'Truck 1', desc: 'Freightliner Cascadia: Reliable, powerful, and ready for long hauls.' },
    { src: 'image/truck2.jpg', alt: 'Truck 2', desc: 'Kenworth T680: Fuel efficient, comfortable sleeper cab.' },
    { src: 'image/truck3.jpg', alt: 'Truck 3', desc: 'Volvo VNL 760: Advanced safety, spacious interior.' },
    { src: 'image/truck4.jpg', alt: 'Truck 4', desc: 'Premium Truck: High performance, modern features.' },
    { src: 'image/trailer1.jpg', alt: 'Trailer 1', desc: 'Utility 53ft Dry Van: Lightweight, durable, DOT inspected.' },
    { src: 'image/trailer2.jpg', alt: 'Trailer 2', desc: 'Fontaine Flatbed: Versatile, easy loading, excellent condition.' },
    { src: 'image/trailer3.jpg', alt: 'Trailer 3', desc: 'Great Dane Reefer: Temperature controlled, low hours.' },
    { src: 'image/trailer4.jpg', alt: 'Trailer 4', desc: 'Premium Trailer: Robust build, ready for business.' }
];
let slideshowIndex = 0;
const slideshowContainer = document.querySelector('.slideshow-images');
const slideshowDots = document.querySelector('.slideshow-dots');
function renderSlideshow() {
    slideshowContainer.innerHTML = '';
    slideshowImages.forEach((img, i) => {
        const el = document.createElement('img');
        el.src = img.src;
        el.alt = img.alt;
        el.className = 'slideshow-img' + (i === slideshowIndex ? ' active' : '');
        slideshowContainer.appendChild(el);
    });
    // Caption
    const captionBox = document.querySelector('.slideshow-caption');
    if (captionBox) {
        captionBox.textContent = slideshowImages[slideshowIndex].desc;
    }
    // Dots
    slideshowDots.innerHTML = '';
    slideshowImages.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'slideshow-dot' + (i === slideshowIndex ? ' active' : '');
        dot.onclick = () => { slideshowIndex = i; renderSlideshow(); };
        slideshowDots.appendChild(dot);
    });
}
function nextSlide() {
    slideshowIndex = (slideshowIndex + 1) % slideshowImages.length;
    renderSlideshow();
}
function prevSlide() {
    slideshowIndex = (slideshowIndex - 1 + slideshowImages.length) % slideshowImages.length;
    renderSlideshow();
}
document.querySelector('.slideshow-btn.next').onclick = nextSlide;
document.querySelector('.slideshow-btn.prev').onclick = prevSlide;
renderSlideshow();
let slideshowTimer = setInterval(nextSlide, 4000);
// Pause on hover
slideshowContainer.addEventListener('mouseenter', () => clearInterval(slideshowTimer));
slideshowContainer.addEventListener('mouseleave', () => slideshowTimer = setInterval(nextSlide, 4000));
// FAQ dropdown logic
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function() {
        const item = btn.parentElement;
        item.classList.toggle('active');
        // Close others
        document.querySelectorAll('.faq-item').forEach(other => {
            if (other !== item) other.classList.remove('active');
        });
    });
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
    products[category].forEach((product, i) => {
        const card = document.createElement('div');
        card.className = `product-card scroll-reveal delay-${(i % 4) + 1}`;
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <button class="view-btn" data-id="${product.id}" data-category="${category}">View Details</button>
        `;
        gallery.appendChild(card);
    });
    revealOnScroll();
}

function showModal(product, category) {
    modalDetails.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>Details:</strong> ${product.details}</p>
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
// Apply scroll reveal to major sections on page load
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.about-section, .faqs-section, .reviews-section, .contact-section, .image-gallery-section').forEach((section, i) => {
        section.classList.add('scroll-reveal', `delay-${(i % 4) + 1}`);
    });
    revealOnScroll();
});
// Scroll reveal logic
function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    const windowWidth = window.innerWidth;
    for (const el of reveals) {
        const rect = el.getBoundingClientRect();
        if (rect.left < windowWidth - 60) {
            el.classList.add('visible');
        } else {
            el.classList.remove('visible');
        }
    }
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('resize', revealOnScroll);

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

// Initial render
renderGallery(currentCategory);

// Contact form (demo only)
document.getElementById('contact-form').onsubmit = function(e) {
    e.preventDefault();
    alert('Thank you for contacting TryTruckNTrailer! We will get back to you soon.');
    this.reset();
};
