const Helpers = {
    getParam: name => {
        const param = new URLSearchParams(document.location.search)
        return param.get(name)
    },
    id: id => document.getElementById(id),
    remplirElement: (id, text) => {
        document.getElementById(id).innerText = text
    },
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