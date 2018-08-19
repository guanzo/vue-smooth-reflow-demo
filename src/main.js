
import smoothReflow from '../../vue-smooth-reflow'
import Vue from 'vue'
import App from './App.vue'
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

export { smoothReflow }
