//const token = localStorage.getItem("token"); for when fast api is implemented

document.addEventListener("DOMContentLoaded", function() {
    renderHeader();
    renderFooter();
    highlightActiveLink();
    updateHomePageContent(); 
    setupBookmarkToggle(); 
    renderJobFilter();
});

let isLoggedIn = true; // Setting this to true for development/demonstration purposes

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
    const filterContainer = document.getElementById("job-filter");
    if (!filterContainer) return; // Only run on the job.html page

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

document.addEventListener("", function() {
    renderHeader();
    renderFooter();
    highlightActiveLink();
});

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

    // Search functionality to be implemented later //

    // const searchInput = document.querySelector(".search-input");
    // const searchBtn = document.querySelector(".search-btn");

    // searchInput.addEventListener("keypress", function(event) {
    //     if (event.key === "Enter") {
    //         performSearch(searchInput.value);
    //     }
    // });

    // searchBtn.addEventListener("click", function() {
    //     performSearch(searchInput.value);
    // });

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

// wasnt me LMAO
function highlightActiveLink() {
    const currentPath = window.location.pathname.split("/").pop(); 
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {
        const linkPath = link.getAttribute("href");
        if (linkPath === currentPath || (currentPath === "" && linkPath === "index.html")) {
            link.classList.add("active");
        }
    });
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

function setupFilterSidebar() {
    const filterSidebar = document.getElementById('job-filter-sidebar');
    const filterToggleBtn = document.getElementById('filter-toggle-btn');
    const closeFilterBtn = document.getElementById('close-filter-btn');
    const salarySlider = document.getElementById('salary-slider');
    const salaryInput = document.getElementById('salary-input');

    if (filterToggleBtn && filterSidebar) {
        filterToggleBtn.addEventListener('click', () => {
            filterSidebar.classList.toggle('filters-visible');
        });

        closeFilterBtn.addEventListener('click', () => {
            filterSidebar.classList.remove('filters-visible');
        });

        document.addEventListener('click', (event) => {
            if (filterSidebar.classList.contains('filters-visible') && 
                !filterSidebar.contains(event.target) && 
                event.target !== filterToggleBtn) {
                filterSidebar.classList.remove('filters-visible');
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

window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    if (!header) return; 

    // 1. TRANSPARENCY LOGIC
    // If we are NOT at the very top (scrollY > 0), make it solid
    if (window.scrollY > 0) {
        header.classList.add("scrolled");
    } else {
        // If we are at the top, make it transparent
        header.classList.remove("scrolled");
    }

    // 2. HIDE/SHOW LOGIC (Existing)
    if (window.scrollY > lastScrollY && window.scrollY > 50) {
        header.classList.add("hide");
    } else {
        header.classList.remove("hide");
    }

    lastScrollY = window.scrollY;
});