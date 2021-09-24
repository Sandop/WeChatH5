/*
 * @Descripttion:
 * @version:
 * @Author: Sando
 * @Date: 2021-08-30 10:35:56
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-08-30 15:14:38
 */
import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  userInfo: null
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {}
})
