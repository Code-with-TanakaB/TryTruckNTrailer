const resultsSection = document.getElementById('results');
const resultsGrid = document.getElementById('search-results-grid');
function showResults(filtered, category) {
    // Hide main gallery, show results section
    document.getElementById('gallery').style.display = 'none';
    resultsSection.style.display = 'block';
    resultsGrid.innerHTML = '';
    filtered.forEach((product, i) => {
        const card = document.createElement('div');
        card.className = 'product-card scroll-reveal';
        card.style.transitionDelay = (i * 0.12) + 's';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <button class="view-btn" data-id="${product.id}" data-category="${category}">View Details</button>
        `;
        resultsGrid.appendChild(card);
    });
    revealOnScroll();
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}
// Search logic
function filterProducts(query, category) {
    query = query.trim().toLowerCase();
    if (!query) return products[category];
    return products[category].filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.details.toLowerCase().includes(query)
    );
}

function renderFilteredGallery(filtered, category) {
    gallery.innerHTML = '';
    filtered.forEach((product, i) => {
        const card = document.createElement('div');
        card.className = 'product-card scroll-reveal';
        card.style.transitionDelay = (i * 0.12) + 's';
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

document.getElementById('nav-search-form').onsubmit = function(e) {
    e.preventDefault();
    const query = document.getElementById('nav-search-input').value;
    const filtered = filterProducts(query, currentCategory);
    showResults(filtered, currentCategory);
};

document.getElementById('mobile-search-form').onsubmit = function(e) {
    e.preventDefault();
    const query = document.getElementById('mobile-search-input').value;
    const filtered = filterProducts(query, currentCategory);
    showResults(filtered, currentCategory);
    // Optionally close menu after search
    mobileMenu.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.querySelectorAll('.bar')[0].style.transform = '';
    menuToggle.querySelectorAll('.bar')[1].style.opacity = '1';
    menuToggle.querySelectorAll('.bar')[2].style.transform = '';
};
// Show main gallery if user switches tabs or clears search
function showGallery() {
    resultsSection.style.display = 'none';
    document.getElementById('gallery').style.display = 'block';
    renderGallery(currentCategory);
}
for (const tab of tabs) {
    tab.onclick = function() {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentCategory = tab.getAttribute('data-category');
        showGallery();
    };
}
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
        card.className = 'product-card scroll-reveal';
        card.style.transitionDelay = (i * 0.12) + 's';
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
            card.className = 'more-like-card scroll-reveal';
            card.style.transitionDelay = (i * 0.12) + 's';
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
