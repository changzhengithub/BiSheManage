/**
 * @desc 状态管理器 - 公共数据
 * @author xxx
*/

const publicVuex = {
  state: {
    userId: ''
  },

  mutations: {
    setUserId (state, userId) {
      state.userId = userId
    }
  },
  getters: {},
  actions: {}
}

export default publicVuex