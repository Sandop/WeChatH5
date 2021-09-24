<template>
  <layout>
    <div class="visitor">
      <van-form @submit="onSubmit">
        <div class="visitor-card">
          <van-field
            v-model="form.phoneno"
            left-icon="phone-o"
            name="phoneno"
            label="被访人电话"
            placeholder="被访人电话"
            @input="searchInputValue"
            :rules="[{ required: true, message: '请输入被访人电话' }]"
          />
          <van-field
            ref="interview"
            v-model="form.personname"
            left-icon="friends-o"
            name="personname"
            label="被访人姓名"
            placeholder="被访人姓名"
            clearable
            @input="searchInputValue"
            :rules="[{ required: true, message: '请输入被访人姓名' }]"
          />
          <van-field
            readonly
            v-model="form.jobno"
            icon-prefix="iconfont"
            left-icon="zhengjianhaoma"
            name="jobno"
            label="被访人工号"
            placeholder="被访人工号"
            :rules="[{ required: true, message: '请输入被访人工号' }]"
          />
          <van-field
            readonly
            v-model="form.certificateno"
            icon-prefix="iconfont"
            left-icon="zhengjianhaoma"
            name="certificateno"
            label="被访人身份证"
            placeholder="被访人身份证"
            :rules="[
              { required: true, message: '请输入身份证号' },
              {
                validator: visitorIdentityNumValidator,
                message: '请输入正确的身份证号'
              }
            ]"
          />
          <van-field v-model="form.visitcause" :maxlength="48" left-icon="notes-o" name="visitcause" label="来访事由" placeholder="来访事由" :rules="[{ required: true, message: '请填写来访事由' }]" />
          <van-field
            icon-prefix="iconfont"
            left-icon="shijian"
            readonly
            clickable
            name="datetimeStartPicker"
            :value="form.visitstarttime"
            label="来访时间"
            placeholder="点击选择时间"
            :rules="[{ required: true, message: '请选择来访时间', trigger: 'onChange' }]"
            @click="selectTime('start')"
          />
          <van-field
            icon-prefix="iconfont"
            left-icon="shijian"
            readonly
            clickable
            name="datetimeEndPicker"
            :value="form.visitendtime"
            label="离开时间"
            placeholder="点击选择时间"
            :rules="[{ required: true, message: '请选择离开时间', trigger: 'onChange' }]"
            @click="selectTime('end')"
          />
        </div>
        <van-popup v-model="timeShowPicker" position="bottom">
          <van-datetime-picker v-model="currentTimeDate" type="datetime" @confirm="timeOnConfirm" @cancel="timeShowPicker = false" />
        </van-popup>
        <div class="visitor-card">
          <van-field
            v-model="form.visitorname"
            :maxlength="12"
            left-icon="user-o"
            name="visitorname"
            label="访客姓名"
            placeholder="访客姓名"
            clearable
            :rules="[{ required: true, message: '请输入姓名' }]"
          />
          <van-field name="gender" label="性别" icon-prefix="iconfont" left-icon="gender" :rules="[{ required: true, message: '请选择性别' }]">
            <template #input>
              <van-radio-group v-model="form.gender" direction="horizontal">
                <van-radio name="1" checked-color="rgba(0, 72, 255, 1)">男</van-radio>
                <van-radio name="2" checked-color="rgba(0, 72, 255, 1)">女</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field
            v-model="form.visitoridphone"
            left-icon="phone-o"
            name="visitoridphone"
            label="访客手机号"
            placeholder="访客手机号"
            maxlength="11"
            clearable
            :rules="[
              { required: true, message: '请输入手机号' },
              {
                validator: visitorPhoneNoValidator,
                message: '请输入正确的手机号'
              }
            ]"
          />
          <van-field
            v-model="form.visitoridno"
            icon-prefix="iconfont"
            left-icon="zhengjianhaoma"
            name="visitoridno"
            label="身份证号"
            placeholder="身份证号"
            clearable
            :rules="[
              { required: true, message: '请输入身份证号' },
              {
                validator: visitorIdentityNumValidator,
                message: '请输入正确的身份证号'
              }
            ]"
          />
          <van-field
            v-model="form.plateno"
            icon-prefix="iconfont"
            left-icon="cheliang"
            name="plateno"
            label="车牌号"
            placeholder="车牌号"
            clearable
            :rules="[
              {
                validator: platenoValidator,
                message: '请输入正确的车牌号'
              }
            ]"
          />
          <van-field name="uploader" left-icon="user-circle-o" label="头像">
            <template #input>
              <van-image width="80" height="80" :src="visitorphoto" />
            </template>
          </van-field>
        </div>
        <div class="visitor-btn">
          <van-button round block type="info" native-type="submit">提交预约信息</van-button>
        </div>
      </van-form>
    </div>
  </layout>
</template>

<script>
import layout from '../../layouts/layout'
import moment from 'moment'
import API from '@/api'
import { CONFIG_STORAGE } from '@/utils/configs'
import { VueDebounce, getStore } from '@/utils/util'
export default {
  data() {
    return {
      currentSelectTime: '', // 来访时间和离开时间类型
      timeShowPicker: false, // 是否显示时间选择器
      currentTimeDate: new Date(), // 时间选择器显示当前时间
      visitoropenid: getStore(CONFIG_STORAGE.openId), // 访问者openId
      visitorphoto: '', // 访问者头像
      form: {
        personname: '', // 被访人姓名
        jobno: '', // 被访人工号
        phoneno: '', // 被访人电话
        certificateno: '', // 被访人身份证
        visitcause: '', // 来访事由
        visitstarttime: '', // 来访时间
        visitendtime: '', // 离开时间
        visitorname: '', // 访客姓名
        gender: '', // 访客性别
        visitoridphone: '', // 访客手机号码
        visitoridno: '', // 访客身份证
        plateno: '' // 访客车牌号
      }
    }
  },
  components: {
    layout
  },
  mounted() {
    this.getPersonsInfo()
  },
  methods: {
    /**
     * @description 车牌号校验
     */
    platenoValidator(val) {
      const regStr = '^[0-9a-zA-Z京沪粤浙苏鲁陕晋冀豫川渝辽吉皖鄂湘赣闽甘宁蒙津贵云桂琼青新藏黑学挂领使港澳警\\*\\?]{0,8}$'
      const reg = new RegExp(regStr)
      return reg.test(val)
    },
    /**
     * @description 手机号校验
     */
    visitorPhoneNoValidator(val) {
      const regStr = /^[1][3,4,5,7,8,9][0-9]{9}$/g
      return regStr.test(val)
    },
    /**
     * @description 身份证校验
     */
    visitorIdentityNumValidator(val) {
      const regStr = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/g
      return regStr.test(val)
    },
    /**
     * @description 输入内容防抖函数
     */
    searchInputValue: VueDebounce('searchPerson', 1000),
    /**
     * @description 搜索被访者工号，电话，身份证
     */
    searchPerson() {
      // 如果身份证或者工号存在，不调用接口
      if (this.form.jobno && this.form.certificateno) return
      const params = {
        personname: this.form.personname,
        phoneno: this.form.phoneno
      }
      API.queryPersonApi(params).then(res => {
        if (res.code === '0') {
          const { jobno, phoneno, idcardno, personname } = res.data
          this.form.jobno = jobno
          this.form.phoneno = phoneno
          this.form.certificateno = idcardno
          this.form.personname = personname
        } else {
          this.$toast('未查询到被访问人信息')
        }
      })
    },
    /**
     * 根据openid查询信息
     */
    getPersonsInfo() {
      const data = {
        openid: getStore(CONFIG_STORAGE.openId)
      }
      API.queryPersonsInfoApi(data).then(res => {
        if (res.code === '0') {
          if (res.data) {
            const { idcardno, personname, phoneno, photo, plateno } = res.data
            this.form.visitoridphone = phoneno
            this.form.visitorname = personname
            this.form.visitoridno = idcardno
            this.form.plateno = plateno
            this.visitorphoto = photo
          }
        } else {
          this.$toast('未查询到信息请重新预约')
        }
      })
    },
    /**
     * @description 来访时间和离开时间选择
     */
    selectTime(val) {
      this.currentSelectTime = val
      this.timeShowPicker = true
    },
    /**
     * @description timepicker确认
     */
    timeOnConfirm(val) {
      const time = moment(val).format('YYYY-MM-DD HH:mm:ss')
      if (this.currentSelectTime === 'start') {
        this.form.visitstarttime = time
      } else {
        this.form.visitendtime = time
      }
      this.timeShowPicker = false
    },
    /**
     * @description 提交预约信息
     */
    onSubmit() {
      if (moment(this.form.visitendtime).isBefore(this.form.visitstarttime)) {
        this.$toast('离开时间必须晚于来访时间')
        return
      }
      this.$toast.loading({
        message: '提交中...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      const data = {
        ...this.form,
        visitoropenid: this.visitoropenid,
        visitorphoto: this.visitorphoto
      }
      API.visitorReservationApi(data).then(res => {
        if (res.code === '0') {
          this.$router.push({
            path: '/inviteSucess'
          })
          this.$toast.success('预约成功')
        } else {
          this.$toast('系统繁忙，请重新预约')
          this.$router.push({
            path: '/'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.visitor {
  padding-bottom: 54px;
  .visitor-card {
    position: relative;
    padding: 15px 0;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    margin-bottom: 10px;
    &-del {
      position: absolute;
      top: 10px;
      right: 15px;
      z-index: 9999;
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
}
::v-deep .van-button--info {
  background: linear-gradient(to right, rgba(102, 145, 255, 1), rgba(0, 72, 255, 1));
  border-color: rgba(102, 145, 255, 1);
}
</style>
