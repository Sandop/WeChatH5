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

  // 设置state值
  setState(value) {
    this.state = value || WechatAuthPlugin.makeState()
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
