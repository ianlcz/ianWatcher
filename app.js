window.$ = window.jQuery = require('jquery')
let fs = require('fs')

fs.readdir(__dirname + '/movie_directory/', (err, files) => {
    if (err !== null) {
        console.log(err)
    }

    files.forEach((file) => {
        $('#movies').append($('<div/>').text(file))
    })
})