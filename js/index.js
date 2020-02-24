const fs = require('fs')
const $HOME = require('home-path')
const movieGrid = document.getElementById('movieGrid')

const axios = require('axios')
const lang = "fr-FR"

export default axios.defaults.baseURL = 'https://api.themoviedb.org/3'
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWVjYTNlYjkzNGM1OTVhMzJjYmQ1M2ExNmY3NmY2NCIsInN1YiI6IjVlMTRiMjQ0NTkwN2RlMDAxN2UzNTBmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3rgVxb3NRcm21JOCMa03Ic6_wHsM4-9m_u6YjxfDcxc"
axios.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

let fileTab = []

const rewrite_movies_title = string => {
    return encodeURIComponent(string.replace(/[:,]/g, '').replace(/  /g, ' ').replace('œ', 'oe').replace(/[^a-zA-Z0-9-' ]/g, '')).replace(/\'/g, "%27").toUpperCase()
}

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

/* On indique dans la fonction readdir le chemin du dossier que l'on souhaite ouvrir */
fs.readdir($HOME + '/Movies/movies_storage/', (error, files) => {
    if (!files.length) {
        document.querySelector(".searchArea").style.display = "none"
        let alertTitle = document.createElement("h1")
        let alertBody = document.createElement("p")
        movieGrid.style.display = "block"
        movieGrid.style.padding = "1em"
        movieGrid.style.position = "absolute"
        movieGrid.style.top = "50%"
        movieGrid.style.left = "50%"
        movieGrid.style.transform = "translate(-50%, -50%)"
        movieGrid.style.width = "40%"
        movieGrid.style.background = "white"
        movieGrid.style.borderRadius = "20px"
        movieGrid.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)"
        alertTitle.innerHTML = "Le répertoire de stockage est vide !"
        alertTitle.style.fontFamily = "Ubuntu Medium"
        alertTitle.style.fontSize = "larger"
        alertBody.innerHTML = `Veuillez ajouter des films dans le répertoire</br><b>${$HOME + '/Movies/movies_storage/'}</b>`
        alertBody.style.textAlign = "center"
        movieGrid.appendChild(alertTitle)
        movieGrid.appendChild(alertBody)
    } else {
        files.forEach(file => {
            let filename = file.toString("utf8").split('.')[0]
            if (filename) {
                fileTab.push(filename)
            }
        })
    }
    fileTab.forEach(item => {
        const movie_name = item.split(" | ")[0]
        const movie_year = item.split(" | ")[1]
        const url = `/search/movie?language=${lang}&query=${rewrite_movies_title(movie_name)}`
        axios
            .get(!movie_year ? url : url + `&year=${movie_year}`)
            .then(response => {
                const movieLink = document.createElement('a')
                const moviePoster = document.createElement('img')
                response.data.results.sort(compareValues('popularity'))
                response.data.results.forEach(movie => {
                    if (rewrite_movies_title(movie_name) === rewrite_movies_title(movie.original_title) || rewrite_movies_title(movie_name) === rewrite_movies_title(movie.title)) {
                        movieLink.href = `./html/detail.html?id=${movie.id}`
                        moviePoster.src = movie.poster_path ? `https://image.tmdb.org/t/p/original${movie.poster_path}` : "https://www.flixdetective.com/web/images/poster-placeholder.png"
                        moviePoster.alt = `Affiche de ${movie.title}`
                        moviePoster.title = movie.overview
                        moviePoster.className = 'poster'
                        movieGrid.appendChild(movieLink)
                        movieLink.appendChild(moviePoster)
                    }
                })
            })
            .catch(error => console.error(error))
    })
})