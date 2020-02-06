import APIKEY from "./key.js"

const axios = require('axios')
const fs = require('fs')
const $HOME = require('home-path')
const movieArea = document.getElementById('movieArea')

const compareValues = (key, order = 'asc') => {
    return (a, b) => {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            return 0
        }

        const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key]
        const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key]
        let comparison = (varA > varB ? 1 : -1)

        return (order == 'desc' ? comparison * -1 : comparison)
    }
}

fs.readdir($HOME + '/Movies/movies_storage/', (error, files) => {
    if (!files.length) {
        console.log("Le dossier est vide !")
    } else {
        files.forEach(file => {
            let filename = file.split('.')[0]

            if (filename) {
                axios
                    .get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&query=${encodeURI(filename)}&language=fr-FR`)
                    .then(response => {
                        let movieLink = document.createElement('a')
                        let moviePoster = document.createElement('img')

                        response.data.results.sort(compareValues('popularity'))
                        response.data.results.forEach(movie => {
                            if (filename.toUpperCase() === movie.original_title.replace(/(:|,)/g, '').replace(/  /g, ' ').toUpperCase() || filename.toUpperCase() === movie.title.replace(/(:|,)/g, '').replace(/  /g, ' ').toUpperCase()) {
                                movieLink.href = `./html/detail.html?id=${movie.id}`
                                moviePoster.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`
                                moviePoster.alt = "Affiche de " + movie.title
                                moviePoster.title = movie.overview
                                moviePoster.className = 'poster'
                                movieArea.appendChild(movieLink)
                                movieLink.appendChild(moviePoster)
                            }
                        })
                    })
                    .catch(error => console.error(error));
            }
        })
    }
})