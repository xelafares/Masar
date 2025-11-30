let allJobs = [];

document.addEventListener("DOMContentLoaded", async function() {
    checkPageAccess(); 

    await renderHeader();
    await renderFooter();
    
    highlightActiveLink();
    updateHomePageContent(); 
    setupBookmarkToggle(); 
    await renderJobFilter(); 
    setupSmartScroll();
    setupFilterToggleButtons(); 
    checkInitialDarkMode();
    
    if (document.getElementById("profile-info-form")) {
        loadProfileData();
    }

    if (document.getElementById("job-listings-container")) {
        await fetchAndDisplayJobs();
    }

    if (document.getElementById("bookmarks-container")) {
        await fetchAndDisplayBookmarks();
    }
});

let isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; 
let currentUserId = localStorage.getItem("masar_user_id") || -1;

async function fetchAndDisplayJobs() {
    const container = document.getElementById("job-listings-container");
    if(!container) return;

    container.innerHTML = '<div style="text-align:center; padding:40px;">Loading jobs...</div>';

    try {
        const response = await fetch(`/api/jobs?user_id=${currentUserId}`);
        if (!response.ok) throw new Error("Failed to fetch jobs");
        
        allJobs = await response.json();
        filterAndRenderJobs();

    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = '<div style="text-align:center; padding:40px; color:red;">Failed to load jobs. Is the server running?</div>';
    }
}

async function fetchAndDisplayBookmarks() {
    const container = document.getElementById("bookmarks-container");
    if(!container) return;

    container.innerHTML = '<div style="text-align:center; padding:40px;">Loading your saved jobs...</div>';

    try {
        const response = await fetch(`/api/jobs?user_id=${currentUserId}`);
        if (!response.ok) throw new Error("Failed to fetch jobs");
        
        const data = await response.json();
        allJobs = data.filter(job => job.bookmarked === true);
        
        filterAndRenderJobs();

    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = '<div style="text-align:center; padding:40px; color:red;">Failed to load bookmarks.</div>';
    }
}

function filterAndRenderJobs() {
    let container = document.getElementById("job-listings-container");
    if (!container) {
        container = document.getElementById("bookmarks-container");
    }
    if (!container) return;

    const salaryMin = parseInt(document.getElementById("salary-input")?.value) || 0;
    const techCheckboxes = document.querySelectorAll('input[name="tech"]:checked');
    const selectedTech = Array.from(techCheckboxes).map(cb => cb.value.toLowerCase());
    const dateFilter = document.getElementById("posted-date-filter")?.value || "all";
    const sortBy = document.getElementById("sort-by")?.value || "relevance";

    let filteredJobs = allJobs.filter(job => {
        const jobMaxSalary = job.salary_max || 0;
        const jobTech = (job.tech_stack || "").toLowerCase();
        
        if (jobMaxSalary < salaryMin) return false;

        if (selectedTech.length > 0) {
            const hasMatch = selectedTech.some(tech => jobTech.includes(tech));
            if (!hasMatch) return false;
        }

        if (dateFilter !== "all" && job.posted_date) {
            const jobDate = new Date(job.posted_date);
            const now = new Date();
            const diffTime = Math.abs(now - jobDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (dateFilter === "1d" && diffDays > 1) return false;
            if (dateFilter === "7d" && diffDays > 7) return false;
            if (dateFilter === "14d" && diffDays > 14) return false;
            if (dateFilter === "30d" && diffDays > 30) return false;
        }
        return true;
    });

    if (sortBy === "salary-high") {
        filteredJobs.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
    } else if (sortBy === "salary-low") {
        filteredJobs.sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0));
    } else if (sortBy === "date") {
        filteredJobs.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
    }

    container.innerHTML = "";
    
    if (filteredJobs.length === 0) {
        const isBookmarksPage = container.id === "bookmarks-container";
        const message = isBookmarksPage 
            ? "You haven't bookmarked any jobs yet." 
            : "No jobs found matching your criteria.";
            
        container.innerHTML = `<div style="text-align:center; padding: 60px; color: var(--text-color-faded);">
            <img src="static/images/search.png" style="width:50px; opacity:0.5; filter:invert(0.5); margin-bottom:10px;">
            <h3>${message}</h3>
            ${!isBookmarksPage ? "<p>Try adjusting your filters.</p>" : "<p>Go to the Jobs page to save some opportunities.</p>"}
        </div>`;
        return;
    }

    filteredJobs.forEach(job => {
        const techArray = job.tech_stack ? job.tech_stack.split(',') : [];
        const tagsHtml = techArray.map((tech, index) => 
            `<span class="tech-tag ${index === 0 ? 'primary-tech' : ''}">${tech.trim()}</span>`
        ).join('');

        let dateText = "Recently";
        if(job.posted_date) {
            const jobDate = new Date(job.posted_date);
            const daysAgo = Math.floor((new Date() - jobDate) / (1000 * 60 * 60 * 24));
            dateText = daysAgo === 0 ? "Today" : `${daysAgo} days ago`;
        }

        const bookmarkIcon = job.bookmarked ? 'static/images/bookmark_full.png' : 'static/images/bookmark_empty.png';
        const salaryText = (job.salary_min && job.salary_max) 
            ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()} / year` 
            : "Salary not specified";

        const fullDesc = job.description || "No description available.";
        const words = fullDesc.split(' ');
        let descriptionHTML = '';

        if (words.length > 100) {
            const shortDesc = words.slice(0, 100).join(' ') + '...';
            descriptionHTML = `
                <p class="job-description">
                    <span class="desc-short">${shortDesc}</span>
                    <span class="desc-full" style="display:none;">${fullDesc}</span>
                    <button class="view-more-btn" onclick="toggleDescription(this)" style="background:none; border:none; color:#9C27B0; font-weight:bold; cursor:pointer; padding:0; margin-left:5px;">View More</button>
                </p>
            `;
        } else {
            descriptionHTML = `<p class="job-description">${fullDesc}</p>`;
        }

        const html = `
            <article class="job-listing" data-job-id="${job.id}">
                <div class="job-image-container">
                    <img src="${job.logo_url || 'static/images/whitelogo.png'}" alt="${job.company} Logo" class="company-logo" onerror="this.src='static/images/whitelogo.png'">
                </div>
                
                <div class="job-details">
                    <div class="job-header">
                        <h2 class="job-title">${job.title}</h2>
                        <button class="bookmark-btn" data-bookmarked="${job.bookmarked}" onclick="toggleJobBookmark(${job.id}, this)">
                            <img src="${bookmarkIcon}" alt="Bookmark" class="bookmark-icon">
                        </button>
                    </div>

                    <p class="company-name">${job.company}</p>
                    
                    <div class="tech-tag-container">
                        ${tagsHtml}
                    </div>
                    <p class="salary job-meta">${salaryText}</p>

                    ${descriptionHTML}

                    <div class="job-footer">
                        <p class="posted-date">Posted: ${dateText}</p>
                        <a href="${job.url || '#'}" target="_blank" class="apply-btn">View Listing</a>
                    </div>
                </div>
            </article>
        `;
        container.innerHTML += html;
    });
}

function toggleDescription(btn) {
    const parent = btn.parentElement;
    const shortSpan = parent.querySelector('.desc-short');
    const fullSpan = parent.querySelector('.desc-full');

    if (shortSpan.style.display === 'none') {
        shortSpan.style.display = 'inline';
        fullSpan.style.display = 'none';
        btn.innerText = "View More";
    } else {
        shortSpan.style.display = 'none';
        fullSpan.style.display = 'inline';
        btn.innerText = "View Less";
    }
}

async function toggleJobBookmark(jobId, btn) {
    if (!isLoggedIn) {
        showToast("Please log in to bookmark jobs.", "error");
        return;
    }

    const isBookmarked = btn.getAttribute('data-bookmarked') === 'true';
    const icon = btn.querySelector('img');
    const userId = localStorage.getItem("masar_user_id");

    if (isBookmarked) {
        // --- REMOVE BOOKMARK ---
        try {
            const response = await fetch("/api/bookmarks", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, job_id: jobId })
            });

            if (response.ok) {
                btn.setAttribute('data-bookmarked', 'false');
                icon.src = 'static/images/bookmark_empty.png';
                showToast("Job removed from bookmarks.", "success");
                
                // Update local state
                const job = allJobs.find(j => j.id === jobId);
                if(job) job.bookmarked = false;

                // If on bookmarks page, re-render to remove it from view
                if (document.getElementById("bookmarks-container")) {
                    filterAndRenderJobs();
                }
            } else {
                showToast("Could not remove bookmark.", "error");
            }
        } catch (e) {
            showToast("Network error.", "error");
        }

    } else {
        // --- ADD BOOKMARK ---
        try {
            const response = await fetch("/api/bookmarks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, job_id: jobId })
            });

            if (response.ok) {
                btn.setAttribute('data-bookmarked', 'true');
                icon.src = 'static/images/bookmark_full.png';
                showToast("Job saved to bookmarks!", "success");
                
                const job = allJobs.find(j => j.id === jobId);
                if(job) job.bookmarked = true;
            } else {
                showToast("Could not save bookmark.", "error");
            }
        } catch (e) {
            showToast("Network error.", "error");
        }
    }
}

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) container.remove();
    }, 3500);
}

function getUserAvatar(userId) {
    const saved = localStorage.getItem(`masar_avatar_${userId}`);
    if (saved) return saved;
    const username = localStorage.getItem("masar_username") || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128`;
}

function checkPageAccess() {
    const currentPath = window.location.pathname.split("/").pop();
    
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
            <div class="logos-container" style ="display: flex; justify-content: center; align-items: center; margin-bottom: 30px;">
                <img src="static/images/blacklogo.png" alt="Masar Logo" class="logo-img" style="height: 40px; margin-right: 10px;">
                <img src="static/images/blacklogotext.png" alt="Masar Logo" class="logo-img" style="height: 35px; align-items: center;">
            </div>
            <h2>Unlock Your Potential</h2>
            <p>Join Masar today to access thousands of jobs, personalized roadmaps, and track your career progress.</p>
            <a href="signup.html" class="auth-lock-btn auth-lock-join">Join Us Now</a>
            <p style="margin-bottom: 10px; margin-top: 30px; font-size: 0.9rem; color: var(--text-color-faded);">Already have an account?</p>
            <a href="login.html" class="auth-lock-btn auth-lock-login">Log In</a>
            <a href="index.html" class="auth-home-link">← Back to Home</a>
        </div>
    `;
    document.body.appendChild(overlay);
}

function updateHomePageContent() {
    let username = localStorage.getItem("masar_username") || "User";
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

function toggleDarkMode(force) {
    const body = document.body;
    let isDark;
    if (typeof force === 'boolean') isDark = force;
    else isDark = !body.classList.contains('dark-mode');

    if (isDark) body.classList.add('dark-mode');
    else body.classList.remove('dark-mode');

    localStorage.setItem('darkModeEnabled', isDark ? 'true' : 'false');
    const switchInput = document.getElementById('darkModeToggle');
    if (switchInput) switchInput.checked = isDark;
}

function checkInitialDarkMode() {
    const isDark = localStorage.getItem('darkModeEnabled') === 'true';
    const currentPath = window.location.pathname.split("/").pop();
    const isHomePage = currentPath === "index.html" || currentPath === "";

    if (isDark && !isHomePage) toggleDarkMode(true);
    if (isDark) {
        const switchInput = document.getElementById('darkModeToggle');
        if (switchInput) switchInput.checked = true;
    }
}

async function renderJobFilter() {
    const jobFilterContainer = document.getElementById("job-filter"); 
    const bookmarksFilterContainer = document.getElementById("bookmarks-filter");
    
    const filterContainer = jobFilterContainer || bookmarksFilterContainer;
    if (!filterContainer) return;

    try {
        const response = await fetch("job_filter.html"); 
        if (!response.ok) throw new Error("Failed to load filter");
        const filterHTML = await response.text();
        filterContainer.innerHTML = filterHTML;
        
        setupFilterSidebar();
        
        const inputs = filterContainer.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', filterAndRenderJobs);
            input.addEventListener('input', filterAndRenderJobs);
        });

    } catch (error) {
        console.error("Failed to load job filter:", error);
    }
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
            filterAndRenderJobs();
        });
        salaryInput.addEventListener('input', () => {
            let value = parseInt(salaryInput.value);
            if (value >= salarySlider.min && value <= salarySlider.max) {
                salarySlider.value = value;
                filterAndRenderJobs();
            }
        });
    }
    
    const applyBtn = document.querySelector('.apply-filters');
    if(applyBtn) {
        applyBtn.addEventListener('click', () => {
            filterAndRenderJobs();
            filterSidebar.classList.remove('filters-visible');
            body.classList.remove('filter-open');
            overlay.classList.remove('active');
        });
    }
    
    const clearBtn = document.querySelector('.clear-filters');
    if(clearBtn) {
        clearBtn.addEventListener('click', () => {
            salarySlider.value = 0;
            salaryInput.value = 0;
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            document.getElementById("posted-date-filter").value = "all";
            
            filterAndRenderJobs();
        });
    }
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

async function renderHeader() {
    const headerContainer = document.getElementById("header");
    if (!headerContainer) return;

    try {
        const response = await fetch("header.html");
        const headerHTML = await response.text();
        headerContainer.innerHTML = headerHTML;

        const isDarkInitial = localStorage.getItem('darkModeEnabled') === 'true';
        
        const darkModeSwitch = `
            <div class="dark-mode-toggle-container" title="Toggle Light/Dark Mode">
                <input type="checkbox" class="switch-checkbox" id="darkModeToggle" ${isDarkInitial ? 'checked' : ''} onchange="toggleDarkMode()">
                <label for="darkModeToggle" class="switch-label">
                    <img src="static/images/sun.png" class="toggle-icon sun-icon" alt="Light Mode">
                    <img src="static/images/moon.png" class="toggle-icon moon-icon" alt="Dark Mode">
                    <span class="ball"></span>
                </label>
            </div>
        `;

        const userMenuContainer = document.getElementById("user-menu-container");
        const bookmarksContainer = document.getElementById("nav-bookmarks-container");

        if (isLoggedIn) {
            if (userMenuContainer) {
                const userId = localStorage.getItem("masar_user_id");
                const avatarSrc = getUserAvatar(userId);
                
                userMenuContainer.innerHTML = `
                    ${darkModeSwitch}
                    <a href="profile.html" class="profile-btn">
                        <img src="${avatarSrc}" alt="Profile" class="profile-img" style="width:35px; height:35px; border-radius:50%; margin-top:5px; border:2px solid var(--border-color); object-fit: cover;">
                    </a>
                    <a href="#" onclick="logout(event)" class="logout-btn" title="Logout">
                        <img src="static/images/logout.png" alt="Logout" class="logout-icon">
                    </a>
                `;
            }
            if (bookmarksContainer) {
                bookmarksContainer.innerHTML = `<li><a href="bookmarks.html">Bookmarks</a></li>`;
            }
        } else {
            if (userMenuContainer) {
                userMenuContainer.innerHTML = `
                    ${darkModeSwitch}
                    <a href="login.html" class="login-btn">Login</a>
                    <a href="signup.html" class="join-btn">Join Us</a>
                `;
            }
            if (bookmarksContainer) bookmarksContainer.innerHTML = '';
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
        const footerHTML = await response.text();
        footerContainer.innerHTML = footerHTML;
    } catch (error) { console.error(error); }
}

async function handleLogin(e) {
    e.preventDefault(); 
    
    const emailInput = document.getElementById("email");
    const passInput = document.getElementById("password");
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;

    btn.innerText = "Verifying...";
    btn.disabled = true;

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: emailInput.value,
                password: passInput.value
            })
        });

        if (response.ok) {
            const data = await response.json();
            
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("masar_username", data.username); 
            localStorage.setItem("masar_user_id", data.user_id); 
            
            showToast("Login successful!", "success");
            
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            showToast("Invalid email or password.", "error");
            btn.innerText = originalText;
            btn.disabled = false;
        }

    } catch (error) {
        console.error("Error:", error);
        showToast("Server connection failed.", "error");
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

async function handleSignup(e) {
    e.preventDefault(); 
    
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPass = document.getElementById("confirm-password").value;
    const captcha = document.getElementById("captcha").checked;
    
    if (password !== confirmPass) {
        showToast("Passwords do not match.", "error");
        return;
    }
    
    if (!captcha) {
        showToast("Please complete the captcha.", "error");
        return;
    }

    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "Creating Account...";
    btn.disabled = true;

    try {
        const response = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("masar_username", data.username);
            localStorage.setItem("masar_user_id", data.id);
            
            showToast("Account created! Welcome to Masar.", "success");
            
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        } else {
            const errorData = await response.json();
            showToast(errorData.detail || "Signup failed.", "error");
            btn.innerText = originalText;
            btn.disabled = false;
        }

    } catch (error) {
        console.error("Error:", error);
        showToast("Server connection failed.", "error");
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

function logout(e) {
    if (e) e.preventDefault();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("masar_username");
    localStorage.removeItem("masar_user_id");
    window.location.href = "index.html";
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
            if (localStorage.getItem('darkModeEnabled') === 'true') body.classList.add('dark-mode');
        } else {
            header.classList.remove("solid-header");
            body.classList.remove('dark-mode'); 
        }
    }
}

function setupBookmarkToggle() {
    const jobListings = document.querySelectorAll('.job-listing');
    const emptyIconPath = 'static/images/bookmark_empty.png';
    const fullIconPath = 'static/images/bookmark_full.png';

    jobListings.forEach(listing => {
        const bookmarkBtn = listing.querySelector('.bookmark-btn');
        const bookmarkIcon = listing.querySelector('.bookmark-icon');

        if (bookmarkBtn && !bookmarkBtn.getAttribute('onclick')) {
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

function loadProfileData() {
    const userId = localStorage.getItem("masar_user_id");
    const storedName = localStorage.getItem("masar_username") || "User Name";
    const storedTitle = localStorage.getItem("masar_title") || "Aspiring Developer";
    const storedEmail = localStorage.getItem("masar_email") || "";
    const storedBio = localStorage.getItem("masar_bio") || "";
    
    const avatarSrc = getUserAvatar(userId);

    const sidebarName = document.getElementById("sidebar-username");
    const sidebarTitle = document.getElementById("sidebar-title");
    const avatarDisplay = document.getElementById("profile-avatar-display");

    if(sidebarName) sidebarName.innerText = storedName;
    if(sidebarTitle) sidebarTitle.innerText = storedTitle;
    if(avatarDisplay) avatarDisplay.src = avatarSrc;

    const inputName = document.getElementById("settings-username");
    if(inputName) inputName.value = storedName;
    const inputTitle = document.getElementById("settings-title");
    if(inputTitle) inputTitle.value = storedTitle;
    const inputEmail = document.getElementById("settings-email");
    if(inputEmail) inputEmail.value = storedEmail;
    const inputBio = document.getElementById("settings-bio");
    if(inputBio) inputBio.value = storedBio;
}

function previewAvatar(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById("profile-avatar-display").src = e.target.result;
            const userId = localStorage.getItem("masar_user_id");
            if (userId) {
                localStorage.setItem(`masar_avatar_${userId}`, e.target.result);
                const headerAvatar = document.querySelector(".profile-img");
                if(headerAvatar) headerAvatar.src = e.target.result;
                showToast("Avatar updated successfully!", "success");
            } else {
                showToast("Error: User ID not found.", "error");
            }
        };
        reader.readAsDataURL(file);
    }
}

function saveProfileInfo(event) {
    event.preventDefault();
    const name = document.getElementById("settings-username").value;
    const title = document.getElementById("settings-title").value;
    const email = document.getElementById("settings-email").value;
    const bio = document.getElementById("settings-bio").value;

    if (!name || !title) {
        showToast("Username and Job Title are required.", "error");
        return;
    }

    localStorage.setItem("masar_username", name);
    localStorage.setItem("masar_title", title);
    localStorage.setItem("masar_email", email);
    localStorage.setItem("masar_bio", bio);

    document.getElementById("sidebar-username").innerText = name;
    document.getElementById("sidebar-title").innerText = title;
    
    const welcomeMsg = document.getElementById("welcome-message");
    if(welcomeMsg) welcomeMsg.innerHTML = `Welcome back, <strong>${name}</strong>!`;

    showToast("Profile updated successfully!", "success");
}

function changePassword(event) {
    event.preventDefault();
    const currentPass = document.getElementById("current-password").value;
    const newPass = document.getElementById("new-password").value;

    if(!currentPass || !newPass) {
        showToast("Please fill in both fields.", "error");
        return;
    }
    document.getElementById("current-password").value = "";
    document.getElementById("new-password").value = "";
    showToast("Password updated successfully!", "success");
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
            return `<a href="${res.url}" target="_blank" class="resource-item ${cssClass}"><span class="res-icon">${icon}</span><span class="res-title">${res.title}</span></a>`;
        }).join('');
        const stepHTML = `<div class="timeline-step ${isCompleted ? 'completed' : ''}" id="step-${step.id}"><div class="timeline-marker"></div><div class="step-card"><div class="step-header"><h3>${step.title}</h3><input type="checkbox" class="progress-checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleStepProgress('${roadmapId}', '${step.id}', this)"></div><p class="step-desc">${step.desc}</p><div class="resources-list">${resourcesHTML}</div></div></div>`;
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
            const html = `<a href="${link}" class="roadmap-category-box ${bgClass}" style="text-decoration:none;"><div class="content-wrapper"><h2 class="category-title" style="font-size: 1.5rem;">${item.title}</h2><p class="category-description">${item.description}</p></div></a>`;
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
            return `<a href="${res.url}" target="_blank" class="resource-item ${cssClass}"><span class="res-icon">${icon}</span><span class="res-title">${res.title}</span></a>`;
        }).join('');
        return `<div class="timeline-step ${isCompleted ? 'completed' : ''}" id="step-${step.id}"><div class="timeline-marker"></div><div class="step-card"><div class="step-header"><h3>${step.title}</h3><input type="checkbox" class="progress-checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleStepProgress('${roadmapId}', '${step.id}', this)"></div><p class="step-desc">${step.desc}</p><div class="resources-list">${resourcesHTML}</div></div></div>`;
    }).join('');
    container.innerHTML = allStepsHTML;
}