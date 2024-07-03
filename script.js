const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

// Debounce function to limit the rate at which a function is executed
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Load movies from API
async function loadMovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
    try {
        const res = await fetch(URL);
        const data = await res.json();
        if (data.Response === "True") {
            displayMovieList(data.Search);
        } else {
            searchList.innerHTML = `<p class="no-results">${data.Error}</p>`;
        }
    } catch (error) {
        searchList.innerHTML = `<p class="error-message">An error occurred while fetching data. Please try again later.</p>`;
    }
}

function findMovies() {
    const searchTerm = movieSearchBox.value.trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = movies.map(movie => {
        const moviePoster = (movie.Poster !== "N/A") ? movie.Poster : "image_not_found.png";
        return `
            <div class="search-list-item" data-id="${movie.imdbID}">
                <div class="search-item-thumbnail">
                    <img src="${moviePoster}" alt="${movie.Title}">
                </div>
                <div class="search-item-info">
                    <h3>${movie.Title}</h3>
                    <p>${movie.Year}</p>
                </div>
            </div>
        `;
    }).join('');
    addMovieDetailsEvent();
}

function addMovieDetailsEvent() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            try {
                const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
                const movieDetails = await result.json();
                displayMovieDetails(movieDetails);
            } catch (error) {
                resultGrid.innerHTML = `<p class="error-message">An error occurred while fetching movie details. Please try again later.</p>`;
            }
        });
    });
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `
        <div class="movie-poster">
            <img src="${(details.Poster !== "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Ratings: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="writer"><b>Writer:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors:</b> ${details.Actors}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="language"><b>Language:</b> ${details.Language}</p>
            <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
        </div>
    `;
}

// Debounce the findMovies function to limit API calls
movieSearchBox.addEventListener('input', debounce(findMovies, 500));

// Hide search list when clicking outside
window.addEventListener('click', (event) => {
    if (event.target !== movieSearchBox) {
        searchList.classList.add('hide-search-list');
    }
});
