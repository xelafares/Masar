//const token = localStorage.getItem("token"); for when fast api is implemented

document.addEventListener("DOMContentLoaded", function() {
    renderHeader();
    renderFooter();
    highlightActiveLink();
    updateHomePageContent(); 
    setupBookmarkToggle(); 
    renderJobFilter();
    setupSmartScroll();
    setupFilterToggleButtons(); 
    checkInitialDarkMode(); // NEW: Check dark mode status on load
});

let isLoggedIn = true; // Setting this to true for development/demonstration purposes

// NEW: Toggle Dark Mode function
function toggleDarkMode(force) {
    const body = document.body;
    let isDark;

    if (typeof force === 'boolean') {
        isDark = force;
    } else {
        isDark = !body.classList.contains('dark-mode');
    }

    // Toggle the class on the body
    if (isDark) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }

    // Save preference to localStorage
    localStorage.setItem('darkModeEnabled', isDark ? 'true' : 'false');

    // Ensure the switch state matches the class (needed when clicking the nav switch)
    const switchInput = document.getElementById('darkModeToggle');
    if (switchInput) {
        switchInput.checked = isDark;
    }
}

// NEW: Check Dark Mode status when the page loads (affects non-homepage pages)
function checkInitialDarkMode() {
    const isDark = localStorage.getItem('darkModeEnabled') === 'true';
    const currentPath = window.location.pathname.split("/").pop();
    const isHomePage = currentPath === "index.html" || currentPath === "";

    // Dark mode is only applied outside the homepage initially
    if (isDark && !isHomePage) {
        toggleDarkMode(true);
    }
}


function updateHomePageContent() {
    let username = "Alex";
    const welcomeMessage = document.getElementById("welcome-message");
    const bookmarksButton = document.getElementById("bookmarks-button");

    if (welcomeMessage) {
        if (isLoggedIn) {
            // Using strong tag instead of bold tag for semantic HTML
            welcomeMessage.innerHTML = `Welcome back, <strong>${username}</strong>!`;
            // Show the bookmarks button in the quick access section
            if (bookmarksButton) {
                bookmarksButton.classList.remove("hidden");
            }
        } else {
            welcomeMessage.innerHTML = `Welcome to Masar!`;
            // Ensure bookmarks button is hidden if logged out
            if (bookmarksButton) {
                bookmarksButton.classList.add("hidden");
            }
        }
    }
}

async function renderJobFilter() {
    // Check for filter containers on both job.html and bookmarks.html
    const jobFilterContainer = document.getElementById("job-filter"); 
    const bookmarksFilterContainer = document.getElementById("bookmarks-filter");
    
    // Determine which container (if any) to render the filter into
    const filterContainer = jobFilterContainer || bookmarksFilterContainer;
    if (!filterContainer) return;

    try {
        // Assume job_filter.html is in the same directory as job.html for this fetch path
        const response = await fetch("job_filter.html"); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const filterHTML = await response.text();
        filterContainer.innerHTML = filterHTML;
        
        // IMPORTANT: Setup event listeners only AFTER the HTML is loaded
        setupFilterSidebar();

    } catch (error) {
        console.error("Failed to load job filter:", error);
    }
}

//implement search functionality later

// async function performSearch(query) {
//     if (!query) return;

//     console.log(`Searching for: ${query}...`);

//     try {
//         const response = await fetch(`http://localhost:8000/search?q=${query}`);
//         const data = await response.json();
//         console.log("Results found:", data.results);
        
//         // Redirect to a results page with the data in the URL
//         window.location.href = `search_results.html?q=${query}`;

//     } catch (error) {
//         console.error("Search failed:", error);
//     }
// }

function renderHeader() {
    const header = document.getElementById("header");
    let userSection = '';
    let bookmarks = '';
    
    // Determine initial switch state
    const isDarkInitial = localStorage.getItem('darkModeEnabled') === 'true';
    
    // Dark mode switch HTML using IMG tags for custom icons as requested
    const darkModeSwitch = `
        <div class="dark-mode-toggle-container" title="Toggle Light/Dark Mode">
            <input type="checkbox" class="switch-checkbox" id="darkModeToggle" ${isDarkInitial ? 'checked' : ''} onchange="toggleDarkMode()">
            <label for="darkModeToggle" class="switch-label">
                <img src="../static/images/sun.png" class="toggle-icon sun-icon" alt="Light Mode">
                <img src="../static/images/moon.png" class="toggle-icon moon-icon" alt="Dark Mode">
                <span class="ball"></span>
            </label>
        </div>
    `;

    if (isLoggedIn) {
        userSection = `
        <div class="user-menu">
            ${darkModeSwitch}
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
                ${darkModeSwitch}
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
                <img src="../static/images/whitelogo.png" alt="Masar Logo" class="logo-img" style="height: 50px; margin-bottom: 20px;">
                
                <p>Masar is a career and skill development platform designed to guide you through your professional journey. We offer structured roadmaps, job listings, and community support.</p>
                
                <div class="social-links">
                    <a href="https://github.com/xelafares/Masar" target="_blank" class="github-link" title="GitHub Repository">
                        <img src="../static/images/github.png" alt="GitHub Logo" class="github-icon-img">
                    </a>
                    <a href="https://linkedin.com/profile1" target="_blank" title="LinkedIn Profile 1">
                        <img src="../static/images/linkedin.png" alt="LinkedIn" class="social-icon">
                    </a>
                    <a href="https://linkedin.com/profile2" target="_blank" title="LinkedIn Profile 2">
                        <img src="../static/images/linkedin.png" alt="LinkedIn" class="social-icon">
                    </a>
                    <a href="https://twitter.com/Masar" target="_blank" title="Twitter/X">
                        <img src="../static/images/x.png" alt="Twitter/X" class="social-icon"> 
                    </a>
                </div>
            </div>

            <div class="footer-element">
                <h3>CONTACT US</h3>
                <div class="contact-info-group">
                    <img src="../static/images/mail.png" alt="Email Icon" class="contact-icon">
                    <a href="mailto:MasarSalesTeam@gmail.com">MasarSalesTeam@gmail.com</a>
                </div>
                <div class="contact-info-group">
                    <img src="../static/images/phone.png" alt="Phone Icon" class="contact-icon">
                    <p>a number?</p>
                </div>
                <div class="contact-info-group" style="align-items: flex-start;">
                    <img src="../static/images/home.png" alt="Location Icon" class="contact-icon" style="margin-top: 2px;">
                    <p style="margin: 0; line-height: 1.4;">Proudly made and based in Cairo, Egypt.</p>
                </div>
            </div>

            <div class="footer-element">
                <h3>SUBSCRIBE TO OUR NEWSLETTER</h3>
                <p>Join our subscribers list to get the latest news, updates and special offers delivered directly in your inbox.</p>
                <form class="subscribe-form" onsubmit="return false;">
                    <input type="email" placeholder="Enter your email here" required>
                    <button type="submit">Join</button>
                </form>
            </div>

        </div>

        <div class="footer-bottom">
            <p class="copyright-text">&copy; 2025 Masar. All rights reserved.</p>
            <div class="footer-secondary-links">
                <a href="privacy.html">Privacy Policy</a>
                <a href="terms.html">Terms of Use</a>
            </div>
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

// wasn't me LMAO (Removed the unnecessary empty addEventListener block)
function highlightActiveLink() {
    const currentPath = window.location.pathname.split("/").pop(); 
    const navLinks = document.querySelectorAll(".nav-links a");
    const header = document.querySelector("header"); 
    const body = document.body; // NEW: Get body reference

    navLinks.forEach(link => {
        const linkPath = link.getAttribute("href");
        if (linkPath === currentPath || (currentPath === "" && linkPath === "index.html")) {
            link.classList.add("active");
        }
    });

    // LOGIC: Make header solid purple on all pages EXCEPT index.html
    if (header) {
        const isHomePage = currentPath === "index.html" || currentPath === "";
        
        if (!isHomePage) {
            header.classList.add("solid-header");
            
            // NEW: Apply dark mode class instantly if preference is set (affects non-home pages)
            if (localStorage.getItem('darkModeEnabled') === 'true') {
                 body.classList.add('dark-mode');
            }
        } else {
            header.classList.remove("solid-header");
            // NEW: Ensure dark mode class is removed on homepage
            body.classList.remove('dark-mode'); 
        }
    }
}

function setupBookmarkToggle() {
    const jobListings = document.querySelectorAll('.job-listing');
    
    // Assuming you have bookmark_empty.png and bookmark_full.png in ../static/images/
    const emptyIconPath = '../static/images/bookmark_empty.png';
    const fullIconPath = '../static/images/bookmark_full.png';

    jobListings.forEach(listing => {
        const bookmarkBtn = listing.querySelector('.bookmark-btn');
        const bookmarkIcon = listing.querySelector('.bookmark-icon');

        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', function() {
                let isBookmarked = this.getAttribute('data-bookmarked') === 'true';

                if (isBookmarked) {
                    // Unbookmark it
                    this.setAttribute('data-bookmarked', 'false');
                    bookmarkIcon.src = emptyIconPath;
                    bookmarkIcon.alt = "Bookmark";
                    // In a real app, you would send a request to remove the bookmark here
                    // console.log(`Job ${listing.getAttribute('data-job-id')} unbookmarked.`);
                } else {
                    // Bookmark it
                    this.setAttribute('data-bookmarked', 'true');
                    bookmarkIcon.src = fullIconPath;
                    bookmarkIcon.alt = "Bookmarked";
                    // In a real app, you would send a request to save the bookmark here
                    // console.log(`Job ${listing.getAttribute('data-job-id')} bookmarked.`);
                }
            });
        }
    });
}

function setupFilterToggleButtons() {
    const filterToggleBtn = document.getElementById('filter-toggle-btn') || document.getElementById('bookmarks-filter-toggle-btn');
    const body = document.body;
    let overlay = document.querySelector('.filter-overlay');

    if (!filterToggleBtn) return;
    
    // This handler will toggle the visibility of the sidebar and the overlay/blur effect.
    filterToggleBtn.addEventListener('click', () => {
        const actualSidebar = document.getElementById('job-filter-sidebar');
        if (!actualSidebar) return; 

        const isVisible = actualSidebar.classList.contains('filters-visible');
        
        // Manual toggle logic
        if (!isVisible) {
            actualSidebar.classList.add('filters-visible');
            body.classList.add('filter-open');
            if (overlay) overlay.classList.add('active');
        } else {
            actualSidebar.classList.remove('filters-visible');
            body.classList.remove('filter-open');
            if (overlay) overlay.classList.remove('active');
        }
    });
}


function setupFilterSidebar() {
    const filterSidebar = document.getElementById('job-filter-sidebar');
    // NOTE: The main toggle buttons are now handled by setupFilterToggleButtons
    const closeFilterBtn = document.getElementById('close-filter-btn');
    const salarySlider = document.getElementById('salary-slider');
    const salaryInput = document.getElementById('salary-input');
    const body = document.body;
    
    // NEW: Create and manage a fixed overlay element for dimming
    let overlay = document.querySelector('.filter-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('filter-overlay');
        document.body.appendChild(overlay);
    }

    // This logic handles closing the sidebar via the 'X' button or the overlay click
    if (filterSidebar) {
        closeFilterBtn.addEventListener('click', () => {
            filterSidebar.classList.remove('filters-visible');
            body.classList.remove('filter-open');
            overlay.classList.remove('active');
        });

        // Close on outside click using the overlay
        overlay.addEventListener('click', (event) => {
            if (filterSidebar.classList.contains('filters-visible')) {
                filterSidebar.classList.remove('filters-visible');
                body.classList.remove('filter-open');
                overlay.classList.remove('active');
            }
        });
    }
    
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
                // If scrolled down at all, make it opaque
                header.classList.add("scrolling-opaque");
            } else {
                // If at the very top, make it transparent
                header.classList.remove("scrolling-opaque");
            }
        }

        // 2. HIDE/SHOW LOGIC 
        // Only hide the header if we're scrolling down AND we've scrolled past the top 50px
        if (window.scrollY > lastScrollY && window.scrollY > 50) {
            header.classList.add("hide");
        } else {
            header.classList.remove("hide");
        }

        lastScrollY = window.scrollY;
    });
}