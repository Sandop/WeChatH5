import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import routes from '../router.config.js'

Vue.use(Router)

const createRoute = routes => {
  return routes.reduce((processedRoutes, currentRoute) => {
    processedRoutes.push(processRouteObj(currentRoute))
    return processedRoutes
  }, [])
}

const processRouteObj = ({ menuCode, breadcrumb, children, component, ...args }) => {
  return Object.assign(
    {
      meta: { menuCode },
      props: {
        breadcrumbObj: {
          content: breadcrumb,
          menuCode: menuCode
        }
      },
      component: () => import(/* webpackInclude: /\.(js|vue)$/ */ `@/pages/${component}`),
      children: children ? createRoute(children) : []
    },
    args
  )
}

const router = new Router({
  mode: 'hash',
  base: process.env.VUE_APP_BASE_URL,
  routes: createRoute(routes)
})

router.beforeEach(async (to, form, next) => {
  console.log(store.state)
  const {
    userInfo: { code }
  } = store.state
  // 修改跳转页面title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 防止死循环跳出
  if (to.path.indexOf('error') > -1) {
    next()
    return
  }

  if (code.includes(`${process.env.VUE_APP_CONTEXT}_${to.meta.menuCode}`)) {
    next()
  } else if (to.meta.menuCode) {
    // 真实菜单，但无权限
    next({ path: '/error/403' })
  } else {
    // 不属于系统的url，跳转到404页面
    next({ path: '/error/404' })
  }
})

export default router
