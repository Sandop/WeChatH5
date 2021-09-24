<template>
  <div>访问错误</div>
</template>

<script>

export default {
  name: 'Error',
  components: {
  },
  data () {
    return {
      errorText: {
        403: this.$t('errorPage.error403'), // 您无权访问该页面
        404: this.$t('errorPage.error404'), // 您访问的页面不存在
        500: this.$t('errorPage.error500') // 服务器异常，请联系管理员
      }
    }
  }
}
</script>
