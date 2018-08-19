<template>
    <div class="width">
        <p>Transitions on width don't work as "out of the box" as transitions on height. Many elements are <code>display: block</code> by default. This means they fill the width of their container and are not sized according to their child elements.</p>
        <p>It's up to you to ensure that the smooth element can expand and contract as necessary.</p>
        <div class="examples-row" :class="widthClass">
            <p>One way to do this is to set <code>display: inline-block</code>.</p>
            <div class="example example-inline-block">
                <div class="wrapper">
                    <div v-for="n in 3" :key="n"></div>
                </div>
            </div>
        </div>
        <div class="examples-row" :class="widthClass">
            <p>Here's what <code>display: block</code> looks like.</p>
            <div class="example example-block">
                <div class="wrapper">
                    <div v-for="n in 3" :key="n"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { smoothReflow } from '../main'
export default {
    name: 'Width',
    mixins: [smoothReflow],
    props: ['isVsrActive', 'count'],
    data() {
        return {
            vsrOptions: [
                {
                    el: '.example-inline-block .wrapper',
                    property: 'width',
                },
                {
                    el: '.example-block .wrapper',
                    property: 'width',
                }
            ]
        }
    },
    computed: {
        widthClass() {
            return this.count % 2 == 0 ? 'small': 'big'
        }
    },
    watch: {
        isVsrActive() {
            if (this.isVsrActive) {
                this.$smoothReflow(this.vsrOptions)
            } else {
                this.$unsmoothReflow(this.vsrOptions)
            }
        },
    },
    mounted() {
        if (this.isVsrActive) {
            this.$smoothReflow(this.vsrOptions)
        }
    }
}
</script>

<style scoped>

.example-inline-block .wrapper {
    display: inline-block;
    overflow: hidden;
}
.examples-row {
    margin-bottom: 30px;
}
.examples-row.small .wrapper > div {
    width: 50px;
}
.examples-row.big .wrapper > div {
    width: 150px;
}
</style>
