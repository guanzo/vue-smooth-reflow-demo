<template>
    <div class="combination">
        <p>You can transition any combination of properties.</p>
        <div class="checkboxes">
            <label v-for="prop in properties" :key="prop">
                <input :value="prop" v-model="selected" type="checkbox" />
                {{ prop }}
            </label>
        </div>
        <div class="example example-1">
            <div class="large" v-show="count % 2 == 0" />
            <div class="smalls">
                <div class="wrapper grid">
                    <div v-for="n in childrenCustom" :key="n"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { smoothReflow } from '../main'
export default {
    name: 'Combination',
    mixins: [smoothReflow],
    props: ['isVsrActive', 'count', 'children', 'childrenMax', 'listChildren', 'listChildrenMax'],
    data() {
        let properties = ['height', 'width', 'transform']
        return {
            properties,
            selected: ['height', 'width', 'transform'],
            vsrOption: {
                el: '.wrapper',
                property: properties,
            },

        }
    },
    computed: {
        childrenCustom() {
            return this.children === 3 ? 1 : 9
        }
    },
    watch: {
        selected() {
            this.vsrOption.property = this.selected
            if (!this.isVsrActive) {
                return
            }
            this.$unsmoothReflow(this.vsrOption)
            this.$smoothReflow(this.vsrOption)
        },
        isVsrActive() {
            if (this.isVsrActive) {
                this.$smoothReflow(this.vsrOption)
            } else {
                this.$unsmoothReflow(this.vsrOption)
            }
        }
    },
    mounted() {
        if (this.isVsrActive) {
            this.$smoothReflow(this.vsrOption)
        }
    }
}
</script>

<style lang="scss" scoped>
.checkboxes {
    display: flex;
    margin-bottom: 15px;
    label {
        margin-right: 5px;
    }
}
.example {
    height: 200px;
}

.large{
    width: 166px;
    height: 50px;
    background: lightgrey;
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
