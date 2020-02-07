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
        document.title = `ianMovie | ${data.title}`
        Helpers.id("backdrop").style.backgroundImage = `url(${Helpers.imageUrl(data.backdrop_path)})`
        Helpers.id("backdrop").style.backgroundColor = `#6088BC`
    })
    .catch(error => console.error(error))