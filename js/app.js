let filename = "Avengers Infinity War.mp4"
let movieTitle = filename.split('.')[0]
let url = ''.concat('https://api.themoviedb.org/3/search/movie?api_key=', APIKEY, '&query=', movieTitle, '&language=fr-FR')
const movieList = document.getElementById('movieList')

function get_JSON_informations(url, callback)
{
    var req = new XMLHttpRequest()
    req.open("GET", url)
    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400)
        {
            callback(req.responseText)
        } else
        {
            console.error(req.status + " " + req.statusText + " " + url)
        }
    })
    req.addEventListener("error", () => {
        console.error("Erreur réseau avec l'URL " + url)
    });
    req.send(null)
}


get_JSON_informations(url, (reponse) => {
    let data = JSON.parse(reponse)
    let moviePoster = document.createElement('img')
    data.results.forEach((movie) => {
        if (movieTitle.toUpperCase() == movie.original_title.replace(/( - |:| :|,)/g, '').toUpperCase() || movieTitle.toUpperCase() == movie.title.replace(/( - |:| :|,)/g, '').toUpperCase())
        {
            moviePoster.src = ''.concat("https://image.tmdb.org/t/p/original/", movie.poster_path)
            moviePoster.title = movie.overview
        }
    })
    moviePoster.id = 'poster'
    document.getElementById('movieList').appendChild(moviePoster)
})
