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
//     if (!query) return;

//     console.log(`Searching for: ${query}...`);

//     try {
//         const response = await fetch(`http://localhost:8000/search?q=${query}`);
//         const data = await response.json();
//         console.log("Results found:", data.results);
        
//         // Redirect to a results page with the data in the URL
//         window.location.href = `search_results.html?q=${query}`;

//     } catch (error) {
//         console.error("Search failed:", error);
//     }
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
                    <a href="https://www.linkedin.com/in/yousef-ahmed-b75592370" target="_blank" title="LinkedIn Profile 1">
                        <img src="../static/images/linkedin.png" alt="LinkedIn" class="social-icon">
                    </a>
                    <a href="https://www.linkedin.com/in/faressarhan/" target="_blank" title="LinkedIn Profile 2">
                        <img src="../static/images/linkedin.png" alt="LinkedIn" class="social-icon">
                    </a>
                    <img src="../static/images/x.png" alt="Twitter/X" class="social-icon">
                    <!-- <a href="" title="Twitter/X">
                        <img src="../static/images/x.png" alt="Twitter/X" class="social-icon"> 
                    </a> -->
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

    if (!filterToggleBtn) return;
    
    // This handler will toggle the visibility of the sidebar and the overlay/blur effect.
    filterToggleBtn.addEventListener('click', () => {
        const actualSidebar = document.getElementById('job-filter-sidebar');
        const overlay = document.querySelector('.filter-overlay'); // Get overlay each time
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
    if (filterSidebar && closeFilterBtn) {
        closeFilterBtn.addEventListener('click', () => {
            filterSidebar.classList.remove('filters-visible');
            body.classList.remove('filter-open');
            overlay.classList.remove('active');
        });

        // Close on outside click using the overlay
        overlay.addEventListener('click', () => {
            if (filterSidebar.classList.contains('filters-visible')) {
                filterSidebar.classList.remove('filters-visible');
                body.classList.remove('filter-open');
                overlay.classList.remove('active');
            }
        });
    }
    
    // Salary slider synchronization
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

/* --- ROADMAP LOGIC --- */

let currentView = 'categories';

function showJobRoles(e) {
    if(e) e.preventDefault();
    
    document.getElementById('roadmap-intro').style.display = 'none';
    document.getElementById('categories-view').style.display = 'none';
    
    const rolesView = document.getElementById('roles-view');
    rolesView.style.display = 'grid'; 
    
    // Inject the available roles
    rolesView.innerHTML = `
        <div class="roadmap-category-box role-bg" onclick="loadRoadmap('frontend')" style="cursor:pointer; height:auto; padding-top:20%;">
            <div class="content-wrapper"><h3>Frontend Developer</h3></div>
        </div>
        <div class="roadmap-category-box role-bg" onclick="loadRoadmap('backend')" style="cursor:pointer; height:auto; padding-top:20%;">
            <div class="content-wrapper"><h3>Backend Developer</h3></div>
        </div>
    `;
    currentView = 'roles';
}

function loadRoadmap(roadmapId) {
    // 1. Get Static Content from roadmap_data.js
    const data = roadmapData[roadmapId];
    if(!data) return;

    // 2. Switch Views
    document.getElementById('roles-view').style.display = 'none';
    const timelineView = document.getElementById('timeline-view');
    timelineView.style.display = 'block';

    // 3. Populate Header
    document.getElementById('roadmap-title').innerText = data.title;
    document.getElementById('roadmap-desc').innerText = data.description;

    const container = document.getElementById('timeline-container');
    container.innerHTML = ''; 

    // 4. Generate Steps
    data.steps.forEach(step => {
        // --- READ PROGRESS FROM LOCAL STORAGE ---
        // We create a unique key: user_roadmapID_stepID
        const storageKey = `masar_progress_${roadmapId}_${step.id}`;
        const isCompleted = localStorage.getItem(storageKey) === 'true';

        // Build Resources Links
        const resourcesHTML = step.resources.map(res => {
            const isVideo = res.type === 'video';
            // Use distinct emojis or icons for visual learners
            const icon = isVideo ? '▶️' : '📄'; 
            const cssClass = isVideo ? 'res-video' : 'res-article';
            return `
                <a href="${res.url}" target="_blank" class="resource-item ${cssClass}">
                    <span class="res-icon">${icon}</span>
                    <span class="res-title">${res.title}</span>
                </a>
            `;
        }).join('');

        // Build the HTML card
        const stepHTML = `
            <div class="timeline-step ${isCompleted ? 'completed' : ''}" id="step-${step.id}">
                <div class="timeline-marker"></div>
                <div class="step-card">
                    <div class="step-header">
                        <h3>${step.title}</h3>
                        <input type="checkbox" class="progress-checkbox" 
                            ${isCompleted ? 'checked' : ''} 
                            onchange="toggleStepProgress('${roadmapId}', '${step.id}', this)">
                    </div>
                    <p class="step-desc">${step.desc}</p>
                    <div class="resources-list">
                        ${resourcesHTML}
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += stepHTML;
    });

    currentView = 'timeline';
}

function toggleStepProgress(roadmapId, stepId, checkbox) {
    const storageKey = `masar_progress_${roadmapId}_${stepId}`;
    const stepDiv = document.getElementById(`step-${stepId}`);

    if (checkbox.checked) {
        // SAVE to LocalStorage
        localStorage.setItem(storageKey, 'true');
        stepDiv.classList.add('completed');
    } else {
        // REMOVE from LocalStorage
        localStorage.removeItem(storageKey);
        stepDiv.classList.remove('completed');
    }
}

function goBack() {
    if (currentView === 'timeline') {
        document.getElementById('timeline-view').style.display = 'none';
        showJobRoles(null); 
    } else if (currentView === 'roles') {
        document.getElementById('roles-view').style.display = 'none';
        document.getElementById('categories-view').style.display = 'grid';
        document.getElementById('roadmap-intro').style.display = 'block';
        currentView = 'categories';
    }
}

/* --- NEW ROADMAP FUNCTIONS --- */

// 1. Render the Grid of Boxes (used by roles, skills, trending pages)
function renderGrid(categoryFilter, containerId, bgClass) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    // Loop through all data
    for (const key in roadmapData) {
        const item = roadmapData[key];
        
        // If the item belongs to this category (role/skill/trending)
        if (item.categories.includes(categoryFilter)) {
            
            // Link to the Viewer page with ID parameter
            const link = `roadmap_viewer.html?id=${key}`;
            
            const html = `
                <a href="${link}" class="roadmap-category-box ${bgClass}" style="text-decoration:none;">
                    <div class="content-wrapper">
                        <h2 class="category-title" style="font-size: 1.5rem;">${item.title}</h2>
                        <p class="category-description">${item.description}</p>
                    </div>
                </a>
            `;
            container.innerHTML += html;
        }
    }
}

// 2. Render the Timeline (used by viewer page)
function loadRoadmapTimeline(roadmapId) {
    const data = roadmapData[roadmapId];
    if(!data) return;

    document.getElementById('roadmap-title').innerText = data.title;
    document.getElementById('roadmap-desc').innerText = data.description;

    const container = document.getElementById('timeline-container');
    
    // Optimised Rendering
    const allStepsHTML = data.steps.map(step => {
        const storageKey = `masar_progress_${roadmapId}_${step.id}`;
        const isCompleted = localStorage.getItem(storageKey) === 'true';

        const resourcesHTML = step.resources.map(res => {
            const isVideo = res.type === 'video';
            const icon = isVideo ? '▶️' : '📄'; 
            const cssClass = isVideo ? 'res-video' : 'res-article';
            return `
                <a href="${res.url}" target="_blank" class="resource-item ${cssClass}">
                    <span class="res-icon">${icon}</span>
                    <span class="res-title">${res.title}</span>
                </a>
            `;
        }).join('');

        return `
            <div class="timeline-step ${isCompleted ? 'completed' : ''}" id="step-${step.id}">
                <div class="timeline-marker"></div>
                <div class="step-card">
                    <div class="step-header">
                        <h3>${step.title}</h3>
                        <input type="checkbox" class="progress-checkbox" 
                            ${isCompleted ? 'checked' : ''} 
                            onchange="toggleStepProgress('${roadmapId}', '${step.id}', this)">
                    </div>
                    <p class="step-desc">${step.desc}</p>
                    <div class="resources-list">
                        ${resourcesHTML}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = allStepsHTML;
}