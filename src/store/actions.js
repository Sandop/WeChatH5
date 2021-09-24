import * as types from './mutation-types'
export default {
  async setUserInfo (context) {
    // userInfo模拟数据，真实开发环境中可以去掉，使用接口获取
    const data = {
      languageId: 'zh_CN',
      skin: 'redblack',
      breadcrumb: {
        '001': ['欢迎']
      },
      code: [
        `${process.env.VUE_APP_CONTEXT}_001`,
        `${process.env.VUE_APP_CONTEXT}_002`,
        `${process.env.VUE_APP_CONTEXT}_003`,
        `${process.env.VUE_APP_CONTEXT}_004`,
        `${process.env.VUE_APP_CONTEXT}_005`
      ]
    }
    context.commit(types.SET_USER_INFO, data)
    return {
      userInfo: data
    }
  }
}
