import parseCssTransition from 'parse-css-transition'

const mixin = {
    methods: {
        $smoothReflow(options) {
            let _addElement = addElement.bind(this)
            if (Array.isArray(options))
                options.forEach(_addElement)
            else
                _addElement(options)
        },
        $unsmoothReflow(options) {
            let _removeElement = removeElement.bind(this)
            if (Array.isArray(options))
                options.forEach(_removeElement)
            else
                _removeElement(options)
        },
    },
    created() {
        this._smoothElements = []
        this._endListener = event => {
            for (let smoothEl of this._smoothElements) {
                smoothEl.endListener(event)
            }
        }
    },
    mounted() {
        this.$el.addEventListener('transitionend', this._endListener, { passive: true })
    },
    destroyed() {
        this.$el.removeEventListener('transitionend', this._endListener)
    },
    beforeUpdate() {
        for (let smoothEl of this._smoothElements) {
            smoothEl.setBeforeValues()
        }
    },
    async updated() {
        await this.$nextTick()
        for (let smoothEl of this._smoothElements) {
            smoothEl.doSmoothReflow()
        }
    }
}

// 'this' is vue component
function addElement(option = {}) {
    let $componentEl = this.$el
    if (!option.hasOwnProperty('el')) {
        option.el = $componentEl
    }
    this._smoothElements.push(new SmoothElement(option, $componentEl))
}

// 'this' is vue component
function removeElement(option) {
    let root = this.$el
    let index = this._smoothElements.findIndex(d => {
        return select(root, d.el) === select(root, option.el)
    })
    if (index == -1) {
        console.error("VSR_ERROR: $unsmoothReflow failed due to invalid el option")
        return
    }
    this._smoothElements.splice(index, 1)
}

function select(rootEl, el) {
    if (typeof el === 'string')
        return rootEl.matches(el) ? rootEl : rootEl.querySelector(el)
    else
        return el
}

const STATES = {
    INACTIVE: 'INACTIVE',
    ACTIVE: 'ACTIVE'
}

class SmoothElement {
    constructor(options, $componentEl) {
        options = {
            // Element or selector string.
            el: null,
            // Valid values: height, width, position
            property: 'height',
            // User can specify a transition if they don't want to use CSS
            transition: '.5s',
            // Selector string that will emit a transitionend event.
            // Note that commas a valid in a CSS selector, so you can
            // specify multiple transitionend event emitters.
            transitionEvent: null,
            // Hide scrollbar during transition.
            hideScrollbar: true,
            debug: false,
            ...options
        }
        let internalState = {
            $componentEl,
            $smoothEl: null, // Resolved Element from el
            // Resolved properties from property
            properties: this.parsePropertyOption(options.property),
            hasExistingTransition: false,
            beforeRect: {},
            afterRect: {},
            state: STATES.INACTIVE,
        }
        Object.assign(this, { options }, internalState)
        this.endListener = this.endListener.bind(this)
    }
    transition(to) {
        this.state = to
    }
    parsePropertyOption(property) {
        let properties = []
        if (typeof property === 'string') {
            properties.push(property)
        } else if (Array.isArray(property)) {
            properties = property
        } else {
            console.error('Invalid value for the "property" option.')
        }
        return properties
    }
    // Retrieve registered element on demand
    // El could have been hidden by v-if/v-show
    findRegisteredEl() {
        let { $componentEl, options } = this
        return select($componentEl, options.el)
    }
    /**
     * Indicates if the smooth transition increased or decreased the elements prop value
     * VSR works normally on a truthy conditional render because...
     * During a truthy render, the element exists immediately
     * During a falsy render, the element only disappears after the transition.
     */
    isTruthyRender(eventProperty) {
        let { beforeRect, afterRect, properties } = this
        // There's no way to determine the truthiness
        // of a transform
        if (eventProperty === 'transform') {
            return true
        }
        return afterRect[eventProperty] - beforeRect[eventProperty] <= 0
    }
    setBeforeValues() {
        let $smoothEl = this.findRegisteredEl()
        // This property could be set by a previous update
        // Reset it so it doesn't affect the current update
        this.afterRect = {}
        let beforeRect = {}
        if ($smoothEl) {
            beforeRect = $smoothEl.getBoundingClientRect()
        } else {
            for (let prop of this.properties) {
                beforeRect[prop] = 0
            }
        }
        this.beforeRect = beforeRect
        if (this.state === STATES.ACTIVE) {
            this.stopTransition()
            this.log('Transition was interrupted.')
        }
    }
    didValuesChange(properties, beforeRect, afterRect) {
        return properties.some(prop => {
            if (prop === 'position') {
                return beforeRect['top'] !== afterRect['top'] ||
                       beforeRect['left'] !== afterRect['left']
            } else {
                return beforeRect[prop] !== afterRect[prop]
            }
        })
    }
    doSmoothReflow(triggeredBy = 'data update') {
        let $smoothEl = this.findRegisteredEl()
        if (!$smoothEl) {
            this.log("Could not find registered el.")
            this.transition(STATES.INACTIVE)
            return
        }
        let { beforeRect, properties, options } = this

        this.$smoothEl = $smoothEl
        this.transition(STATES.ACTIVE)

        //$smoothEl.addEventListener('transitionend', this.endListener, { passive: true })
        this.log(`Reflow triggered by: ${triggeredBy}`)
        // If this.afterRect is set, that means doSmoothReflow() was called after
        // a nested transition finished. This check is made to ensure that
        // a height transition only occurs on a falsy conditional render,
        // a.k.a. an element is being hidden rather than shown.
        let afterRect = $smoothEl.getBoundingClientRect()
        this.afterRect = afterRect

        if (!this.didValuesChange(properties, beforeRect, afterRect)) {
            this.log(`Property values did not change.`)
            this.transition(STATES.INACTIVE)
            return
        }
        this.log('beforeRect', beforeRect)
        this.log('afterRect', afterRect)

        let computedStyle = window.getComputedStyle($smoothEl)
        // let parsedTransition = parseCssTransition(computedStyle.transition)
        // if (this.hasPropertyTransition(parsedTransition)) {
        //     this.hasExistingTransition = true
        // } else {
        //     this.hasExistingTransition = false
        //     this.addHeightTransition(parsedTransition, options.transition)
        // }

        if (options.hideScrollbar) {
            //save overflow properties before overwriting
            let overflowY = computedStyle.overflowY,
                overflowX = computedStyle.overflowX

            this.overflowX = overflowX
            this.overflowY = overflowY

            $smoothEl.style.overflowX = 'hidden'
            $smoothEl.style.overflowY = 'hidden'
        }

        for (let prop of properties) {
            if (prop === 'position') {
                let invertLeft = beforeRect['left'] - afterRect['left']
                var invertTop = beforeRect['top'] - afterRect['top']
                $smoothEl.style.transform = `translate(${invertLeft}px, ${invertTop}px)`
            } else {
                $smoothEl.style[prop] = beforeRect[prop] + 'px'
            }
        }
        $smoothEl.offsetHeight // Force reflow

        this.addHeightTransition([], options.transition)

        for (let prop of properties) {
            if (prop === 'position') {
                $smoothEl.style.transform = ''
            } else {
                $smoothEl.style[prop] = afterRect[prop] + 'px'
            }
        }
    }
    hasPropertyTransition(parsedTransition) {
        return parsedTransition.find(t => {
            return ['all','height'].includes(t.name) && t.duration > 0
        })
    }
    // Delay and Duration are in milliseconds
    // Add height transition to existing transitions.
    addHeightTransition(parsedTransition, transition) {
        let transitions = parsedTransition.map(t => {
            return `${t.name} ${t.duration}ms ${t.timingFunction} ${t.delay}ms`
        })
        this.$smoothEl.style.transition = [...transitions, transition].join(',')
    }
    endListener(event) {
        let { $smoothEl } = this
        let $targetEl = event.target
        let { properties } = this
        // Transition on smooth element finished
        if ($smoothEl === $targetEl) {
            // The transition property is one that was registered
            if (properties.includes(event.propertyName)) {
                this.stopTransition()
                // Record the height AFTER the data change, but potentially
                // BEFORE any transitionend events.
                // Useful for cases like transition mode="out-in"
                this.setBeforeValues()
            }
        }
        // Transition on element INSIDE smooth element finished
        // isTruthyRender <= 0 prevents calling doSmoothReflow during a
        // transition that increases height.
        // solves the case where a nested transition duration is
        // shorter than the height transition duration, causing doSmoothReflow
        // to reflow in the middle of the height transition
        else if (this.isRegisteredEventEmitter($smoothEl, event)) {
            this.doSmoothReflow('transition event')
        }
    } // Check if we should perform doSmoothReflow()
    // after a transitionend event.
    isRegisteredEventEmitter($smoothEl, event) {
        let $targetEl = event.target
        let { transitionEvent } = this.options
        if (transitionEvent === null) {
            return false
        }
        // If the $smoothEl hasn't registered 'position'
        // then we don't need to keep track of transitionend
        // events that occur outside the $smoothEl
        let { properties } = this
        let hasPositionProp = false
        for (let prop of properties) {
            if (prop === 'position') {
                hasPositionProp = true
                break
            }
        }
        // Checks if $targetEl IS or WAS a descendent
        // of $smoothEl.
        let smoothElContainsTarget = false
        for (let el of event.path) {
            if ($smoothEl === el) {
                smoothElContainsTarget = true
                break
            }
        }

        if (!hasPositionProp && !smoothElContainsTarget) {
            return false
        }

        let { selector, propertyName } = transitionEvent
        // coerce null check to also check for undefined.
        if (selector != null && !$targetEl.matches(selector)) {
            return false
        }
        if (propertyName != null && propertyName !== event.propertyName) {
            return false
        }
        // if (propertyValue != null) {
        //     let val = window.getComputedStyle($targetEl)[propertyName]
        //     console.log(window.getComputedStyle($targetEl))
        //     console.log(val, propertyValue)
        //     if (val != propertyValue) {
        //         return false
        //     }
        // }
        return true
    }
    stopTransition() {
        let {
            $smoothEl, options, overflowX, overflowY,
            properties, hasExistingTransition,
        } = this
        // Change prop back to auto
        for (let prop of properties) {
            $smoothEl.style[prop] = null
        }
        if (options.hideScrollbar) {
            // Restore original overflow properties
            $smoothEl.style.overflowX = overflowX
            $smoothEl.style.overflowY = overflowY
        }
        // Clean up inline transition
        if (!hasExistingTransition) {
            $smoothEl.style.transition = null
        }

        this.transition(STATES.INACTIVE)
    }
    log(...obj) {
        if (!this.options.debug) {
            return
        }
        console.log(`VSR_DEBUG:`, ...obj)
    }
}

export default mixin
