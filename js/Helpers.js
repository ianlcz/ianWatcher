const Helpers = {
    getParam: name => {
        const param = new URLSearchParams(document.location.search)
        return param.get(name)
    },
    id: id => document.getElementById(id),
    remplirElement: (id, text) => {
        document.getElementById(id).innerText = text
    },
    imageUrl: path => `https://image.tmdb.org/t/p/original${path}`
}

export default Helpers