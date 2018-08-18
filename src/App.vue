<template>
    <div id="app">
        <div class="properties">
            <button v-for="p in properties" @click="currentProp = p" :key="p">
                {{ p }}
            </button>
        </div>
        <component :is="currentProp" />
    </div>
</template>

<script>
import Height from './examples/Height'
import Width from './examples/Width'
import Position from './examples/Position'

export default {
    name: 'app',
    data() {
        return {
            currentProp: 'Height',
            properties: ['Height', 'Width', 'Position']
        }
    },
    components: {
        Height,
        Width,
        Position
    }
}
</script>

<style>
* {
    box-sizing: border-box;
}
body {
    background: #fefefe;
}

.container {
    background: #BBDEFB;
    padding: 2px;
}

.container div {
    background: #2196F3;
    margin: 2px;
    width: 50px;
    height: 50px;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .85s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
.fade-fast-enter-active, .fade-fast-leave-active {
    transition: opacity .5s;
}
.fade-fast-enter, .fade-fast-leave-to {
    opacity: 0;
}
</style>
