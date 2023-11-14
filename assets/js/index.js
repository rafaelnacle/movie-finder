import { displayWatchlist } from './watchlist.js'

const searchInput = document.getElementById('search-input')
const movieSectionEl = document.getElementById('movie-section')

document.addEventListener('click', (event) => {
  if (event.target.id === 'search-btn') {
    getMovies()
  }
})

export async function renderMovies(moviePromises, isWatchlist = false) {
  const movies = await Promise.all(moviePromises)

  const movieSectionEl = document.getElementById(isWatchlist ? 'watchlist-section' : 'movie-section')

  movieSectionEl.innerHTML = ``

  for (let movie of movies) {
    movieSectionEl.innerHTML += `
    <div class="movies">
      <aside>
        <img class="poster" src='${movie.Poster}'>
      </aside>

      <div class="movie-wrapper">
        <header>
          <div class="movie-title-wrapper">
            <h3>${movie.Title}</h3>
            <div class="imdb">
              <img class="star-icon" src='/assets/images/star.svg'>
              <p>${movie.imdbRating}</p>
            </div>
          </div>
          <div class="movie-info-wrapper">
            <p>${movie.Runtime}</p>
            <p>${movie.Genre}</p>
            <button id='add-btn-${movie.imdbID}' class="watchlist-button" data-name=${movie.imdbID}>
              <img class="add-icon" src=${isWatchlist ? '/assets/images/minus-icon.svg' : '/assets/images/plus-icon.svg'}>
              <p>${isWatchlist ? 'Remove' : 'Add to Watchlist'}</p>
            </button>
          </div>
        </header>
    
        <main>
          <p class="plot-text">${movie.Plot}</p>
        </main>
      </div>
    </div>
  `
  }

  const addToWatchlistButtons = document.querySelectorAll('.watchlist-button')

  addToWatchlistButtons.forEach(button => {
    button.addEventListener('click', () => {
      const movieId = button.dataset.name
      isWatchlist ? removeFromWatchList(movieId) : addToWatchlist(movieId)
    })
  })
}

async function getMovies() {
  if (searchInput.value !== "") {
    const res = await fetch(`https://www.omdbapi.com/?s=${searchInput.value}&type=movie&apikey=c6881473`)
    if (!res.ok) {
      throw Error('Oops, something went wrong!')
    }

    const data = await res.json()

    if (data.Response == 'True') {
      getMoviesList(data)
    } else {
      renderErrorMessage()
    }
  } else {
    renderErrorMessage()
  }
}

function renderErrorMessage() {
  movieSectionEl.innerHTML = `
    <div class="error-message">
        <h4>Unable to find what you're looking for. Please try another search</h4>
    </div>`
}

function getMoviesList(data) {
  let movies = data.Search
  searchInput.value = ''

  const movieIdsArr = movies.map((movie) => {
    return movie.imdbID
  })

  const movieInfo = movieIdsArr.map(async (item) => {
    const res = await fetch(`https://www.omdbapi.com/?i=${item}&type=movie&apikey=c6881473`)
    const data = await res.json()

    return data
  })

  renderMovies(movieInfo)
}

function showCustomAlert(message) {
  const modal = document.getElementById('custom-alert-modal')
  const messageEl = document.getElementById('custom-alert-message')

  messageEl.textContent = message;

  modal.style.display = 'block'

  const closeBtn = document.querySelector('.close')
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none'
  })

  setTimeout(() => {
    modal.style.display = 'none';
  }, 3000)
}

function addToWatchlist(movieId) {
  const watchList = JSON.parse(localStorage.getItem('watchlist')) || []

  if (!watchList.includes(movieId)) {
    watchList.push(movieId)

    localStorage.setItem('watchlist', JSON.stringify(watchList))

    showCustomAlert('Movie added to Watchlist!')
    displayWatchlist()
  } else {
    showCustomAlert('Movie is already in Watchlist!')
  }
}

function removeFromWatchList(movieId) {
  let watchList = JSON.parse(localStorage.getItem('watchlist')) || []

  if (watchList.includes(movieId)) {
    watchList = watchList.filter((id) => id !== movieId)
    localStorage.setItem('watchlist', JSON.stringify(watchList))

    showCustomAlert('Movie removed from Watchlist!')
    displayWatchlist()
  }
}