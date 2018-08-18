<template>
    <div class="width">
        <div class="examples" :class="widthClass">
            <div class="example example-1">
                <div class="container">
                    <div v-for="n in 3" :key="n"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import smoothReflow from '../smooth-reflow'
export default {
    name: 'Width',
    mixins: [smoothReflow],
    data() {
        return {
            children: 9,
            childrenMax: 9,
            count: 0,
            direction: 'up',
        }
    },
    computed: {
        widthClass() {
            return this.count%2 == 0 ? 'small': 'big'
        }
    },
    mounted() {
        let options = [
            {
                el: '.example-1 .container',
                property: 'width',
            }
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
        },1250)
    },
    methods: {

    }
}
</script>

<style scoped>
.width {

}

.container {
    display: inline-block;
    overflow: hidden;
}

.examples.small .container > div {
    width: 50px;
}
.examples.big .container > div {
    width: 150px;
}
</style>
