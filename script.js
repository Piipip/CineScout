const apiKey = '9da4379f04dd8554435bc544bb6db134'; // Replace with your actual TMDB API key

const searchBtn = document.getElementById('search-btn');
const movieList = document.getElementById('movie');
const movieDetailsContent = document.querySelector('.movie-details-content');
const movieCloseBtn = document.getElementById('movie-close-btn');

// Event listeners
searchBtn.addEventListener('click', getMovieList);
movieList.addEventListener('click', function(e) {
    if (e.target.classList.contains('movie-btn')) {
        e.preventDefault();
        let movieItem = e.target.parentElement.parentElement;
        getMovieDetails(movieItem.dataset.id);
    }
});

movieCloseBtn.addEventListener('click', () => {
    movieDetailsContent.parentElement.classList.remove('showRecipe');
});

// Function to fetch movie list based on search input
function getMovieList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if (data.results && data.results.length > 0) {
            data.results.forEach(movie => {
                html += `
                    <div class="movie-item" data-id="${movie.id}">
                        <div class="movie-img">
                            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
                        </div>
                        <div class="movie-name">
                            <h3>${movie.title}</h3>
                            <a href="#" class="movie-btn">Get Details</a>
                        </div>
                    </div>
                `;
            });
            movieList.classList.remove('notFound');
        } else {
            html = "Sorry, we didn't find any movies!";
            movieList.classList.add('notFound');
        }

        movieList.innerHTML = html;
    })
    .catch(error => {
        console.error('Error fetching movie list:', error);
        // Handle error gracefully, e.g., display an error message to the user
    });
}

// Function to fetch and display movie details
function getMovieDetails(id) {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=$9da4379f04dd8554435bc544bb6db134&append_to_response=credits,videos`)
    .then(response => response.json())
    .then(data => displayMovieDetails(data))
    .catch(error => {
        console.error('Error fetching movie details:', error);
        // Handle error gracefully, e.g., display an error message to the user
    });
}

// Function to display movie details in a modal-like view
function displayMovieDetails(movie) {
    let html = `
        <h2 class="movie-title">${movie.title}</h2>
        <p class="movie-genre">${movie.genres.map(genre => genre.name).join(', ')}</p>
        <div class="movie-deets">
            <h3>Overview:</h3>
            <p>${movie.overview}</p>
        </div>
        <div class="movie-img">
            <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}">
        </div>
    `;

    if (movie.videos.results.length > 0) {
        html += `
            <div class="movie-link">
                <a href="https://www.youtube.com/watch?v=${movie.videos.results[0].key}" target="_blank">Watch Trailer</a>
            </div>
        `;
    }

    movieDetailsContent.innerHTML = html;
    movieDetailsContent.parentElement.classList.add('showMovie');
}
