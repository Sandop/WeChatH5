import Vue from 'vue'
import Vant from 'vant'
import commonFilters from '@/utils/filters'
import initApp from './initApp'
import 'vant/lib/index.css'
// 微信授权
import '@/utils/permission'

// import VConsole from 'vconsole'
// const isDebug = true
// // 本地开发调试注入vConsole
// if (isDebug) {
//   /* eslint-disable no-new */
//   new VConsole()
// }

Object.keys(commonFilters).forEach(k => Vue.filter(k, commonFilters[k]))
Vue.use(Vant)

initApp(Vue)
