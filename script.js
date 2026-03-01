// Function to Open/Close Sidebar
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Simple Search Filter
document.getElementById('movieSearch').addEventListener('input', function(e) {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.movie-card');

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if(title.includes(term)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Category Chip Selection
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelector('.chip.active').classList.remove('active');
        chip.classList.add('active');
        // Add filtering logic here if needed
    });
});

function contactAction() {
    alert("FreeMoviesHUB Support: Please send us an email at support@freemovieshub.com");
}

// Function to create a Movie Card HTML string
function createMovieCard(movie) {
    return `
        <a href="player.html?id=${movie.id}" class="movie-link">
            <div class="movie-card">
                <div class="poster-container">
                    <img src="${movie.poster}" alt="${movie.title}">
                    <span class="quality-tag webrip">${movie.quality}</span>
                </div>
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                </div>
            </div>
        </a>
    `;
}

// Logic for the "See More" page (movies.html)
const allMoviesGrid = document.getElementById('all-movies-grid');
if (allMoviesGrid) {
    myMovies.forEach(movie => {
        allMoviesGrid.innerHTML += createMovieCard(movie);
    });
}

// Logic for the Homepage (Only show first 4 movies as featured)
const homeGrid = document.getElementById('home-movie-grid'); 
if (homeGrid) {
    myMovies.slice(0, 4).forEach(movie => {
        homeGrid.innerHTML += createMovieCard(movie);
    });
}
