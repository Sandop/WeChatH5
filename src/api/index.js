import http from './httpInstance'
import { SubmitPersonRecord, SubmitVisitorRecord, PersonInfoByPhone, PersonInfoByOpenId, InnerPersonsList, VisitorList, VisitorDetail, ConfirmVisitorReservat, WxToken } from './mock/init'

const API = {
  SUBMIT_PERSON_RECORD: '/person/personRecord', // 访客与被访人员登记
  CONFIRM_VISITOR_RESERVATION: '/confirm/confirmVisitorReservation', // 内部人员审核访客预约申请
  GET_PERSON_INFO: '/person/queryPerson', // 人员登记信息查询
  QUERY_PERSONS_TYPE: '/person/checkPersonIsInner', // 根据openid查询为内部人员或者访客
  GET_INNER_PERSONS_LIST: '/visitorQuery/innerPersons', // 内部人员查询访客历史记录数据
  GET_VISITOR_LIST: '/visitorQuery/visitors', // 访客查询访客历史记录数据
  GET_VISITOR_INFO: '/visitorQuery/reservationInfo', // 根据访客openID、手机号、身份证号查询访客预约信息
  GET_VISITOR_RESERVAT: '/visitorQuery/visitorReservation', // 访客预约
  GET_AUTHOR_URL: '/author/authUrl', // 获取网页授权code的url
  GET_AUTHOR_OPENID: '/author/openid' // 根据网页授权code的url获取openId
}

const isDev = process.env.NODE_ENV === 'development'

Object.keys(API).forEach(key => {
  API[key] = `${isDev ? '/dev' : '/' + process.env.VUE_APP_CONTEXT}${API[key]}`
})

const ApiService = {
  /**
   * @description 人员登记页面信息提交
   * @param {*} opts
   * @returns
   */
  submitPersonRecordApi(data) {
    if (isDev) {
      return Promise.resolve(SubmitPersonRecord)
    } else {
      return http({
        method: 'post',
        url: API.SUBMIT_PERSON_RECORD,
        data
      })
    }
  },
  /**
   * @description 访客预约信息提交
   * @param {*} data
   * @returns
   */
  visitorReservationApi(data) {
    if (isDev) {
      return Promise.resolve(SubmitVisitorRecord)
    } else {
      return http({
        method: 'post',
        url: API.GET_VISITOR_RESERVAT,
        data
      })
    }
  },
  /**
   * @description 根据手机号或者电话查询被访问人身份证、姓名、工号
   * @param {*} data
   * @returns
   */
  queryPersonApi(data) {
    if (isDev) {
      return Promise.resolve(PersonInfoByPhone)
    } else {
      return http({
        method: 'post',
        url: API.GET_PERSON_INFO,
        data
      })
    }
  },
  /**
   * @description 根据openid查询为内部人员或者访客
   * @param {*} data
   * @returns
   */
  queryPersonsInfoApi(data) {
    if (isDev) {
      return Promise.resolve(PersonInfoByOpenId)
    } else {
      return http({
        method: 'post',
        url: API.QUERY_PERSONS_TYPE,
        data
      })
    }
  },
  /**
   * @description 内部人员查询预约记录
   * @param {*} data
   * @returns
   */
  getInnerPersonsListApi(data) {
    if (isDev) {
      return Promise.resolve(InnerPersonsList)
    } else {
      return http({
        method: 'post',
        url: API.GET_INNER_PERSONS_LIST,
        data
      })
    }
  },
  /**
   * @description 访客查询预约记录
   * @param {*} data
   * @returns
   */
  getVisitorListApi(data) {
    if (isDev) {
      return Promise.resolve(VisitorList)
    } else {
      return http({
        method: 'post',
        url: API.GET_VISITOR_LIST,
        data
      })
    }
  },
  /**
   * @description 查询预约信息详情
   * @param {*} opts
   * @returns
   */
  getVisitorDetailApi(data) {
    if (isDev) {
      return Promise.resolve(VisitorDetail)
    } else {
      return http({
        method: 'post',
        url: API.GET_VISITOR_INFO,
        data
      })
    }
  },
  /**
   * @description 预约信息审核接口
   * @param {*} opts
   * @returns
   */
  confirmVisitorReservationApi(data) {
    if (isDev) {
      return Promise.resolve(ConfirmVisitorReservat)
    } else {
      return http({
        method: 'post',
        url: API.CONFIRM_VISITOR_RESERVATION,
        data
      })
    }
  },
  /**
   * @description 获取公众号openId
   * @param {*} params
   * @returns
   */
  getWxTokenApi(params) {
    if (isDev) {
      return Promise.resolve(WxToken)
    } else {
      return http({
        method: 'get',
        url: API.GET_AUTHOR_OPENID,
        params
      })
    }
  }
}

export default ApiService
