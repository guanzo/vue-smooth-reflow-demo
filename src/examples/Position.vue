<template>
    <div class="position">
        <div class="example example-1">
            <div class="large" v-show="count%2 == 0" />
            <div class="smalls">
                <!-- <div v-for="n in listChildren" class="small" :key="n" /> -->
                <div class="small small-reflow" />
            </div>
        </div>
        <div class="example example-2">
            <transition name="fade">
                <div class="large large-fade" v-show="count%2 == 0" />
            </transition>
            <div class="smalls">
                <!-- <div v-for="n in listChildren" class="small" :key="n" /> -->
                <div class="small small-reflow-2" />
            </div>
        </div>
    </div>
</template>

<script>
import smoothReflow from '../smooth-reflow'
export default {
    name: 'Position',
    mixins: [smoothReflow],
    data() {
        return {
            count: 0,
            listChildren: 0,
            listChildrenMax: 3,
            direction: 'up',
        }
    },
    computed: {
        positionClass() {
            return this.count%2 == 0 ? 'extra-lar': 'big'
        }
    },
    mounted() {

        let options = [
            {
                el: '.small-reflow',
                property: 'position',
            },
            {
                el: '.small-reflow-2',
                property: 'position',
                transitionEvent: {
                    selector: '.large-fade'
                },
                debug: true
            }
        ]
        this.$smoothReflow(options)
        setInterval(()=>{
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
        },1750)
    },
}
</script>

<style scoped>
.example {
    height: 400px;
}

.large{
    height: 200px;
    width: 200px;
    background: darkblue;
}
.smalls {
    display: flex;
}
.small{
    height: 50px;
    width: 50px;
    background: lightblue;
}
</style>
