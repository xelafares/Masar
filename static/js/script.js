document.addEventListener("DOMContentLoaded", async function() {
    checkPageAccess(); 
    await renderHeader();
    await renderFooter();
    highlightActiveLink();
    updateHomePageContent(); 
    setupBookmarkToggle(); 
    renderJobFilter();
    setupSmartScroll();
    setupFilterToggleButtons(); 
    checkInitialDarkMode();
});

let isLoggedIn = true;

function checkPageAccess() {
    const currentPath = window.location.pathname.split("/").pop();
    
    // List of pages that require login
    const restrictedPages = [
        "job.html", 
        "roadmap.html", 
        "roadmap_roles.html", 
        "roadmap_skills.html", 
        "roadmap_trending.html", 
        "roadmap_viewer.html",
        "bookmarks.html",
        "profile.html"
    ];

    if (restrictedPages.includes(currentPath) && !isLoggedIn) {
        showAuthLockModal();
    }
}

function showAuthLockModal() {
    const overlay = document.createElement('div');
    overlay.className = 'auth-lock-overlay';
    
    document.body.style.overflow = 'hidden';

    overlay.innerHTML = `
        <div class="auth-lock-modal">
            <div class="logos-container" style ="display: center; align-items: center; margin-bottom: 50px;">
                <img src="../static/images/blacklogo.png" alt="Masar Logo" class="logo-img" style="height: 40px; margin-right: 10px;">
                <img src="../static/images/blacklogotext.png" alt="Masar Logo" class="logo-img" style="height: 40px; align-items: center;">
            </div>
            <h2>Unlock Your Potential</h2>
            <p>Join Masar today to access thousands of jobs, personalized roadmaps, and track your career progress.</p>
            
            <a href="signup.html" class="auth-lock-btn auth-lock-join">Join Us Now</a>
            
            <p style="margin-bottom: 10px; margin-top: 50px; font-size: 0.9rem;">Already have an account?</p>
            <a href="login.html" class="auth-lock-btn auth-lock-login">Log In</a>
            
            <a href="index.html" class="auth-home-link">← Back to Home</a>
        </div>
    `;

    document.body.appendChild(overlay);
}

function toggleDarkMode(force) {
    const body = document.body;
    let isDark;

    if (typeof force === 'boolean') {
        isDark = force;
    } else {
        isDark = !body.classList.contains('dark-mode');
    }

    if (isDark) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }

    localStorage.setItem('darkModeEnabled', isDark ? 'true' : 'false');

    const switchInput = document.getElementById('darkModeToggle');
    if (switchInput) {
        switchInput.checked = isDark;
    }
}

function checkInitialDarkMode() {
    const isDark = localStorage.getItem('darkModeEnabled') === 'true';
    const currentPath = window.location.pathname.split("/").pop();
    const isHomePage = currentPath === "index.html" || currentPath === "";

    if (isDark && !isHomePage) {
        toggleDarkMode(true);
    }
    
    if (isDark) {
        const switchInput = document.getElementById('darkModeToggle');
        if (switchInput) switchInput.checked = true;
    }
}

function updateHomePageContent() {
    let username = "Alex";
    const welcomeMessage = document.getElementById("welcome-message");
    
    const bookmarksBtn = document.getElementById("bookmarks-button");
    const profileBtn = document.getElementById("profile-button");
    const joinBtn = document.getElementById("join-button");

    if (welcomeMessage) {
        if (isLoggedIn) {
            welcomeMessage.innerHTML = `Welcome back, <strong>${username}</strong>!`;
            
            if (bookmarksBtn) bookmarksBtn.classList.remove("hidden");
            if (profileBtn) profileBtn.classList.remove("hidden");
            
            if (joinBtn) joinBtn.classList.add("hidden");

        } else {
            welcomeMessage.innerHTML = `Welcome to Masar!`;
            
            if (bookmarksBtn) bookmarksBtn.classList.add("hidden");
            if (profileBtn) profileBtn.classList.add("hidden");

            if (joinBtn) joinBtn.classList.remove("hidden");
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
        
        setupFilterSidebar();

    } catch (error) {
        console.error("Failed to load job filter:", error);
    }
}

async function renderHeader() {
    const headerContainer = document.getElementById("header");
    if (!headerContainer) return;

    try {
        const response = await fetch("header.html");
        if (!response.ok) throw new Error("Failed to load header");
        const headerHTML = await response.text();
        headerContainer.innerHTML = headerHTML;

        // Dynamic Logic Insertion
        const isDarkInitial = localStorage.getItem('darkModeEnabled') === 'true';
        
        // Common Dark Mode Toggle HTML
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

        const userMenuContainer = document.getElementById("user-menu-container");
        const bookmarksContainer = document.getElementById("nav-bookmarks-container");

        if (isLoggedIn) {
            // Render Logged In Menu
            if (userMenuContainer) {
                userMenuContainer.innerHTML = `
                    ${darkModeSwitch}
                    <a href="profile.html" class="profile-btn">
                        <img src="https://ui-avatars.com/api/?name=User&background=random" alt="Profile" class="profile-img">
                    </a>
                    <a href="#" onclick="logout(event)" class="logout-btn" title="Logout">
                        <img src="../static/images/logout.png" alt="Logout" class="logout-icon">
                    </a>
                `;
            }
            // Render Bookmarks Link
            if (bookmarksContainer) {
                bookmarksContainer.innerHTML = `<li><a href="bookmarks.html">Bookmarks</a></li>`;
            }
        } else {
            // Render Logged Out Menu
            if (userMenuContainer) {
                userMenuContainer.innerHTML = `
                    ${darkModeSwitch}
                    <a href="login.html" class="login-btn">Login</a>
                    <a href="signup.html" class="join-btn">Join Us</a>
                `;
            }
            // Clear Bookmarks Link
            if (bookmarksContainer) {
                bookmarksContainer.innerHTML = '';
            }
        }

    } catch (error) {
        console.error("Error loading header:", error);
    }
}

async function renderFooter() {
    const footerContainer = document.getElementById("footer");
    if (!footerContainer) return;

    try {
        const response = await fetch("footer.html");
        if (!response.ok) throw new Error("Failed to load footer");
        const footerHTML = await response.text();
        footerContainer.innerHTML = footerHTML;
    } catch (error) {
        console.error("Error loading footer:", error);
    }
}

function highlightActiveLink() {
    const currentPath = window.location.pathname.split("/").pop(); 
    const navLinks = document.querySelectorAll(".nav-links a");
    const header = document.querySelector("header"); 
    const body = document.body;

    navLinks.forEach(link => {
        const linkPath = link.getAttribute("href");
        if (linkPath === currentPath || (currentPath === "" && linkPath === "index.html")) {
            link.classList.add("active");
        }
    });

    if (header) {
        const isHomePage = currentPath === "index.html" || currentPath === "";
        
        if (!isHomePage) {
            header.classList.add("solid-header");
            if (localStorage.getItem('darkModeEnabled') === 'true') {
                 body.classList.add('dark-mode');
            }
        } else {
            header.classList.remove("solid-header");
            body.classList.remove('dark-mode'); 
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
    
    filterToggleBtn.addEventListener('click', () => {
        const actualSidebar = document.getElementById('job-filter-sidebar');
        const overlay = document.querySelector('.filter-overlay'); 
        if (!actualSidebar) return; 

        const isVisible = actualSidebar.classList.contains('filters-visible');
        
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
    const closeFilterBtn = document.getElementById('close-filter-btn');
    const salarySlider = document.getElementById('salary-slider');
    const salaryInput = document.getElementById('salary-input');
    const body = document.body;
    
    let overlay = document.querySelector('.filter-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.classList.add('filter-overlay');
        document.body.appendChild(overlay);
    }

    if (filterSidebar && closeFilterBtn) {
        closeFilterBtn.addEventListener('click', () => {
            filterSidebar.classList.remove('filters-visible');
            body.classList.remove('filter-open');
            overlay.classList.remove('active');
        });

        overlay.addEventListener('click', () => {
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

let lastScrollY = window.scrollY;

function setupSmartScroll() {
    window.addEventListener("scroll", () => {
        const header = document.querySelector("header");
        if (!header) return; 

        const currentPath = window.location.pathname.split("/").pop();
        const isHomePage = currentPath === "index.html" || currentPath === "";

        if (isHomePage) {
            if (window.scrollY > 5) {
                header.classList.add("scrolling-opaque");
            } else {
                header.classList.remove("scrolling-opaque");
            }
        }

        if (window.scrollY > lastScrollY && window.scrollY > 50) {
            header.classList.add("hide");
        } else {
            header.classList.remove("hide");
        }

        lastScrollY = window.scrollY;
    });
}

let currentView = 'categories';

function showJobRoles(e) {
    if(e) e.preventDefault();
    
    document.getElementById('roadmap-intro').style.display = 'none';
    document.getElementById('categories-view').style.display = 'none';
    
    const rolesView = document.getElementById('roles-view');
    rolesView.style.display = 'grid'; 
    
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
    const data = roadmapData[roadmapId];
    if(!data) return;

    document.getElementById('roles-view').style.display = 'none';
    const timelineView = document.getElementById('timeline-view');
    timelineView.style.display = 'block';

    document.getElementById('roadmap-title').innerText = data.title;
    document.getElementById('roadmap-desc').innerText = data.description;

    const container = document.getElementById('timeline-container');
    container.innerHTML = ''; 

    data.steps.forEach(step => {
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
        localStorage.setItem(storageKey, 'true');
        stepDiv.classList.add('completed');
    } else {
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

function renderGrid(categoryFilter, containerId, bgClass) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    for (const key in roadmapData) {
        const item = roadmapData[key];
        
        if (item.categories.includes(categoryFilter)) {
            
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

function loadRoadmapTimeline(roadmapId) {
    const data = roadmapData[roadmapId];
    if(!data) return;

    document.getElementById('roadmap-title').innerText = data.title;
    document.getElementById('roadmap-desc').innerText = data.description;

    const container = document.getElementById('timeline-container');
    
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

/* --- PROFILE PAGE LOGIC --- */

// 1. Load Data on Page Init
function loadProfileData() {
    // Attempt to get data from LocalStorage, otherwise use defaults
    const storedName = localStorage.getItem("masar_username") || "User Name";
    const storedTitle = localStorage.getItem("masar_title") || "Aspiring Developer";
    const storedEmail = localStorage.getItem("masar_email") || "";
    const storedBio = localStorage.getItem("masar_bio") || "";
    const storedAvatar = localStorage.getItem("masar_avatar");

    // Update Sidebar
    const sidebarName = document.getElementById("sidebar-username");
    const sidebarTitle = document.getElementById("sidebar-title");
    const avatarDisplay = document.getElementById("profile-avatar-display");

    if(sidebarName) sidebarName.innerText = storedName;
    if(sidebarTitle) sidebarTitle.innerText = storedTitle;
    
    // If we have a saved base64 image, use it. Otherwise default.
    if(storedAvatar && avatarDisplay) {
        avatarDisplay.src = storedAvatar;
    }

    // Update Form Inputs
    const inputName = document.getElementById("settings-username");
    const inputTitle = document.getElementById("settings-title");
    const inputEmail = document.getElementById("settings-email");
    const inputBio = document.getElementById("settings-bio");

    if(inputName) inputName.value = storedName;
    if(inputTitle) inputTitle.value = storedTitle;
    if(inputEmail) inputEmail.value = storedEmail;
    if(inputBio) inputBio.value = storedBio;
}

// 2. Handle Image Upload Preview & Save
function previewAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Update the image source immediately
            document.getElementById("profile-avatar-display").src = e.target.result;
            
            // Save to LocalStorage (Note: Base64 strings can be large, this is okay for small demos)
            localStorage.setItem("masar_avatar", e.target.result);
            
            // Update header avatar if it exists
            const headerAvatar = document.querySelector(".profile-img");
            if(headerAvatar) headerAvatar.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// 3. Save Profile Info Form
function saveProfileInfo(event) {
    event.preventDefault();
    
    const name = document.getElementById("settings-username").value;
    const title = document.getElementById("settings-title").value;
    const email = document.getElementById("settings-email").value;
    const bio = document.getElementById("settings-bio").value;

    // Save to LocalStorage
    localStorage.setItem("masar_username", name);
    localStorage.setItem("masar_title", title);
    localStorage.setItem("masar_email", email);
    localStorage.setItem("masar_bio", bio);

    // Update UI elements immediately
    document.getElementById("sidebar-username").innerText = name;
    document.getElementById("sidebar-title").innerText = title;

    // Update Welcome Message on Home if present
    const welcomeMsg = document.getElementById("welcome-message");
    if(welcomeMsg) {
        welcomeMsg.innerHTML = `Welcome back, <strong>${name}</strong>!`;
    }
}

// 4. Mock Password Change
function changePassword(event) {
    event.preventDefault();
    const currentPass = document.getElementById("current-password").value;
    const newPass = document.getElementById("new-password").value;

    if(!currentPass || !newPass) {
        alert("Please fill in both password fields.");
        return;
    }

    // In a real app, you would verify currentPass with the backend
    console.log("Password change requested.");
    
    // Clear fields
    document.getElementById("current-password").value = "";
    document.getElementById("new-password").value = "";
    
    alert("Password updated successfully!");
}