<template>
    <div class="position">
        <p>
            Element reflow is not only caused by child elements, but also by surrounding elements.
        </p>
        <p>
            VSR will only transition the <code>translate()</code> function.
        </p>
        <p>
            This functionality is similar to Vue's <code>&lt;transition-group&gt;</code> in that it will transition reflow. However, VSR is not limited to lists and can target any element within the component.
        </p>
        <div class="example example-1">
            <div class="large" v-show="count%2 == 0" />
            <div class="smalls">
                <div v-for="n in listChildren" class="small small-static" :key="n" />
                <div class="small small-reflow" />
            </div>
        </div>
        <div class="example example-2">
            <transition name="fade">
                <div class="large large-fade" v-show="count%2 == 0" />
            </transition>
            <div class="smalls">
                <div v-for="n in listChildren" class="small small-static" :key="n" />
                <div class="small small-reflow-2" />
            </div>
        </div>
    </div>
</template>

<script>
import { smoothReflow } from '../main'
export default {
    name: 'Transform',
    mixins: [smoothReflow],
    props: ['isVsrActive', 'count', 'children', 'childrenMax', 'listChildren', 'listChildrenMax'],
    data() {
        return {
            vsrOptions: [
                {
                    el: '.small-reflow',
                    property: 'transform',
                },
                {
                    el: '.small-reflow-2',
                    property: 'transform',
                    transitionEvent: {
                        selector: '.large-fade',
                        propertyName: 'opacity'
                    },
                }
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

<style scoped>
.example {
    height: 200px;
}

.large{
    height: 50px;
    width: 200px;
    background: #BBDEFB;
}
.smalls {
    display: flex;
}
.small{
    height: 50px;
    width: 50px;
}
.small-static {
    border: 1px solid #2196F3;
}
.small-reflow, .small-reflow-2 {
    background: #2196F3;
}
</style>
