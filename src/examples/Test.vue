<template>
    <div class="height">
        <div v-for="n in children" :key="n"></div>
    </div>
</template>

<script>
import smoothReflow from '../smooth-reflow'
export default {
    name: 'Test',
    mixins: [smoothReflow],
    props: ['isVsrActive', 'count', 'children', 'childrenMax', 'listChildren', 'listChildrenMax'],
    mounted() {
        this.$smoothReflow()
    }
}
</script>

<style scoped>
.height {
    border: 1px solid black;
}
.height > * {
    width: 50px;
    height: 50px;
    border: 1px solid red;
}
</style>
