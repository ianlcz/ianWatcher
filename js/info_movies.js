import Helpers from "./Helpers.js"
const axios = require('axios')
const lang = `fr-FR`

export default axios.defaults.baseURL = 'https://api.themoviedb.org/3'
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWVjYTNlYjkzNGM1OTVhMzJjYmQ1M2ExNmY3NmY2NCIsInN1YiI6IjVlMTRiMjQ0NTkwN2RlMDAxN2UzNTBmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3rgVxb3NRcm21JOCMa03Ic6_wHsM4-9m_u6YjxfDcxc"
axios.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

const movieID = Helpers.getParam('id')

axios
    .get(`/movie/${movieID}?language=${lang}`)
    .then(response => {
        const data = response.data
        const picture = document.createElement("img")
        let productionIndex = 0

        document.title = `ianMovies | ${data.title}`

        Helpers.id("backdrop").style.backgroundImage = `url(${Helpers.imageUrl(data.backdrop_path)})`
        Helpers.id("backdrop").style.backgroundColor = `#6088BC`
        Helpers.id("poster").src = Helpers.imageUrl(data.poster_path)
        Helpers.id("poster").alt = `Affiche du film: ${data.title}`
        Helpers.remplirElement('title', data.title)
        Helpers.remplirElement('release_date', `(${data.release_date.split('-')[0]})`)
        Helpers.remplirElement('genres', data.genres.map(item => item.name).join(', '))
        
        while (!data.production_companies[productionIndex].logo_path) {
            productionIndex += 1
        }

        picture.src = Helpers.imageUrl(data.production_companies[productionIndex].logo_path)
        picture.alt = `Logo de ${data.production_companies[productionIndex].name}`
        picture.style.height = "30px"
        Helpers.id("productions").appendChild(picture)
    })
    .catch(error => console.error(error))