class Caroussel {

    /**
     * This callback type is called `requestCallback` and is displayed as a global symbol.
     *
     * @callback moveCallback
     * @param {number} index
     */


    /**
     * @param {HTMLElement} element 
     * @param {Object} options
     * @param {Object} [options.slidesToScroll=1] Nombre d'éléments à faire défiler
     * @param {Object} [options.slidesVisible=1] Nombre d'éléments visibles dans un slide
     * @param {boolean} [options.loop=false] Doit-on boucler en fin de caroussel
     */
    constructor(element, options = {}) {
        this.element = element
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: false
        }, options)
        let children = [].slice.call(element.children)
        this.isMobile = false
        this.currentItem = 0
        this.root = this.createDivWithClass("caroussel")
        this.container = this.createDivWithClass("caroussel_container")
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.moveCallbacks = []
        this.items = children.map(child => {
            let item = this.createDivWithClass("caroussel_item")
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        })
        this.setStyle()
        this.createNavigation()
        this.moveCallbacks.forEach(callback => callback(0))
        /* window.addEventListener('resize', this.resize.bind(this)) */
    }

    /**
     * Applique les bonnes dimensions aux éléments du caroussel
     */
    setStyle() {
        if (window.outerWidth >= 770 && window.outerWidth <= 1100) {
            let ratio = (this.items.length / this.slidesVisible) + 0.52
            this.container.style.width = (ratio * 100) + "%"
            this.items.forEach(item => {
                item.style.width = ((100 / this.slidesVisible) / ratio) + "%"
                item.style.marginLeft = 0.5 + "em"
                item.style.marginRight = 0.5 + "em"
            })
        } else {
            let ratio = (this.items.length / this.slidesVisible) + 0.36
            this.container.style.width = (ratio * 100) + "%"
            this.items.forEach(item => {
                item.style.width = ((100 / this.slidesVisible) / ratio) + "%"
                item.style.marginLeft = 0.5 + "em"
                item.style.marginRight = 0.5 + "em"
            })
        }
    }

    createNavigation() {
        let nextButton = this.createDivWithClass('caroussel_next')
        let prevButton = this.createDivWithClass('caroussel_prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))
        if (this.options.loop === false) {
            return
        }
        this.onMove(index => {
            if (index === 0) {
                prevButton.classList.add("caroussel_prev--hidden")
            } else {
                prevButton.classList.remove("caroussel_prev--hidden")
            }
            if (this.items[this.currentItem + this.slidesVisible] === undefined) {
                nextButton.classList.add("caroussel_next--hidden")
            } else {
                nextButton.classList.remove("caroussel_next--hidden")
            }
        })
    }

    next() {
        this.goToItem(this.currentItem + this.slidesToScroll)
    }

    prev() {
        this.goToItem(this.currentItem - this.slidesToScroll)
    }

    /**
     * Déplace le caroussel vers l'élément ciblé
     * @param {number} index 
     */
    goToItem(index) {
        if (index < 0) {
            index = this.items.length - this.options.slidesVisible
        } else if (index >= this.items.length || (this.items[this.currentItem + this.options.slidesVisible] === undefined && index > this.currentItem)) {
            index = 0
        }
        let translateX = index * -100 / this.items.length
        this.container.style.transform = `translate3d(${translateX}%, 0, 0)`
        this.currentItem = index
        this.moveCallbacks.forEach(callback => callback(index))
    }

    /**
     * 
     * @param {moveCallback} callback 
     */
    onMove(callback) {
        this.moveCallbacks.push(callback)
    }

    /**
     * 
     * @param {string} className 
     * @returns {HTMLElement}
     */
    createDivWithClass(className) {
        const div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }

    /**
     * @returns {number}
     */
    get slidesToScroll() {
        return this.isMobile ? 1 : this.options.slidesToScroll
    }

    /**
     * @returns {number}
     */
    get slidesVisible() {
        return this.isMobile ? 1 : this.options.slidesVisible
    }
}

module.exports = Caroussel