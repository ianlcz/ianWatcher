import Helpers from "./Helpers.js"
const axios = require('axios')
const numeral = require('numeral')
const Caroussel = require('../classes/Caroussel')
const lang = "fr-FR"
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
        billion: 'Mdr',
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
        let l_production = []
        let l_mainProduction = []

        document.title = `ianWatcher | ${data.title}`

        Helpers.class("backdrop").style.backgroundImage = `url(${Helpers.backdropUrl(data.backdrop_path)})`
        Helpers.class("backdrop").style.color = `#0B366D`
        Helpers.class("backdrop").style.boxShadow = `inset 0 0 0 100vh #6088BCD6`
        Helpers.id("poster").src = Helpers.posterUrl(data.poster_path)
        Helpers.id("poster").alt = `Affiche du film: ${data.title}`
        Helpers.remplirElement('title', data.title)
        Helpers.remplirElement('release_date', `(${Helpers.getParam('yearFR')})`)
        Helpers.remplirElement('genres', data.genres.map(item => item.name).join(', '))

        data.production_companies.map(item => {
            if (item.logo_path) {
                l_production.push(item)
            }
        })

        if (l_production.length === 0) {
            Helpers.id("production").style.display = "none"
        } else {
            if (l_production[0].name.includes("Marvel Studios") || l_production[0].name.includes("Syncopy")) {
                Helpers.id("production").src = Helpers.imageUrl(l_production[0].logo_path)
                Helpers.id("production").alt = `Logo de ${l_production[0].name}`
            } else {
                let minimumIndex = l_production[0].id
                l_production.map(item => {
                    if (item.id <= minimumIndex) {
                        minimumIndex = item.id
                        l_mainProduction.pop()
                        l_mainProduction.push(item)
                    }
                })
                Helpers.id("production").src = Helpers.imageUrl(l_mainProduction[0].logo_path)
                Helpers.id("production").alt = `Logo de ${l_mainProduction[0].name}`
            }
        }

        if (data.runtime && data.vote_average && data.budget && data.revenue) {
            Helpers.remplirElement("runtime", data.runtime ? Helpers.formatRuntime(data.runtime) : "Aucune")
            Helpers.remplirElement("vote_average", data.vote_average ? `${data.vote_average * 10}%` : "Aucun")
            Helpers.remplirElement("vote_count", `(${numeral(data.vote_count).format('0a')} votes)`)
            if (data.budget) {
                Helpers.remplirElement("budget_value", `${numeral(data.budget * 0.91).format('0a')} €`)
                Helpers.remplirElement("benefits", Helpers.calculRate(data.budget, data.revenue) > 0 ? `(+${Helpers.calculRate(data.budget, data.revenue)}%)` : `(${Helpers.calculRate(data.budget, data.revenue)} %)`)
            } else {
                Helpers.id("budget").style.display = "none"
                Helpers.id("budget_value").style.display = "none"
                Helpers.id("benefits").style.display = "none"
            }
            Helpers.remplirElement("revenue_value", `${numeral(data.revenue * 0.91).format('0a')} €`)

            if (Helpers.calculRate(data.budget, data.revenue) < 100) {
                Helpers.id("benefits").style.color = "#6D6D36"
            }
            if (Helpers.calculRate(data.budget, data.revenue) < 50) {
                Helpers.id("benefits").style.color = "#6D0B36"
            }
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
        let l_composer = []
        let l_actor = []


        data.crew.map(item => {
            /* On recherche le ou les réalisateurs du film */
            if (item.department === 'Directing' && item.job === 'Director') {
                l_director.push(item)
            }
            /* On recherche le compositeur de la bande originale */
            if (item.department === "Sound" && item.job === "Original Music Composer") {
                l_composer.push(item)
            }
        })

        if (l_director.length === 0) {
            Helpers.remplirElement('director_name', Helpers.id("director").style.display = "none")
        } else if (l_director.length === 1) {
            Helpers.remplirElement("director_name", l_director[0].name)
        } else if (l_director[1].name.includes(l_director[0].name.split(' ')[1])) {
            Helpers.remplirElement('director_name', `${l_director.map(item => item.name.split(' ')[0]).join(' et ')} ${l_director[0].name.split(' ')[1]}`)
        } else {
            Helpers.remplirElement('director_name', l_director.map(item => item.name).join(' et '))
        }

        Helpers.remplirElement('composer_name', l_composer.length !== 0 ? l_composer.map(item => item.name).join(' et ') : Helpers.id("composer").style.display = "none")

        /* On ajoute le casting */
        data.cast.map(item => {
            if (item.profile_path) {
                l_actor.push(item)
            }
        })

        if (l_actor.length >= 8) {
            for (let actorIndex = 0; actorIndex < 8; actorIndex++) {
                let actorDiv = document.createElement("div")
                actorDiv.className = "actor_field"
                let actorPicture = document.createElement("img")
                actorPicture.src = Helpers.imageUrl(l_actor[actorIndex].profile_path)
                actorPicture.alt = `Image de ${l_actor[actorIndex].name}`
                actorPicture.id = "actor_picture"
                let actorDetail = document.createElement("div")
                actorDetail.id = "actor_detail"
                let actorName = document.createElement("h3")
                actorName.innerText = l_actor[actorIndex].name
                actorName.id = "actor_name"
                Helpers.id("body_distribution").appendChild(actorDiv)
                actorDiv.appendChild(actorPicture)
                actorDiv.appendChild(actorDetail)
                actorDetail.appendChild(actorName)

                if (l_actor[actorIndex].character) {
                    let actorCharacter = document.createElement("p")
                    actorCharacter.innerText = l_actor[actorIndex].character
                    actorCharacter.id = "actor_character"
                    Helpers.id("body_distribution").appendChild(actorDiv)
                    actorDetail.appendChild(actorCharacter)
                } else {
                    actorDetail.style.height = "2em"
                }
            }
            new Caroussel(Helpers.id('body_distribution'), {
                slidesToScroll: 2,
                slidesVisible: 4,
                loop: true
            })

            let prevButton = Helpers.class("caroussel_prev")
            let nextButton = Helpers.class("caroussel_next")
            let prevIcon = document.createElement("i")
            let nextIcon = document.createElement("i")
            prevIcon.className = "fas fa-angle-left fa-lg"
            nextIcon.className = "fas fa-angle-right fa-lg"
            prevButton.appendChild(prevIcon)
            nextButton.appendChild(nextIcon)
        } else {
            Helpers.id("head_distribution").style.display = "none"
        }
    })
    .catch(error => console.error(error))



axios
    .get(`/movie/${movieID}/videos?language=${lang}`)
    .then(response => {
        const data = response.data
        let l_trailer = []
        let v_trailer = ''

        data.results.map(item => {
            if (item.type === "Trailer" && item.site === "YouTube" && item.name.includes('VF')) {
                l_trailer.push(item)
            }
        })

        if (l_trailer.length !== 0) {
            v_trailer = l_trailer[Math.floor(Math.random() * Math.floor(l_trailer.length))]
            Helpers.id("body_trailer").src = `https://www.youtube.com/embed/${v_trailer.key}`
            Helpers.id("body_trailer").title = v_trailer.name
        } else {
            Helpers.id("head_trailer").style.display = "none"
            Helpers.id("body_trailer").style.display = "none"
        }
    })
    .catch(error => console.error(error))