import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'// 导入安装的依赖包
import 'element-ui/lib/theme-chalk/index.css' // 引入ele样式文件

// import './components/guard/promission'
import axios from './utils/index' // 引入包

Vue.config.productionTip = false
Vue.use(ElementUI) // 全局注册ele

Vue.config.productionTip = false
Vue.prototype.$http = axios // 实现全局共享
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
