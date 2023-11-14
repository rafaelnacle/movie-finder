import { renderMovies } from "./index.js"

document.addEventListener('DOMContentLoaded', async () => {
  await displayWatchlist();
});

export async function displayWatchlist() {
  const movieSectionEl = document.getElementById('watchlist-section')
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || []

  if (watchlist.length > 0) {
    let watchlistMovies = await Promise.all(watchlist.map(async (movieId) => {
      const res = await fetch(`https://www.omdbapi.com/?i=${movieId}&type=movie&apikey=c6881473`)
      const data = await res.json()

      return data
    }))

    renderMovies(watchlistMovies, true) //Use true to indicate it's the watchlist
  } else {
    movieSectionEl.innerHTML = `
    <div class="placeholder-img-wrapper">
      <h3>Your watchlist looks a little empty...</h3>
      <div class="placeholder-empty-wrapper">
        <a href="/index.html">
          <img src="./assets/images/plus-icon.svg" alt="">
          <h4>Let's add some movies!</h4>
        </a>
      </div>
    </div>
    `
  }
}
