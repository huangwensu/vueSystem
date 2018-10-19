import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import App from './App'
import router from './router'
import store from './store'
import '@/icons'
import vueFilter from './utils/filter'
// import '@/permission' // 权限

Vue.use(ElementUI)
// 全局过滤器
for (const filter in vueFilter) {
  Vue.filter(filter, vueFilter[filter])
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

