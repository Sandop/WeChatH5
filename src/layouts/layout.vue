<template>
  <div class="layout">
    <div v-if="false" class="layout-header">
      <i-nav :title="title" @goback="handleGoback">
        <template slot="right">
          <slot name="nav-right"></slot>
        </template>
      </i-nav>
    </div>
    <div class="layout-content">
        <div class="layout-content-wrap">
            <slot></slot>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  data () {
    return {
      whiteList: [],
      blackList: []
    }
  },
  methods: {
    handleGoback () {
      this.$router.go(-1)
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler (newRoute, oldRoute) {
        if (newRoute.meta.cache) {
          this.whiteList = Array.from(
            new Set([newRoute.name, ...this.whiteList])
          )
          this.blackList = this.blackList.filter(
            (name) => name !== newRoute.name
          )
        } else {
          this.whiteList = this.whiteList.filter(
            (name) => name !== newRoute.name
          )
          this.blackList = Array.from(
            new Set([newRoute.name, ...this.blackList])
          )
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  position: relative;
  height: 100%;
  width: 100%;

  .layout-header {
    position: relative;
    height: 44px;
    width: 100%;
  }

  .layout-content {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    &-wrap{
        position: relative;
        height: 100%;
        width: 100%;
        background: rgba(245, 245, 245, 1);
        padding: 12px 10px;
        overflow-y: auto;
        box-sizing: border-box;
    }
  }
}
</style>
