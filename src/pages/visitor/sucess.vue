<template>
  <div class="success">
    <div class="success-img">
      <img :src="imgSrc" alt="" />
    </div>
    <div class="success-desc">提交信息成功，请等待审核</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgSrc: require('./sucess.jpg')
    }
  },
  mounted() {
    setTimeout(() => {
      this.$router.push({
        path: '/'
      })
    }, 2500)
  }
}
</script>

<style lang="scss" scoped>
.success {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f6f6f6;
  &-img {
    width: 100px;
    margin-bottom: 20px;
    img {
      width: 100%;
      vertical-align: top;
    }
  }
}
</style>
