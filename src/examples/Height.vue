<template>
    <div class="height">
        <p>
            As elements are added and removed from the DOM, height is the most common property that is affected by the reflow.
        </p>
        <p>VSR will transition it for you by default.</p>
        <h4>Zero configuration.</h4>
        <div class="examples-row">
            <div class="example example-zero-config">
                <p>Look at this.<br>&nbsp;</p>
                <div class="wrapper grid">
                    <div v-for="n in children" :key="n" />
                </div>
            </div>
            <div class="example example-existing-transition">
                <p>Transitions on other properties<br>will be preserved.</p>
                <div class="wrapper grid" :style="background">
                    <div v-for="n in children" :key="n" />
                </div>
            </div>
            <div class="example example-interrupted">
                <p>Interrupted transitions<br>are no problem.</p>
                <div class="wrapper grid">
                    <div v-for="n in children" :key="n" />
                </div>
            </div>
        </div>

        <h4>Conditional rendering and vue transitions on nested elements.</h4>
        <p>The height transition will occur after the nested transition finishes.</p>
        <div class="examples-row examples-nested">
            <div class="example example-nested-v-if example-nested-transition">
                <p>v-if.</p>
                <div class="wrapper">
                    <transition name="fade-fast">
                        <div v-if="children == childrenMax" />
                    </transition>
                </div>
            </div>
            <div class="example example-nested-v-show example-nested-transition">
                <p>v-show.</p>
                <div class="wrapper">
                    <transition name="fade-fast">
                        <div v-show="children == childrenMax" />
                    </transition>
                </div>
            </div>
            <div class="example example-out-in example-nested-transition">
                <p>Transition mode "out-in".</p>
                <div class="wrapper">
                    <transition name="fade-fast" mode="out-in">
                        <div v-if="children == childrenMax" key="blah" />
                        <div v-else class="smaller-nested" key="blah2" />
                    </transition>
                </div>
            </div>
            <div class="example example-list example-list-transition">
                <p>Lists.</p>
                <transition-group name="fade-fast" tag="div" class="wrapper">
                    <div v-for="n in listChildren" :key="n" />
                </transition-group>
            </div>
        </div>

        <h4>Overflow.</h4>
        <p>Two overflow problems can occur during the transition.</p>
        <div class="examples-row">
            <div class="example example-show-overflow">
                <p>1. Appended elements can<br>overflow their container.</p>
                <div class="wrapper grid">
                    <div v-for="n in children" :key="n" />
                </div>
            </div>
            <div class="example example-show-scrollbar">
                <p>2. The scrollbar can appear<br>if <code>overflow: auto</code> is set.</p>
                <div class="wrapper grid">
                    <div v-for="n in children" :key="n" />
                </div>
            </div>
            <div class="example example-hide-scrollbar">
                <p>To fix this, VSR hides overflow during the transition.</p>
                <div class="wrapper grid">
                    <div v-for="n in children" :key="n" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { smoothReflow } from '../main'
export default {
    name: 'Height',
    mixins: [smoothReflow],
    props: ['isVsrActive', 'count', 'children', 'childrenMax', 'listChildren', 'listChildrenMax'],
    data(){
        return {
            vsrOptions: [
                { el: '.example-zero-config .wrapper' },
                { el: '.example-existing-transition .wrapper' },
                { el: '.example-interrupted .wrapper', transition: 'height 4s' },
                { el: '.example-nested-v-if .wrapper',
                    transitionEvent: {
                        selector: 'div',
                    }
                },
                { el: '.example-nested-v-show .wrapper',
                    transitionEvent: {
                        propertyName: 'opacity'
                    }
                },
                { el: '.example-list .wrapper',
                    transitionEvent: {
                        selector: 'div',
                    }
                },
                { el: '.example-out-in .wrapper',
                    transitionEvent: {
                        selector: 'div',
                    }
                },
                { el: '.example-show-overflow .wrapper', hideOverflow: false },
                { el: '.example-show-scrollbar .wrapper', hideOverflow: false },
                { el: '.example-hide-scrollbar .wrapper' },
            ]
        }
    },
    computed: {
        background() {
            return {
                background: this.count%2 == 0 ? '#BBDEFB' : '#263238'
            }
        }
    },
    watch: {
        isVsrActive() {
            if (this.isVsrActive) {
                this.$smoothReflow(this.vsrOptions)
            } else {
                this.$unsmoothReflow(this.vsrOptions)
            }
        }
    },
    mounted() {
        if (this.isVsrActive) {
            this.$smoothReflow(this.vsrOptions)
        }
    }
}
</script>

<style lang="scss" scoped>

.examples-row {
    display: flex;
    flex-wrap: wrap;
}
.examples-nested .example {
    width: 210px;
}
.example {
    margin-right: 30px;
    margin-bottom: 30px;
    height: 235px;
    width: 250px;
}
.wrapper {
    width: 166px;
    will-change: height;
}
.example-list-transition .wrapper {
    display: block;
    width: 58px;
}
.example-nested-transition .wrapper {
    align-items: center;
    justify-content: center;
    div {
        width: 125px;
        height: 117px;
        margin: 20px;
        &.smaller-nested {
            width: 62px;
            height: 58px;
            margin: 40px;
        }
    }

}
.example-existing-transition .wrapper {
    transition: background 1s;
}
.example-show-scrollbar .wrapper, .example-hide-scrollbar .wrapper {
    overflow-y: auto;
}
.example-out-in > .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
