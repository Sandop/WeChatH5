<template>
  <layout>
    <template v-if="false" slot="nav-right">
      <div class="nav-right">
        <van-popover v-model="showPopover" theme="dark" trigger="click" :actions="actions" @select="onSelect" placement="bottom-end">
          <template #reference>
            <van-icon name="filter-o" />
          </template>
        </van-popover>
      </div>
    </template>
    <div ref="visitorList" class="visitorList">
      <div class="visitorList-list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-cell v-for="(item, index) in visitorList" :key="index" is-link center @click="goToDetail(item)">
            <div class="name">{{ isVisitor ? item.personname : item.visitorname || '未知' }}</div>
            <div class="phone">{{ isVisitor ? phoneDeal(item.phoneno) : phoneDeal(item.visitorphone) }}</div>
            <div class="phone">{{ item.visittime | timeFormat }}</div>
            <div :class="['status', statusClass(item.status)]">
              {{ item.status | statusFormat }}
            </div>
          </van-cell>
        </van-list>
      </div>
    </div>
    <div class="visitor-btn">
      <van-button v-if="!isRegister" round block type="info" @click="goRegister">去登记</van-button>
      <van-button v-else-if="isVisitor" round block type="info" @click="makeAppointment">去预约</van-button>
    </div>
  </layout>
</template>

<script>
import layout from '@/layouts/layout'
import API from '@/api'
import { CONFIG_STORAGE } from '@/utils/configs'
import { getStore } from '@/utils/util'
export default {
  data() {
    return {
      openid: getStore(CONFIG_STORAGE.openId), // 访问者openId
      isRegister: false, // 是否登记过，登记过展示去预约，未登记展示去登记
      isVisitor: true, // 是否是访客,加载访客或者
      jobNo: '',
      container: null,
      showPopover: false,
      actions: [
        { text: '全部', value: -1 },
        { text: '待审核', value: 0 },
        { text: '已通过', value: 1 },
        { text: '未通过', value: 2 },
        { text: '已过期', value: 3 }
      ],
      currentStatus: -1,
      searchValue: '',
      visitorList: [],
      loading: false,
      finished: false,
      pageNo: 1,
      pageSize: 20
    }
  },
  components: {
    layout
  },
  created() {
    this.queryPersonsInfo()
  },
  methods: {
    /**
     * @description 根据openid查询人员类型
     */
    queryPersonsInfo() {
      const data = {
        openid: this.openid
      }
      API.queryPersonsInfoApi(data).then(res => {
        console.log(res)
        if (res.code === '0') {
          if (res.data) {
            this.isRegister = true
            this.isVisitor = res.data.persontype === '1'
          } else {
            this.isRegister = false
          }
        }
      })
    },
    /**
     * @description 点击进入详情
     */
    goToDetail(row) {
      this.$router.push({
        path: `/visitorDetail/${row.id}`,
        query: {
          status: row.status
        }
      })
    },
    /**
     * @description 点击进入预约
     */
    makeAppointment(row) {
      this.$router.push({
        path: '/inviteVisitor'
      })
    },
    /**
     * @description 点击进入登记
     */
    goRegister(row) {
      this.$router.push({
        path: '/register'
      })
    },
    /**
     * @description 审核状态转换
     */
    statusClass(val) {
      let className = ''
      switch (val) {
        case 0:
          className = 'default'
          break
        case 1:
          className = 'success'
          break
        case 2:
          className = 'danger'
          break
        case 3:
          className = 'warning'
          break
        default:
          className = 'default'
          break
      }
      return className
    },
    /**
     * @description 手机号码脱敏
     */
    phoneDeal(str) {
      if (!str) return '--'
      let _str = ''
      for (let i = 0; i < str.length; i++) {
        if (i > 2 && i < 7) {
          _str += '*'
        } else {
          _str += str[i]
        }
      }
      return _str
    },
    /**
     * @description 选择审核状态
     */
    onSelect(action) {
      this.currentStatus = action.value
      this.visitorList = []
      this.pageNo = 1
      this.finished = false
    },
    /**
     * @description 加载列表信息
     */
    onLoad() {
      if (!this.isRegister) {
        this.loading = false
        return
      }
      if (this.isVisitor) {
        const data = {
          openid: this.openid,
          page: this.pageNo,
          pageSize: this.pageSize,
          status: this.currentStatus
        }
        API.getVisitorListApi(data).then(res => {
          console.log(111)
          console.log(res)
          if (res.code === '0') {
            const { dataInfos, total } = res.data
            if (dataInfos && dataInfos.length > 0) {
              this.visitorList = this.visitorList.concat(dataInfos)
            }
            this.loading = false
            const totalPage = Math.floor(total / this.pageSize)
            if (this.pageNo > totalPage) {
              this.finished = true
            } else {
              this.pageNo = this.pageNo + 1
            }
          }
        })
      } else {
        const data = {
          openid: this.openid,
          page: this.pageNo,
          pageSize: this.pageSize,
          status: this.currentStatus
        }
        API.getInnerPersonsListApi(data).then(res => {
          console.log(222)
          console.log(res)
          if (res.code === '0') {
            const { dataInfos, total } = res.data
            if (dataInfos && dataInfos.length > 0) {
              this.visitorList = this.visitorList.concat(dataInfos)
              console.log(this.visitorList)
            }
            this.loading = false
            const totalPage = Math.floor(total / this.pageSize)
            if (this.pageNo > totalPage) {
              this.finished = true
            } else {
              this.pageNo = this.pageNo + 1
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-right {
  padding-right: 10px;
}
.visitorList {
  &-list {
    .name {
      color: rgba(16, 16, 16, 1);
    }
    .phone {
      font-size: 12px;
      color: rgba(163, 163, 163, 1);
    }
    .status {
      display: flex;
      align-items: center;
      position: absolute;
      padding: 0 10px;
      top: 24px;
      right: 30px;
      font-size: 12px;
      border-radius: 20px;
      &.default {
        color: #fff;
        background: rgba(0, 72, 255, 1);
      }
      &.success {
        color: #fff;
        background: #07c160;
      }
      &.danger {
        color: rgba(16, 16, 16, 1);
        background: rgba(220, 222, 224, 1);
      }
      &.warning {
        color: #fff;
        background: rgb(56, 64, 73);
      }
    }
  }
}
.visitor-btn {
  position: fixed;
  width: calc(100% - 20px);
  bottom: 12px;
  display: flex;
  button + button {
    margin-left: 20px;
  }
}
</style>
