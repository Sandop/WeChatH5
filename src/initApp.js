import store from '@/store'
import router from './router'
import App from './App'

async function initApp(Vue) {
  try {
    // 设置store中userinfo
    const { userInfo } = await store.dispatch('setUserInfo')
    console.log(userInfo)
    // 初始化vue实例
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    })
  } catch (error) {
    console.error('init error:', error)
  }
}

export default initApp
