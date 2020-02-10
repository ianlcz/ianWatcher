import Helpers from "./Helpers.js"
const axios = require('axios')
const numeral = require('numeral')
const lang = `fr-FR`
const movieID = Helpers.getParam('id')

export default axios.defaults.baseURL = 'https://api.themoviedb.org/3'
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWVjYTNlYjkzNGM1OTVhMzJjYmQ1M2ExNmY3NmY2NCIsInN1YiI6IjVlMTRiMjQ0NTkwN2RlMDAxN2UzNTBmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3rgVxb3NRcm21JOCMa03Ic6_wHsM4-9m_u6YjxfDcxc"
axios.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'

numeral.register('locale', 'fr', {
    delimiters: {
        thousands: ' ',
        decimal: ','
    },
    abbreviations: {
        thousand: 'k',
        million: 'M',
        billion: 'Mrd',
        trillion: 'T'
    },
    ordinal: number => {
        return number === 1 ? 'er' : 'ème';
    },
    currency: {
        symbol: '€'
    }
})
numeral.locale('fr')

axios
    .get(`/movie/${movieID}?language=${lang}`)
    .then(response => {
        const data = response.data
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

        Helpers.id("production").src = Helpers.imageUrl(data.production_companies[productionIndex].logo_path)
        Helpers.id("production").alt = `Logo de ${data.production_companies[productionIndex].name}`

        if (data.runtime && data.vote_average && data.vote_count && data.budget && data.revenue) {
            Helpers.remplirElement("runtime", Helpers.formatRuntime(data.runtime))
            Helpers.remplirElement("vote_average", `${data.vote_average * 10}%`)
            Helpers.remplirElement("vote_count", numeral(data.vote_count).format('0a'))
            Helpers.remplirElement("budget", `${numeral(data.budget * 0.91).format('0a')} €`)
            Helpers.remplirElement("revenue", `${numeral(data.revenue * 0.91).format('0a')} €`)
        } else {
            Helpers.id("table").style.display = "none"
        }

        if (data.overview) {
            Helpers.remplirElement("overview", data.overview)
        } else {
            Helpers.id("head_overview").style.display = "none"
            Helpers.id("overview").style.display = "none"
        }

    })
    .catch(error => console.error(error))

axios
    .get(`/movie/${movieID}/credits?language=${lang}`)
    .then(response => {
        const data = response.data
        let l_director = []

        data.crew.map(item => {
            if (item.department === 'Directing' && item.job === 'Director') {
                l_director.push(item)
            }
        })

        Helpers.remplirElement('director_name', l_director.length !== 0 ? `${l_director.map(item => item.name).join(' et ')}` : Helpers.id("director").style.display = "none")
    })
    .catch(error => console.error(error))

axios
    .get(`/movie/${movieID}/videos?language=${lang}`)
    .then(response => {
        const data = response.data
        let l_trailer = []

        data.results.map(item => {
            if (item.type === "Trailer" && item.site === "YouTube" && item.name.includes('VF')) {
                l_trailer.push(item)
            }
        })

        if (l_trailer.length !== 0) {
            Helpers.id("body_trailer").src = `https://www.youtube.com/embed/${l_trailer[0].key}`
            Helpers.id("body_trailer").title = l_trailer[0].name
        } else {
            Helpers.id("head_trailer").style.display = "none"
            Helpers.id("body_trailer").style.display = "none"
        }
    })
    .catch(error => console.error(error))