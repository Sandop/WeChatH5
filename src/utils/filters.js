import * as dayjs from 'dayjs'
const commonFilters = {
  timeFormat (time) { return dayjs(time).format('YYYY-MM-DD HH:mm:ss') },
  statusFormat (val) {
    const _status = {
      0: '待审核',
      1: '已通过',
      2: '未通过',
      3: '已过期'
    }
    return _status[val] ? _status[val] : '未知'
  }
}
export default commonFilters
