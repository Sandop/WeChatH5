<template>
  <layout>
    <div class="visitor">
      <van-form @submit="onSubmit">
        <div class="visitor-card">
          <van-field name="radio" label="人员类型" :rules="[{ required: true, message: '请选择人员类型' }]">
            <template #input>
              <van-radio-group v-model="form.persontype" direction="horizontal">
                <van-radio name="0">内部人员</van-radio>
                <van-radio name="1">访客</van-radio>
              </van-radio-group>
            </template>
          </van-field>
          <van-field v-model="form.personname" left-icon="user-o" name="personname" label="姓名" placeholder="姓名" clearable :maxlength="12" :rules="[{ required: true, message: '请输入姓名' }]" />
          <van-field
            v-model="form.phoneno"
            left-icon="phone-o"
            name="phoneno"
            label="手机号"
            placeholder="手机号"
            maxlength="11"
            clearable
            :rules="[
              { required: true, message: '请输入手机号' },
              {
                validator: phonenoValidator,
                message: '请输入正确的手机号'
              }
            ]"
          />
          <van-field
            v-model="form.idcardno"
            icon-prefix="iconfont"
            left-icon="zhengjianhaoma"
            name="idcardno"
            label="身份证号"
            placeholder="身份证号"
            clearable
            :rules="[
              { required: true, message: '请输入身份证号' },
              {
                validator: idcardnoValidator,
                message: '请输入正确的身份证号'
              }
            ]"
          />
          <van-field
            v-if="form.persontype === '0'"
            v-model="form.jobno"
            icon-prefix="iconfont"
            left-icon="zhengjianhaoma"
            name="jobno"
            label="工号"
            placeholder="工号"
            clearable
            :rules="[{ required: true, message: '请输入工号' }]"
          />
          <van-field v-if="form.persontype === '1'" name="uploader" left-icon="user-circle-o" label="上传头像">
            <template #input>
              <van-uploader v-model="form.photo" :before-read="beforePhotoRead" :max-count="1" />
            </template>
          </van-field>
          <van-field
            v-if="form.persontype === '1'"
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
        </div>
        <div class="visitor-btn">
          <van-button round block type="info" native-type="submit">提交信息</van-button>
        </div>
      </van-form>
    </div>
  </layout>
</template>

<script>
import layout from '../../layouts/layout'
import API from '@/api'
import { getStore } from '@/utils/util'
import { CONFIG_STORAGE } from '@/utils/configs'
export default {
  data() {
    return {
      form: {
        persontype: '', // 登记人员类型（0-内部人员，1-访客）
        personname: '', // 姓名
        phoneno: '', // 手机号
        idcardno: '', // 身份证号
        jobno: '', // 工号
        photo: [], // 访客头像
        plateno: '' // 车牌号
      }
    }
  },
  components: {
    layout
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
     * @description 手机号码校验
     */
    phonenoValidator(val) {
      const regStr = /^[1][3,4,5,7,8,9][0-9]{9}$/g
      return regStr.test(val)
    },
    /**
     * @description 身份证校验
     */
    idcardnoValidator(val) {
      const regStr = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/g
      return regStr.test(val)
    },
    /**
     * @description 头像上传格式校验
     */
    beforePhotoRead(file) {
      return ['image/jpeg', 'image/png'].includes(file.type)
    },
    /**
     * @description 提交登记信息
     */
    onSubmit(values) {
      this.$toast.loading({
        message: '提交中...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      const data = {
        ...this.form,
        openid: getStore(CONFIG_STORAGE.openId)
      }
      API.submitPersonRecordApi(data).then(res => {
        if (res.code === '0') {
          this.$router.push({
            path: '/inviteSucess'
          })
          this.$toast.success('登记成功')
        } else {
          this.$toast.success('系统异常请稍后再试')
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
