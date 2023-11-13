const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')
const movieSectionEl = document.getElementById('movie-section')
const key = ''

searchBtn.addEventListener('click', getMovies)

async function getMovies() {
  if (searchInput.value !== "") {
    const res = await fetch(`https://www.omdbapi.com/?s=${searchInput.value}&type=movie&apikey=${key}`)
    if (!res.ok) {
      throw Error('Oops, something went wrong!')
    }

    const data = await res.json()

    if (data.Response == 'True') {
      getMoviesList(data)
    }
  }
}

function getMoviesList(data) {
  let movies = data.Search
  searchInput.value = ''

  const movieIdsArr = movies.map((movie) => {
    return movie.imdbID
  })

  const movieInfo = movieIdsArr.map(async (item) => {
    const res = await fetch(`https://www.omdbapi.com/?i=${item}&type=movie&apikey=${key}`)
    const data = await res.json()

    return data
  })

  renderMovies(movieInfo)
}

async function renderMovies(moviePromises) {
  const movies = await Promise.all(moviePromises)

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
            <button id='add-btn' class="watchlist-button" data-name=${movie.imdbID}>
              <img class="add-icon" src='/assets/images/plus-icon.svg'>
              <p>Watchlist</p>
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

  const addToWatchlistButtons = document.querySelectorAll('#add-btn')

  addToWatchlistButtons.forEach(button => {
    button.addEventListener('click', () => {
      const movieId = button.dataset.name

      addToWatchlist(movieId)
    })
  })
}

function addToWatchlist(movieId) {
  const watchList = JSON.parse(localStorage.getItem('watchlist')) || []

  if (!watchList.includes(movieId)) {
    watchList.push(movieId)

    localStorage.setItem('watchlist', JSON.stringify(watchList))

    showCustomAlert('Movie added to Watchlist!')
  } else {
    showCustomAlert('Movie is already in Watchlist!')
  }
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