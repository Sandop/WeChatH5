<template>
  <layout>
    <div class="visitorDetail">
      <!-- 被访问者信息 -->
      <div class="visitor-card">
        <div :class="['status', statusClass(status)]">
          {{ status | statusFormat }}
        </div>
        <van-field readonly v-model="form.personname" left-icon="friends-o" name="personname" label="被访人姓名" placeholder="被访人姓名" />
        <van-field readonly v-model="form.jobno" icon-prefix="iconfont" left-icon="zhengjianhaoma" name="jobno" label="被访人工号" placeholder="被访人工号" />
        <van-field readonly v-model="form.phoneno" left-icon="phone-o" name="phoneno" label="被访人电话" placeholder="被访人电话" />
        <van-field readonly v-model="form.certificateno" icon-prefix="iconfont" left-icon="zhengjianhaoma" name="certificateno" label="被访人身份证" placeholder="被访人身份证" />
        <van-field readonly v-model="form.purpose" left-icon="notes-o" name="name" label="来访事由" placeholder="来访事由" />
        <van-field icon-prefix="iconfont" left-icon="shijian" readonly name="startTime" :value="form.startTime" label="来访时间" placeholder="点击选择时间" />
        <van-field icon-prefix="iconfont" left-icon="shijian" readonly name="endTime" :value="form.endTime" label="离开时间" placeholder="点击选择时间" />
      </div>
      <!-- 访客信息 -->
      <div class="visitor-card">
        <van-field readonly v-model="visitorDetail.visitorName" left-icon="user-o" name="visitorName" label="姓名" placeholder="姓名" />
        <van-field readonly name="visitorSex" label="性别" icon-prefix="iconfont" left-icon="gender">
          <template #input>
            <van-radio-group disabled v-model="visitorDetail.visitorSex" direction="horizontal">
              <van-radio name="1" checked-color="rgba(0, 72, 255, 1)">男</van-radio>
              <van-radio name="2" checked-color="rgba(0, 72, 255, 1)">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field readonly v-model="visitorDetail.visitorPhoneNo" left-icon="phone-o" name="visitorPhoneNo" label="访客手机号" placeholder="访客手机号" />
        <van-field readonly v-model="visitorDetail.visitorIdentityNum" icon-prefix="iconfont" left-icon="zhengjianhaoma" name="visitorIdentityNum" label="身份证号" placeholder="身份证号" />
        <van-field readonly v-model="visitorDetail.visitorPlateNo" icon-prefix="iconfont" left-icon="cheliang" name="visitorPlateNo" label="车牌号" placeholder="车牌号" />
        <van-field name="uploader" left-icon="user-circle-o" label="头像">
          <template #input>
            <van-image width="80" height="80" :src="visitorphoto" />
          </template>
        </van-field>
      </div>
      <div class="visitor-btn" v-if="!isVisitor">
        <van-button :disabled="statusComputed" round block type="info" native-type="button" @click="overlayShow = true">审核</van-button>
      </div>
      <van-action-sheet v-model="overlayShow" title="审核">
        <div class="content">
          <van-field label="结论">
            <template #input>
              <van-radio-group v-model="result" direction="horizontal">
                <van-radio name="0" checked-color="rgba(0, 72, 255, 1)">通过</van-radio>
                <van-radio name="1" checked-color="rgba(0, 72, 255, 1)">不通过</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field v-model="message" rows="2" autosize label="审核意见" type="textarea" maxlength="50" placeholder="请输入审核意见" show-word-limit />
          <van-button round block type="info" native-type="button" @click="sure">确定</van-button>
        </div>
      </van-action-sheet>
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
      isVisitor: true, // 是否是访客,非访客展示底部审核按钮
      visitorId: '',
      visitBatch: '', // 预约批次号，审批时候提交
      overlayShow: false,
      result: '',
      message: '',
      status: 0,
      form: {
        personname: '',
        jobno: '',
        phoneno: '',
        certificateno: '',
        startTime: '',
        endTime: '',
        purpose: ''
      },
      visitorDetail: {
        visitorName: '', // 姓名
        visitorSex: '', // 性别
        visitorPhoneNo: '', // 手机号
        visitorPlateNo: '', // 车牌号
        // certificatesType: "身份证", // 证件类型
        visitorIdentityNum: '' // 证件号码
      },
      visitorphoto: '' // 访客头像
    }
  },
  components: {
    layout
  },
  created() {
    this.visitorId = this.$route.params.id
    this.status = Number(this.$route.query.status) || 0
    this.queryPersonsInfo()
    this.getDetail()
  },
  computed: {
    statusComputed() {
      return this.status !== 0
    }
  },
  methods: {
    /**
     * @description 根据openid查询人员类型
     */
    queryPersonsInfo() {
      const data = {
        openid: getStore(CONFIG_STORAGE.openId)
      }
      API.queryPersonsInfoApi(data).then(res => {
        if (res.code === '0') {
          if (res.data) {
            this.isVisitor = res.data.persontype === '1'
          }
        }
      })
    },
    /**
     * @description 获取详情信息
     */
    getDetail() {
      const data = {
        id: this.visitorId
      }
      API.getVisitorDetailApi(data).then(res => {
        if (res.code === '0') {
          const _data = res.data
          this.status = _data.status
          this.visitBatch = _data.extend3
          this.visitorphoto = _data.visitorphoto
          this.form = {
            personname: _data.personname,
            jobno: _data.jobno,
            phoneno: _data.phoneno,
            certificateno: _data.phoneno,
            startTime: _data.visitstarttime,
            endTime: _data.visitendtime,
            purpose: _data.extend2
          }
          this.visitorDetail = {
            visitorName: _data.visitorname, // 姓名
            visitorSex: String(_data.gender), // 性别
            visitorPhoneNo: _data.visitoridphone, // 手机号
            visitorPlateNo: _data.plateno, // 车牌号
            visitorIdentityNum: _data.visitoridno // 证件号码
          }
        } else {
          this.$toast('系统繁忙，请重新查询')
        }
      })
    },
    /**
     * @description 提交审核结果
     */
    sure() {
      const data = {
        id: this.visitorId,
        visitBatch: this.visitBatch,
        confirmtype: Number(this.result),
        rejectReason: this.message
      }
      API.confirmVisitorReservationApi(data).then(res => {
        if (['0', '00'].includes(res.code)) {
          this.overlayShow = false
          this.status = Number(this.result)
          this.message = ''
          this.result = ''
          this.$router.push({
            path: '/'
          })
        } else {
          this.$toast('系统繁忙，请稍后再试')
        }
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
        default:
          className = 'default'
          break
      }
      return className
    }
  }
}
</script>

<style lang="scss" scoped>
.visitorDetail {
  .status {
    position: relative;
    left: 20px;
    font-size: 12px;
    display: inline-block;
    padding: 2px 10px;
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
  }
}
.visitor-card {
  position: relative;
  padding: 15px 0 8px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  margin-bottom: 10px;
}
::v-deep .van-button--info {
  background: linear-gradient(to right, rgba(102, 145, 255, 1), rgba(0, 72, 255, 1));
  border-color: rgba(102, 145, 255, 1);
}
.content {
  padding: 20px 10px;
}
</style>
