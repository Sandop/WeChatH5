/*
 * @Descripttion: 微信授权页面封装
 * @version: 1.0.0
 * @Author: Sando
 * @Date: 2021-08-30 11:23:02
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-08-30 15:24:27
 */
import router from '@/router'
import wechatAuth from '@/utils/wechatAuth'
import { getStore, setStore } from '@/utils/util'
import { CONFIG_STORAGE } from '@/utils/configs'
import API from '@/api'

// 设置APPID
const WX_APPID = 'wx12345677654321'
wechatAuth.setAppId(WX_APPID)

router.beforeEach(async (to, from, next) => {
  // 登录态 0为未授权 1为授权返回code 2为使用code获取openid成功
  let authStatus = getStore(CONFIG_STORAGE.AuthStatusKey) // 微信授权登录状态
  console.log('authStatus----' + authStatus)
  authStatus = authStatus === null || undefined ? 0 : authStatus
  console.log('authStatus----' + authStatus)
  switch (Number(authStatus)) {
    case 0:
      // 获取h5页面地址赋值给redirect_uri
      wechatAuth.redirect_uri = wechatAuth.processUrl()
      // 更改登录状态为1
      setStore(CONFIG_STORAGE.AuthStatusKey, 1)
      // 跳转到获取code访问链接
      window.location.href = wechatAuth.authUrl
      break
    case 1: {
      // 获取code值
      wechatAuth.returnFromWechat(window.location.href)
      const code = wechatAuth.code
      console.log(code)
      // 判断code是否存在
      if (!code) {
        setStore(CONFIG_STORAGE.AuthStatusKey, 0)
      }
      // 使用cod换取eopenId
      const params = {
        code: code
      }
      API.getWxTokenApi(params)
        .then(res => {
          if (res.code === '0') {
            // 获取openId之后存储，并将状态更改为2
            setStore(CONFIG_STORAGE.openId, res.data)
            setStore(CONFIG_STORAGE.AuthStatusKey, 2)
            // 对路由重定向
            window.location.href = `${window.location.origin}${window.location.pathname}/${window.location.hash}`
          } else {
            setStore(CONFIG_STORAGE.AuthStatusKey, 0)
          }
        })
        .catch(err => {
          console.log(err)
          setStore(CONFIG_STORAGE.AuthStatusKey, 0)
        })
      break
    }
    case 2:
      // 若openId缺失，状态置为0，去首页重新授权
      if (!getStore(CONFIG_STORAGE.openId)) {
        setStore(CONFIG_STORAGE.AuthStatusKey, 0)
        next('/')
      } else {
        next()
      }
      break
    default:
      break
  }
})
