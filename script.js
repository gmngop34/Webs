const allMovies = [
    {
        id: "m1",
        title: "Interstellar",
        category: "featured",
        quality: "BluRay",
        image: "https://share.google/Kemq3MNLSBLkdZGgp",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        videoUrl: "https://www.youtube.com/embed/zSWdZVtXT7E", // Example embed link
        date: "2014",
        runtime: "169 min",
        type: "Sci-Fi",
        download: "#"
    },
    {
        id: "m2",
        title: "The Batman",
        category: "trending",
        quality: "WebRip",
        image: "https://m.media-amazon.com/images/I/8186P0B+tRL._AC_SL1500_.jpg",
        description: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind cryptic clues.",
        videoUrl: "https://www.youtube.com/embed/mqqft2x_Aa4",
        date: "2022",
        runtime: "176 min",
        type: "Action",
        download: "#"
    }
];

function displayMovies(data, targetId) {
    const grid = document.getElementById(targetId);
    if(!grid) return;
    
    grid.innerHTML = data.map(movie => `
        <div class="movie-card" onclick="openMovie('${movie.id}')">
            <span class="quality-tag">${movie.quality}</span>
            <img src="${movie.image}" 
                 alt="${movie.title}" 
                 onerror="this.src='https://via.placeholder.com/300x450?text=No+Poster'">
            <div class="card-info">
                <h3>${movie.title}</h3>
                <p>${movie.description}</p>
            </div>
        </div>
    `).join('');
}


// New helper function for movie clicks
function openMovie(id) {
    toggleLoader(true); // SHOW SPINNER
    setTimeout(() => {
        window.location.href = `player.html?id=${id}`;
    }, 300); // Short delay to show the animation
}


function loadPlayerData() {
    const params = new URLSearchParams(window.location.search);
    const movie = allMovies.find(m => m.id === params.get('id'));
    if (movie) {
        document.getElementById('videoPlayer').src = movie.videoUrl;
        document.getElementById('mTitle').innerText = movie.title;
        document.getElementById('mDate').innerText = movie.date;
        document.getElementById('mRuntime').innerText = movie.runtime;
        document.getElementById('mType').innerText = movie.type;
        document.getElementById('mDesc').innerText = movie.description;
        document.getElementById('mDownload').href = movie.download;
    }
}

// --- Updated Sidebar Logic ---
function toggleSidebar(forceState) {
    const sb = document.getElementById("sidebar");
    
    if (forceState === false) {
        sb.style.width = "0"; // Explicitly close
    } else if (forceState === true) {
        sb.style.width = "250px"; // Explicitly open
    } else {
        // Toggle behavior for the ☰ button
        sb.style.width = (sb.style.width === "250px") ? "0" : "250px";
    }
}

// --- Updated Category Filter ---
function filterByCategory(categoryName) {
    toggleLoader(true);
    toggleSidebar(false);

    // Check if we are on the homepage or movies page
    const featuredGrid = document.getElementById('featuredGrid');
    const allMoviesGrid = document.getElementById('allMoviesGrid');

    // If we have a grid on this page, filter LOCALLY instead of redirecting
    if (featuredGrid || allMoviesGrid) {
        const targetGridId = featuredGrid ? 'featuredGrid' : 'allMoviesGrid';
        
        setTimeout(() => {
            const filtered = (categoryName === 'all') 
                ? allMovies 
                : allMovies.filter(m => m.category.toLowerCase() === categoryName.toLowerCase());
            
            displayMovies(filtered, targetGridId);
            
            const titleElement = document.querySelector('.section-title');
            if(titleElement) titleElement.innerText = categoryName.toUpperCase() + " MOVIES";
            
            toggleLoader(false);
        }, 400);
    } else {
        // Only redirect if we are on the player page or a page without a grid
        window.location.href = `movies.html?filter=${categoryName}`;
    }
}




// --- 1. THE SEARCH EXECUTER ---
function executeSearch(query) {
    if (!query || query.trim() === "") return;
    
    const searchbox = query.toLowerCase().trim();
    
    // Check if we are on the movies page
    if (window.location.pathname.includes('movies.html')) {
        const filtered = allMovies.filter(m => 
            m.title.toLowerCase().includes(searchbox) || 
            m.description.toLowerCase().includes(searchbox)
        );
        
        displayMovies(filtered, 'allMoviesGrid');
        
        // Update the title to show results
        const titleElement = document.querySelector('.section-title');
        if(titleElement) titleElement.innerText = `Results for: "${query}"`;
        
        // Keep the text in the search box
        const sb = document.getElementById('searchBox');
        if(sb) sb.value = query;

    } else {
        // Redirect from Home/Player to Movies page with query
        window.location.href = `movies.html?search=${encodeURIComponent(searchbox)}`;
    }
}

// --- 2. THE AUTOMATIC LOAD FIX ---
// This part is the "Brain" that makes it work in one click
window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('search');

    if (searchQuery && window.location.pathname.includes('movies.html')) {
        // Small timeout ensures the DOM is fully ready to display movies
        setTimeout(() => {
            executeSearch(searchQuery);
        }, 100);
    }
});



// --- Function to Show/Hide Loader ---
function toggleLoader(show) {
    const loader = document.getElementById('loader-container');
    if (!loader) return;
    
    if (show) {
        loader.classList.remove('loader-hidden');
    } else {
        loader.classList.add('loader-hidden');
    }
}

// --- Updated Search Logic ---
function executeSearch(query) {
    if (!query || query.trim() === "") return;
    
    const searchbox = query.toLowerCase().trim();
    const isMoviesPage = window.location.pathname.includes('movies.html');

    if (isMoviesPage) {
        toggleLoader(true); // SHOW SPINNER
        
        // Simulating a small delay (500ms) so users actually see the polish
        setTimeout(() => {
            const filtered = allMovies.filter(m => 
                m.title.toLowerCase().includes(searchbox) || 
                m.description.toLowerCase().includes(searchbox)
            );
            displayMovies(filtered, 'allMoviesGrid');
            document.querySelector('.section-title').innerText = `Results for: "${query}"`;
            toggleLoader(false); // HIDE SPINNER
        }, 500);
        
    } else {
        // Redirect logic remains the same
        window.location.href = `movies.html?search=${encodeURIComponent(searchbox)}`;
    }
}

// Update your displayMovies function to hide loader if it's running
const originalDisplayMovies = displayMovies;
displayMovies = function(data, targetId) {
    originalDisplayMovies(data, targetId);
    toggleLoader(false); // Ensure loader hides once movies are drawn
};



// Hide loader automatically when any page finishes loading everything
window.addEventListener('load', () => {
    setTimeout(() => {
        toggleLoader(false);
    }, 200);
});




// Function to handle smooth page transitions with the loader
function navigateTo(url) {
    toggleLoader(true); // SHOW SPINNER
    
    // Small delay to ensure the user sees the animation before the browser switches pages
    setTimeout(() => {
        window.location.href = url;
    }, 400); 
}

// Ensure toggleSidebar actually closes the menu when a link is clicked
function toggleSidebar(forceState) {
    const sb = document.getElementById("sidebar");
    if (!sb) return;

    if (forceState === false) {
        sb.style.width = "0";
    } else {
        sb.style.width = (sb.style.width === "250px") ? "0" : "250px";
    }
}



// Fix for the loading spinner staying visible when using the "Back" button
window.addEventListener('pageshow', (event) => {
    // hide the loader if the page is loaded from the bfcache (back/forward cache)
    // or if it's just a normal visibility change
    toggleLoader(false);
});

// Update your toggleLoader function slightly to be more robust
function toggleLoader(show) {
    const loader = document.getElementById('loader-container');
    if (!loader) return;
    
    if (show) {
        loader.classList.remove('loader-hidden');
        loader.style.display = 'flex'; // Ensure it's visible
    } else {
        loader.classList.add('loader-hidden');
        loader.style.display = 'none'; // Force hide
    }
}




// This event fires every time the page is shown (including via Back button)
window.addEventListener('pageshow', (event) => {
    toggleLoader(false);
});

// Robust loader function
function toggleLoader(show) {
    const loader = document.getElementById('loader-container');
    if (!loader) return;
    
    if (show) {
        loader.classList.remove('loader-hidden');
        loader.style.display = 'flex';
    } else {
        loader.classList.add('loader-hidden');
        loader.style.display = 'none';
    }
}







