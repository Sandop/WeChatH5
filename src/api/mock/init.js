export const SubmitPersonRecord = {
  code: '0',
  msg: 'SUCCESS',
  data: {}
}

export const SubmitVisitorRecord = {
  code: '0',
  msg: 'SUCCESS',
  data: {}
}

export const PersonInfoByPhone = {
  code: '0',
  msg: 'SUCCESS',
  data: {
    jobno: 9527,
    phoneno: 18888888888,
    certificateno: '621214199012121212',
    personname: '张三'
  }
}
// 根据openId查询人员信息
export const PersonInfoByOpenId = {
  code: '0',
  msg: 'SUCCESS',
  data: {
    persontype: '0',
    personname: '路飞',
    idcardno: '621214199012121212',
    phoneno: '13333333333',
    plateno: '',
    photo: 'https://tse1-mm.cn.bing.net/th/id/OET.a1a5162a3f6d4114ad6af54d80cc3e8a?w=135&h=272&c=7&rs=1&o=5&pid=1.9'
  }
}
// 根据openid未查询到人员信息
// export const PersonInfoByOpenId = {
//   code: '0',
//   msg: 'SUCCESS',
//   data: null
// }
// 内部人员审核列表
export const InnerPersonsList = {
  code: '0',
  msg: 'SUCCESS',
  data: {
    total: 4,
    dataInfos: [
      {
        visitorname: '张三',
        visitorphone: '15000000000',
        visittime: new Date(),
        status: 0
      },
      {
        visitorname: '张三',
        visitorphone: '15000000000',
        visittime: new Date(),
        status: 1
      },
      {
        visitorname: '张三',
        visitorphone: '15000000000',
        visittime: new Date(),
        status: 2
      },
      {
        visitorname: '张三',
        visitorphone: '15000000000',
        visittime: new Date(),
        status: 3
      }
    ]
  }
}
// 访客列表
export const VisitorList = {
  code: '0',
  msg: 'SUCCESS',
  data: {
    total: 4,
    dataInfos: [
      {
        personname: '李四',
        phoneno: '13111111111',
        visittime: new Date(),
        status: 0
      },
      {
        personname: '李四',
        phoneno: '13111111111',
        visittime: new Date(),
        status: 1
      },
      {
        personname: '李四',
        phoneno: '13111111111',
        visittime: new Date(),
        status: 2
      },
      {
        personname: '李四',
        phoneno: '13111111111',
        visittime: new Date(),
        status: 3
      }
    ]
  }
}

export const VisitorDetail = {
  code: '0',
  msg: 'SUCCESS',
  data: {
    status: 0,
    extend3: 1212,
    visitorphoto: 'https://tse1-mm.cn.bing.net/th/id/OET.a1a5162a3f6d4114ad6af54d80cc3e8a?w=135&h=272&c=7&rs=1&o=5&pid=1.9',
    personname: '张三',
    jobno: '9527',
    phoneno: '18888888888',
    visitstarttime: '2021-9-23 11:00:00',
    visitendtime: '2021-9-23 13:00:00',
    extend2: '拜访客户',
    visitorname: '李四',
    gender: 1,
    visitoridphone: '13333333333',
    plateno: '新A WJ678',
    visitoridno: '621214199912121111'
  }
}

export const ConfirmVisitorReservat = {
  code: '0',
  msg: 'SUCCESS',
  data: {}
}

export const WxToken = {
  code: '0',
  msg: 'SUCCESS',
  data: '12121212121212'
}
