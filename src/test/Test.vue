<template>
    <div class="test-container">
        <div>
            <p>VSR should - in any way - prevent margin collapse before calculating the beforeHeight. These h1 tags have margin top/bottom set, which causes margin collapse. Right now, the hideOverflow option prevents margin collapse.</p>
            <div class="test-margin-collapse-wrapper">
                <div class="test test-margin-collapse">
                    <h1 v-for="n in listChildren" :key="n">Test</h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { smoothReflow } from '../main'
export default {
    name: 'Test',
    mixins: [smoothReflow],
    props: ['isVsrActive', 'count', 'children', 'childrenMax', 'listChildren', 'listChildrenMax'],
    data() {
        return {
            vsrOptions: [
                { el: '.test-margin-collapse' }
            ]
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
.test-container {
}

.test-margin-collapse-wrapper {
    background: lightgrey;
    padding: 20px;
}

h1 {
    display: block;
    font-size: 2em;
    -webkit-margin-before: 0.67em;
    -webkit-margin-after: 0.67em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    font-weight: bold;
}
</style>
