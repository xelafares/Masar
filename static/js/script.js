//const token = localStorage.getItem("token"); for when fast api is implemented

document.addEventListener("DOMContentLoaded", function() {
    renderHeader();
    renderFooter();
    highlightActiveLink();
    updateHomePageContent(); 
    setupBookmarkToggle(); 
    renderJobFilter();
    setupSmartScroll();
});

let isLoggedIn = true; // Setting this to true for development/demonstration purposes

function updateHomePageContent() {
    let username = "Alex";
    const welcomeMessage = document.getElementById("welcome-message");
    const bookmarksButton = document.getElementById("bookmarks-button");

    if (welcomeMessage) {
        if (isLoggedIn) {
            welcomeMessage.innerHTML = `Welcome back, <strong>${username}</strong>!`;
            if (bookmarksButton) {
                bookmarksButton.classList.remove("hidden");
            }
        } else {
            welcomeMessage.innerHTML = `Welcome to Masar!`;
            if (bookmarksButton) {
                bookmarksButton.classList.add("hidden");
            }
        }
    }
}

async function renderJobFilter() {
    const jobFilterContainer = document.getElementById("job-filter"); 
    const bookmarksFilterContainer = document.getElementById("bookmarks-filter");
    
    const filterContainer = jobFilterContainer || bookmarksFilterContainer;
    if (!filterContainer) return;

    try {
        const response = await fetch("job_filter.html");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const filterHTML = await response.text();
        filterContainer.innerHTML = filterHTML;
        
        setTimeout(() => {
            setupFilterSidebar();
            setupFilterToggleButtons();
        }, 100);

    } catch (error) {
        console.error("Failed to load job filter:", error);
    }
}

function renderHeader() {
    const header = document.getElementById("header");
    let userSection = '';
    let bookmarks = '';

    if (isLoggedIn) {
        userSection = `
        <div class="user-menu">
            <a href="profile.html" class="profile-btn">
                <img src="https://ui-avatars.com/api/?name=User&background=random" alt="Profile" class="profile-img">
            </a>
            
            <a href="#" onclick="logout(event)" class="logout-btn" title="Logout">
                <img src="../static/images/logout.png" alt="Logout" class="logout-icon">
            </a>
        </div>
        `;
        bookmarks = `<li><a href="bookmarks.html">Bookmarks</a></li>`;
    }

    else{
        userSection = `
            <div class="user-menu">
                <a href="login.html" class="login-btn">Login</a>
                <a href="login.html" class="join-btn">Join Us</a>
            </div>
        `;
    }

    const headerHTML = `
    <header>
        <nav>
            <div class="logo-container">
                <a href="index.html">
                    <img src="../static/images/whitelogotext.png" alt="Logo" class="logo-img">
                </a>
            </div>
            
            <ul class="nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="job.html">Jobs</a></li>
                <li><a href="roadmap.html">Roadmaps</a></li>
                ${bookmarks}
                <li><a href="about.html">About Us</a></li>
            </ul>

            <div class="search-container">
                <input type="text" placeholder="What are you looking for?" class="search-input">
                <button class="search-btn">
                    <img src="../static/images/search.png" alt="Search" class="search-icon">
                </button>
            </div>

            ${userSection}

        </nav>
    </header>
    `;

    if (header) {
        header.innerHTML = headerHTML;
    }
}

function renderFooter() {
    const footer = document.getElementById("footer");
    const footerHTML = `
    <footer>
    <div class="footer-top">
        
        <div class="footer-element">
            <h3>Get to Know Us</h3>
            <ul>
                <li><a href="about.html">About Us</a></li>
                <li><a href="careers.html">Careers</a></li>
                <li><a href="roadmap.html">Our Roadmap</a></li>
                <li><a href="blog.html">Company Blog</a></li>
            </ul>
        </div>

        <div class="footer-element">
            <h3>Contact Us</h3>
            <ul>
                <li><a href="contact.html">Contact Us</a></li>
                <li><a href="help.html">Help Center</a></li>
                <li><a href="mailto:(MasarSupport@support.com?)">Email Us</a></li>
            </ul>
        </div>

    </div>

    <div class="footer-bottom">
        <h3>&copy; 2025, Masar. All rights reserved.</h3>
    </div>
</footer>
    `;

    if (footer) {
        footer.innerHTML = footerHTML;
    }
}

function logout() {
    //localStorage.removeItem("token"); for when fast api is implemented
    window.location.href = "index.html";
}

function highlightActiveLink() {
    const currentPath = window.location.pathname.split("/").pop(); 
    const navLinks = document.querySelectorAll(".nav-links a");
    const header = document.querySelector("header");

    navLinks.forEach(link => {
        const linkPath = link.getAttribute("href");
        if (linkPath === currentPath || (currentPath === "" && linkPath === "index.html")) {
            link.classList.add("active");
        }
    });

    // LOGIC: Make header solid purple on all pages EXCEPT index.html
    if (header) {
        if (currentPath !== "index.html" && currentPath !== "") {
            header.classList.add("solid-header");
        } else {
            header.classList.remove("solid-header");
        }
    }
}

function setupBookmarkToggle() {
    const jobListings = document.querySelectorAll('.job-listing');
    
    const emptyIconPath = '../static/images/bookmark_empty.png';
    const fullIconPath = '../static/images/bookmark_full.png';

    jobListings.forEach(listing => {
        const bookmarkBtn = listing.querySelector('.bookmark-btn');
        const bookmarkIcon = listing.querySelector('.bookmark-icon');

        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', function() {
                let isBookmarked = this.getAttribute('data-bookmarked') === 'true';

                if (isBookmarked) {
                    this.setAttribute('data-bookmarked', 'false');
                    bookmarkIcon.src = emptyIconPath;
                    bookmarkIcon.alt = "Bookmark";
                } else {
                    this.setAttribute('data-bookmarked', 'true');
                    bookmarkIcon.src = fullIconPath;
                    bookmarkIcon.alt = "Bookmarked";
                }
            });
        }
    });
}

function setupFilterToggleButtons() {
    const filterToggleBtn = document.getElementById('filter-toggle-btn') || document.getElementById('bookmarks-filter-toggle-btn');
    const body = document.body;
    
    if (!filterToggleBtn) return;
    
    let overlay = document.querySelector('.filter-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('filter-overlay');
        document.body.appendChild(overlay);
    }
    
    filterToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const actualSidebar = document.getElementById('job-filter-sidebar');
        if (!actualSidebar) return;

        const isVisible = actualSidebar.classList.contains('filters-visible');
        
        if (!isVisible) {
            actualSidebar.classList.add('filters-visible');
            body.classList.add('filter-open');
            overlay.classList.add('active');
        } else {
            actualSidebar.classList.remove('filters-visible');
            body.classList.remove('filter-open');
            overlay.classList.remove('active');
        }
    });
}

function setupFilterSidebar() {
    const filterSidebar = document.getElementById('job-filter-sidebar');
    const closeFilterBtn = document.getElementById('close-filter-btn');
    const salarySlider = document.getElementById('salary-slider');
    const salaryInput = document.getElementById('salary-input');
    const body = document.body;
    
    if (!filterSidebar) return;
    
    let overlay = document.querySelector('.filter-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('filter-overlay');
        document.body.appendChild(overlay);
    }

    if (closeFilterBtn) {
        closeFilterBtn.addEventListener('click', () => {
            filterSidebar.classList.remove('filters-visible');
            body.classList.remove('filter-open');
            overlay.classList.remove('active');
        });
    }

    overlay.addEventListener('click', () => {
        if (filterSidebar.classList.contains('filters-visible')) {
            filterSidebar.classList.remove('filters-visible');
            body.classList.remove('filter-open');
            overlay.classList.remove('active');
        }
    });
    
    if (salarySlider && salaryInput) {
        salarySlider.addEventListener('input', () => {
            salaryInput.value = salarySlider.value;
        });

        salaryInput.addEventListener('input', () => {
            let value = parseInt(salaryInput.value);
            if (value >= salarySlider.min && value <= salarySlider.max) {
                salarySlider.value = value;
            } else if (value > salarySlider.max) {
                salarySlider.value = salarySlider.max;
            } else if (value < salarySlider.min) {
                salarySlider.value = salarySlider.min;
            }
        });
    }
}

/* Smart Scroll Logic for Header */
let lastScrollY = window.scrollY;

function setupSmartScroll() {
    window.addEventListener("scroll", () => {
        const header = document.querySelector("header");
        if (!header) return; 

        const currentPath = window.location.pathname.split("/").pop();
        const isHomePage = currentPath === "index.html" || currentPath === "";

        // 1. OPAQUE/TRANSPARENT LOGIC (Only runs on the homepage)
        if (isHomePage) {
            if (window.scrollY > 5) {
                header.classList.add("scrolling-opaque");
            } else {
                header.classList.remove("scrolling-opaque");
            }
        }

        // 2. HIDE/SHOW LOGIC 
        if (window.scrollY > lastScrollY && window.scrollY > 50) {
            header.classList.add("hide");
        } else {
            header.classList.remove("hide");
        }

        lastScrollY = window.scrollY;
    });
}