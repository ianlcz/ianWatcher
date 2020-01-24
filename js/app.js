let filename = "Dark knight.mp4"
let movieName = filename.split('.')[0]
console.log(filename, movieName)
let url = ''.concat('https://api.themoviedb.org/3/search/movie?api_key=', APIKEY, '&query=', movieName, '&language=fr-FR')
const movieList = document.getElementById('movieList')

function get_JSON_informations(url, callback) {
    var req = new XMLHttpRequest();
    req.open("GET", url);
    req.addEventListener("load", function () {
        if (req.status >= 200 && req.status < 400) {
            callback(req.responseText);
        } else {
            console.error(req.status + " " + req.statusText + " " + url);
        }
    });
    req.addEventListener("error", function () {
        console.error("Erreur réseau avec l'URL " + url);
    });
    req.send(null);
}

get_JSON_informations(url, (reponse) => {
    let data = JSON.parse(reponse)

    console.log(data.results[0])
    console.log(data.results[0].genre_ids)

    let moviePoster = document.createElement('img')
    moviePoster.src = ''.concat("https://image.tmdb.org/t/p/original/", data.results[0].poster_path)
    moviePoster.title = data.results[0].overview
    moviePoster.id = 'poster'
    document.getElementById('movieList').appendChild(moviePoster)
})
