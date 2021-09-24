# WeChatH5

基于 vue + vant ui + sass封装，构建手机端访客预约模板脚手架，主要封装微信公众号、服务号授权方法

## 项目启动
```bash

npm install

npm run serve

npm run build

npm run sit1

```
# 微信公众号服务号H5前端授权说明

标签（空格分隔）： H5 前端 微信授权

---

## 一、微信开放文档

   [官方文档-网页授权](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html)里面有详细解释说明，若遇到问题可在[微信开放社区](https://developers.weixin.qq.com/community/develop/mixflow)进行咨询

网页授权流程分为四步：
> 1、引导用户进入授权页面同意授权，获取code

> 2、通过code换取网页授权access_token（与基础支持中的access_token不同）

> 3、如果需要，开发者可以刷新网页授权access_token，避免过期

> 4、通过网页授权access_token和openid获取用户基本信息（支持UnionID机制）

此次主要封装方法使用code获取到access_token，获取到网页授权access_token的同时，也获取到了openid，前端到这里最重要的也差不多就结束了。

## 二、方法封装

### 1.微信跳转授权
在vue项目 `src/utils/wechatAuth.js`文件中，主要代码如下：

``` javascript
import { getStore, setStore } from '@/utils/util'
const qs = require('qs')

// 应用授权作用域，snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid），snsapi_userinfo （弹出授权页面，可通过openid拿到昵称、性别、所在地。并且，即使在未关注的情况下，只要用户授权，也能获取其信息）
const SCOPES = ['snsapi_base', 'snsapi_userinfo']

/**
 * @param { string } appid 公众号的唯一标识
 * @param { string } redirect_uri 授权后重定向的回调链接地址， 请使用 urlEncode 对链接进行处理
 * @param { string } scope 应用授权作用域，snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid），snsapi_userinfo （弹出授权页面，可通过openid拿到昵称、性别、所在地。并且， 即使在未关注的情况下，只要用户授权，也能获取其信息 ）
 * @param { string } state 非必须 重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
 * @param #wechat_redirect 无论直接打开还是做页面302重定向时候，必须带此参数
 */
class WechatAuthPlugin {
  constructor() {
    this.appid = null
    this.redirect_uri = null
    this._scope = SCOPES[0] // 授权类型，默认使用静默授权
    this._code = null
    this._redirect_uri = null
  }

  // 设置随机state参数
  static makeState() {
    return (
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    )
  }

  // 公众号的唯一标识
  setAppId(appid) {
    this.appid = appid
  }

  /**
   * @description 设置授权后重定向的回调链接地址， 使用 urlEncode 对链接进行处理
   * @param { * } redirect_uri 访问的redirect_uri，非必须，不传自动获取当前url
   */
  set redirect_uri(redirect_uri) {
    this._redirect_uri = encodeURIComponent(redirect_uri)
  }

  // 获取redirect_uri
  get redirect_uri() {
    return this._redirect_uri
  }

  /**
   * @description 设置授权状态
   * @param { * } idx 0 - 静默授权，1 - 非静默授权
   */
  set scope(idx) {
    this._scope = SCOPES[idx]
  }

  // 获取scope
  get scope() {
    return this._scope
  }

  // 获取缓存中state,否则返回默认值'STATE'
  get state() {
    return ['null', 'undefined', '', null, undefined].includes(getStore('wechat_auth:state')) ? 'STATE' : getStore('wechat_auth:state')
  }

  // state存储在缓存中
  set state(state) {
    setStore('wechat_auth:state', state)
  }
  
  // 设置state值
  setState(value) {
    this.state = value || WechatAuthPlugin.makeState()
  }

  /**
   * @description 获取引导关注着打开访问链接
   */
  get authUrl() {
    if (this.appid === null) {
      throw new Error('appid must not be null')
    }
    if (this.redirect_uri === null) {
      throw new Error('redirect uri must not be null')
    }
    return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.appid}&redirect_uri=${this.redirect_uri}&response_type=code&scope=${this.scope}&state=${this.state}#wechat_redirect`
  }

  // 用户同意授权，页面将跳转至 redirect_uri/?code=CODE&state=STATE，获取code参数
  returnFromWechat(redirect_uri) {
    const baseWithSearch = redirect_uri.split('#')[0]
    let parsedUrl = ''
    // 本地环境
    if (process.env.NODE_ENV === 'development') {
      parsedUrl = qs.parse(redirect_uri.split('?')[1])
      this.state = null
      this._code = parsedUrl.code
    } else {
      parsedUrl = qs.parse(baseWithSearch.split('?')[1])
      if (parsedUrl.code) {
        this._code = parsedUrl.code
      }
    }
  }

  get code() {
    if (this._code === null) {
      throw new Error('Not get the code from wechat server!')
    }
    const code = this._code
    this._code = null
    return code
  }

  /**
   * 处理url链接
   * @returns {string}
   */
  processUrl() {
    const url = window.location.href
    // 解决多次登录url添加重复的code与state问题
    const urlParams = qs.parse(url.split('?')[1])
    let redirectUrl = url

    if (urlParams.code && urlParams.state) {
      delete urlParams.code
      delete urlParams.state
      const query = qs.stringify(urlParams)
      if (query.length) {
        redirectUrl = `${url.split('?')[0]}?${query}`
      } else {
        redirectUrl = `${url.split('?')[0]}`
      }
    }
    return redirectUrl
  }
}
const wechatAuthPlugin = new WechatAuthPlugin()

export default wechatAuthPlugin
```
### 2.封装方法引用
在vue项目 `src/utils/permission.js`文件中，主要代码如下：

```javascript
import router from '@/router'
import wechatAuth from '@/utils/wechatAuth'
import { getStore, setStore } from '@/utils/util'
import { CONFIG_STORAGE } from '@/utils/configs'
import API from '@/api'

// 设置APPID
const WX_APPID = 'wx12345677654321'
wechatAuth.setAppId(WX_APPID)

router.beforeEach(async (to, from, next) => {
  // 授权态 0为未授权 1为授权返回code 2为使用code获取openid成功
  let authStatus = getStore(CONFIG_STORAGE.AuthStatusKey) // 微信授权状态
  authStatus = authStatus === null || undefined ? 0 : authStatus
  switch (Number(authStatus)) {
    case 0:
      // 获取h5页面地址赋值给redirect_uri
      wechatAuth.redirect_uri = wechatAuth.processUrl()
      // 更改授权状态为1
      setStore(CONFIG_STORAGE.AuthStatusKey, 1)
      // 跳转到获取code访问链接
      window.location.href = wechatAuth.authUrl
      break
    case 1: {
      // 获取code值
      wechatAuth.returnFromWechat(window.location.href)
      const code = wechatAuth.code
      // 判断code是否存在
      if (!code) {
        setStore(CONFIG_STORAGE.AuthStatusKey, 0)
      }
      // 使用cod换取eopenId
      API.getWxTokenApi({code})
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
```

#### **详细说明**

**1.**  设置公众号或者服务号的唯一标识AppId，直接使用`wechatAuth.setAppId()`方法调用。此处使用的是静默授权，若是需要使用非静默授权调用`wechatAuth.scope(1)`。此处state使用的默认值'STATE',若是使用随机值可以调用`wechatAuth.setState()`方法，可以传入参数或者内部自动生成。

```javascript
const WX_APPID = 'wx12345677654321'
wechatAuth.setAppId(WX_APPID)
// 0 - 静默授权,默认值，1 - 非静默授权
//wechatAuth.scope(1)
//wechatAuth.setState('qwer1234')
//或者
//wechatAuth.setState()
```

**2.**  在`全局前置守卫`中进行微信授权处理

```javascript
router.beforeEach((to, from, next) => {
  // ...
})
```
**3.**  授权状态的处理
`authStatus` 字段为微信授权态的标识，0 -- 为未授权； 1 -- 为授权页面跳转返回code； 2 -- 为使用code获取access_token、openid成功
> 0 -- 未授权，获取当前页面地址赋值给`wechatAuth.redirect_uri` 并将存储状态更改为 1，并调用`wechatAuth.authUrl`方法打开授权页面同意授权
```javascript
// 获取h5页面地址赋值给redirect_uri
wechatAuth.redirect_uri = wechatAuth.processUrl()
// 更改授权状态为1
setStore(CONFIG_STORAGE.AuthStatusKey, 1)
// 跳转到授权页面同意授权
window.location.href = wechatAuth.authUrl
```
> 1 -- 授权页面跳转并返回code，` wechatAuth.returnFromWechat(window.location.href)`方法对含有code的URL进行处理，`wechatAuth.code`方法获取code，并且请求后端接口，获取openId

```javascript
// 获取code值
wechatAuth.returnFromWechat(window.location.href)
const code = wechatAuth.code
// 判断code是否存在
if (!code) {
    setStore(CONFIG_STORAGE.AuthStatusKey, 0)
}
// 使用cod换取eopenId
API.getWxTokenApi({code})
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
```
> 2 -- 为使用code获取access_token、openid成功，如果有需要登录的可以在这个地方判断时候是登录态
```javascript
// 若openId缺失，状态置为0，去首页重新授权
if (!getStore(CONFIG_STORAGE.openId)) {
  setStore(CONFIG_STORAGE.AuthStatusKey, 0)
  next('/')
} else {
  // 判断是否登录，未登录时候去登录页面
  if (getStore(CONFIG_STORAGE.tokenCode)) {
    next()
  } else {
    next('/login')
  }
}
```

### 3.其他方法

在vue项目 `src/utils/configs.js`和`src/utils/util.js`文件中，主要代码如下：

```javascript
/*
 * @name: configs.js
 * @Descripttion: 定义localStorage常量
 * @Author: Sando
 */
 
 const CONFIG_STORAGE = {
  openId: 'WX_OPENID', // 微信openId
  AuthStatusKey: 'Auth-Status' // 服务号微信授权标识
}

export { CONFIG_STORAGE }
```

```javascript
/*
 * @name: util.js
 * @Descripttion: 存储localStorage
 * @Author: Sando
 */
 
 /**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

/**
 * 清除localStorage
 * @param key
 * @returns {any}
 */
export const storeClear = () => {
  window.localStorage.clear()
}
```

### 4.引入方法
在vue项目`src/main.js`文件中引入封装好的方法，代码如下：
```javascript
// 微信授权
import '@/utils/permission'
```

## 三、项目使用
按照上面介绍使用，使用 `npm run serve` 运行项目，这个时候在浏览器打开项目会跳转到如下链接：
> https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx12345677654321&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2FWeChatH5%2F%23%2F&response_type=code&scope=snsapi_base&state=STATE&connect_redirect=1#wechat_redirect

页面上会出现`请在微信客户端打开链接`

这个时候使用微信开发者工具打开项目，调试微信网页授权
绑定为公众号开发者流程见官方文档：[文档地址](https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Web_Developer_Tools.html)

若暂时在开发环境，无法正常访问，也可以在微信开发工具中Application->Local Storage中，输入`WX_OPENID: 121212122`和`Auth-Status:2`,暂时进行开发，环境搭建好了再上环境测试

## 四、写在最后
项目github地址：https://github.com/Sandop/WeChatH5，欢迎大家给个star，Thanks♪(･ω･)ﾉ
