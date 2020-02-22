const Helpers = {
    getParam: name => {
        const param = new URLSearchParams(document.location.search)
        return param.get(name)
    },
    id: id => document.querySelector(`#${id}`),
    class: className => document.querySelector(`.${className}`),
    remplirElement: (id, text) => {
        document.getElementById(id).innerText = text
    },
    backdropUrl: path =>
        path ? `https://image.tmdb.org/t/p/original${path}` : "https://betravingknows.com/wp-content/uploads/2017/06/video-movie-placeholder-image-grey.png",
    posterUrl: path =>
        path ? `https://image.tmdb.org/t/p/original${path}` : "https://www.flixdetective.com/web/images/poster-placeholder.png",
    imageUrl: path => `https://image.tmdb.org/t/p/original${path}`,
    formatRuntime: minutes => {
        const nbHours = Math.floor(minutes / 60)
        const nbMinutes = minutes % 60
        if (nbHours === 0) return `${nbMinutes} min`
        else return `${nbHours} h ${nbMinutes.toString().padStart(2, "0")} min`
    },
    calculRate: (budget, revenue) => {
        return Math.round((revenue / budget - 1) * 100)
    },
    scrollingElement: element => {
        window.scroll(() => {
            window.scrollTop() >= Helpers.id(element).offsetTop ? Helpers.id(element).addClass("floatable") : Helpers.id(element).removeClass("floatable")
        })
    }
}

export default Helpers