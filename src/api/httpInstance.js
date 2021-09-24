import axios from 'axios'
import { Toast } from 'vant'
import { REQUEST_SUCCESS } from '@/constant'

const http = axios.create({
  timeout: 20000,
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' }
})

// 相应拦截器
http.interceptors.response.use(
  function(response) {
    // 对错误进行统一处理
    if (!REQUEST_SUCCESS.includes(response.data.code)) {
      return Promise.reject(response)
    } else {
      return Promise.resolve({
        code: response.data.code,
        msg: response.data.msg,
        data: response.data.data
      })
    }
  },
  function(error) {
    if (error.message.indexOf('timeout') > -1) {
      // 多语言需要自己在项目中配置
      Toast({
        message: '系统繁忙，请稍后再试',
        forbidClick: true,
        duration: 2500
      })
    }

    return Promise.reject(error)
  }
)

// 请求拦截器
http.interceptors.request.use(
  function(config) {
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

export default http
