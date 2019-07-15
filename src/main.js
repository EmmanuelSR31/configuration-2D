// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import App from './App'
import { router } from './router/index'
import api from './api/index.js'
import layer from 'vue-layer'
import VueSweetalert2 from 'vue-sweetalert2'
import math from 'mathjs'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

Vue.use(iView)

Vue.prototype.$api = api
Vue.config.productionTip = false
Vue.config.devtools = true

Vue.prototype.$layer = layer(Vue)

Vue.use(VueSweetalert2)

Vue.prototype.$math = math

Vue.component('vue-draggable-resizable', VueDraggableResizable)

// Vue.component('chart', ECharts)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
