let fs = require('fs')
let $HOME = require('home-path')

const movieArea = document.getElementById('movieArea')

function get_JSON_informations(url, callback)
{
    let req = new XMLHttpRequest()
    req.open("GET", url)
    req.addEventListener("load", () => {
        if (req.status >= 200 && req.status < 400) {
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    })
    req.addEventListener("error", () => {
        console.error("Erreur réseau avec l'URL " + url);
    })
    req.send(null)
}

fs.readdir($HOME + '/Movies/movies_storage/', (err, files) => {
    if (err !== null) {
        console.log(err)
    }

    files.forEach((file) => {
        let movieTitle = file.split('.')[0]
        let movieURL = ''.concat('https://api.themoviedb.org/3/search/movie?api_key=', APIKEY, '&query=', encodeURI(movieTitle), '&language=fr-FR')

        get_JSON_informations(movieURL, (reponse) => {
            let data = JSON.parse(reponse)
            let moviePoster = document.createElement('img')
            data.results.forEach((movie) => {
                if (movieTitle.toUpperCase() == movie.original_title.replace(/(:|,)/g, '').replace(/  /g, ' ').toUpperCase() || movieTitle.toUpperCase() == movie.title.replace(/(:|,)/g, '').replace(/  /g, ' ').toUpperCase())
                {
                    moviePoster.src = ''.concat("https://image.tmdb.org/t/p/original/", movie.poster_path)
                    moviePoster.alt = movie.title
                    moviePoster.title = movie.overview
                    moviePoster.id = 'poster'
                    movieArea.appendChild(moviePoster)
                }
            })
        })
    })
})
