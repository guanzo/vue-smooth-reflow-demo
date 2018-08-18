<template>
    <div class="height">
        <h3>Vue smooth height</h3>
        <p>When a change in data causes a change in height, vue smooth height will animate it for you.</p>
        <div class="examples">
            <div class="example">
                <p>Without vue-smooth-height. Ew!</p>
                <div class="container">
                    <div v-for="n in children" :key="n"></div>
                </div>
            </div>
            <div class="example">
                <p>With vue-smooth-height. Nice!</p>
                <div class="container" ref="container">
                    <div v-for="n in children" :key="n"></div>
                </div>
            </div>
        </div>
        <h3>Transition compatibility</h3>
        <div class="examples">
            <div class="example example-2">
                <p>Transitions on other properties will continue to work.</p>
                <div class="container" :style="background">
                    <div v-for="n in children" :key="n"></div>
                </div>
            </div>
            <div class="example example-5">
                <p>Using a custom transition option.</p>
                <div class="container">
                    <div v-for="n in children" :key="n"></div>
                </div>
            </div>
            <div class="example example-6">
                <p>Interrupted transitions are smooth.</p>
                <div class="container">
                    <div v-for="n in children" :key="n"></div>
                </div>
            </div>
        </div>
        <h3>Conditional rendering and vue transitions on the smooth element</h3>
        <div class="examples">
            <div class="example example-7">
                <p>Using v-if and &lt;transition&gt;.</p>
                <transition name="fade">
                    <div v-if="children == childrenMax" class="container">
                        <div v-for="n in children" :key="n"></div>
                    </div>
                </transition>
            </div>
            <div class="example example-8">
                <p>Using v-show and &lt;transition&gt;.</p>
                <transition name="fade">
                    <div v-show="children == childrenMax" class="container">
                        <div v-for="n in children" :key="n"></div>
                    </div>
                </transition>
            </div>
        </div>
        <p>Notice the difference?</p>
        <p>Elements hidden with v-show have a height of 0, while elements hidden with v-if have a height of undefined.</p>
        <h3>Conditional rendering and vue transitions on nested elements.</h3>
        <p>The height transition will occur after the nested transition finishes.</p>
        <div class="examples examples-nested">
            <div class="example example-9 example-nested-transition">
                <p>Using v-if.</p>
                <div class="container">
                    <transition name="fade-fast">
                        <div v-if="children == childrenMax"></div>
                    </transition>
                </div>
            </div>
            <div class="example example-10 example-nested-transition">
                <p>Using v-show.</p>
                <div class="container">
                    <transition name="fade-fast">
                        <div v-show="children == childrenMax"></div>
                    </transition>
                </div>
            </div>
            <div class="example example-12 example-nested-transition">
                <p>Transition mode "out-in".</p>
                <div class="container">
                    <transition name="fade-fast" mode="out-in">
                        <div v-if="children == childrenMax" class="hover" key="blah"></div>
                        <div v-else class="smaller-nested hover" key="blah2"></div>
                    </transition>
                </div>
            </div>
            <div class="example example-11 example-list-transition">
                <p>List example.</p>
                <transition-group name="fade-fast" tag="div" class="container">
                    <div v-for="n in listChildren" :key="n"></div>
                </transition-group>
            </div>
        </div>
        <h3>Scrollbars</h3>
        <div class="examples">
            <div class="example example-3">
                <p>The scrollbar can cause problems...</p>
                <div class="container">
                    <div v-for="n in children" :key="n"></div>
                </div>
            </div>
            <div class="example example-4">
                <p>...Set "hideOverflow: true" to fix it.</p>
                <div class="container">
                    <div v-for="n in children" :key="n"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import smoothReflow from '../smooth-reflow'
export default {
    name: 'Height',
    mixins: [smoothReflow],
    data(){
        return {
            children: 3,
            childrenMax: 9,
            listChildren: 0,
            listChildrenMax: 3,
            direction: 'up',
            count: 0,
        }
    },
    computed: {
        background() {
            return {
                background: this.count%2 == 0 ? '#BBDEFB' : '#263238'
            }
        }
    },
    mounted(){
        let options = [
            { el: this.$refs.container },
            { el: '.example-2 .container' },
            { el: '.example-3 .container', hideScrollbar: false },
            { el: '.example-4 .container', hideOverflow: true },
            { el: '.example-5 .container', transition: 'height 1s ease-in-out' },
            { el: '.example-6 .container', transition: 'height 4s' },
            { el: '.example-7 .container' },
            { el: '.example-8 .container' },
            { el: '.example-9 .container',
                transitionEvent: {
                    selector: 'div',
                    propertyName: 'opacity',
                    propertyValue: 0
                }
            },
            { el: '.example-10 .container',
                transitionEvent: {
                    selector: 'div',
                    propertyName: 'opacity',
                    propertyValue: 0
                }
            },
            { el: '.example-11 .container',
                transitionEvent: {
                    selector: 'div',
                    propertyName: 'opacity',
                }
            },
            { el: '.example-12 .container',
                transitionEvent: {
                    selector: 'div',
                    propertyName: 'opacity',
                    propertyValue: 0
                }
            },
        ]
        this.$smoothReflow(options)
        setInterval(()=>{
            this.children = this.count%2 == 0 ? this.childrenMax : 3
            this.count++

            if (this.direction === 'up') {
                this.listChildren++
                if (this.listChildren === this.listChildrenMax)
                    this.direction = 'down'
            } else {
                this.listChildren--
                if (this.listChildren === 0)
                    this.direction = 'up'
            }
        },1500)
    },
}
</script>

<style scoped>

.examples {
    display: flex;
    flex-wrap: wrap;
}
.example {
    margin-right: 30px;
    margin-bottom: 30px;
    height: 235px;
    width: 250px;
}
.example > p {
    min-height: 40px;
}
.container {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    width: 166px;
    will-change: height;
}
.example-list-transition .container {
    display: block;
    width: 58px;
}
.example-nested-transition .container {
    align-items: center;
    justify-content: center;
}
.example-nested-transition .container div {
    width: 125px;
    height: 117px;
    margin: 20px;
}
.example-nested-transition .container div.smaller-nested {
    width: 62px;
    height: 58px;
    margin: 40px;
}
.example-2 .container {
    transition: background 1s;
}
.example-3 .container, .example-4 .container {
    overflow-y: auto;
}
.hover {
    transition: .5s;
}
.hover:hover {
    background: red;
}
</style>
