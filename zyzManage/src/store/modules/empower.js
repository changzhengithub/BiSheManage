/**
 * @desc 状态管理器 - 权限控制
 * @author xxx
*/

import storage from 'store'
// eslint-disable-next-line
import { loginApi, infoApi } from '@/api/empower'
import { asyncRouterMap } from '@/router/router.config'
import { ACCESS_TOKEN, USER_INFO } from '@/store/mutation-types'

const empower = {
  state: {
    permission: [], // 权限列表
    routerList: [], // 路由列表
  },
  mutations: {
    // 用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    // 设置权限列表
    setPermission(state, permission) {
      state.permission = permission
    },
    // 过滤后的路由列表
    setRouterList(state, routerList) {
      state.routerList = routerList
    }
  },
  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginApi(userInfo).then(res => {
          if (res.code !== 200) {
            reject(new Error(res.msg))
            return
          }
          const { token, data } = res
          storage.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
          storage.set(USER_INFO, data)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit }, params) {
      return new Promise((resolve, reject) => {
        infoApi(params).then(res => {
          if (res.code !== 200) {
            reject(new Error(res.msg))
            return
          }
          const data = res.data
          // 缓存用户信息
          storage.set(USER_INFO, data)
          commit('setUserInfo', data)
          // 获取用户权限列表，可以是后端直接返回权限列表，也可以根据返回角色类型设置权限列表
          const { admin } = data
          let permissionList = []
          if (admin === 1) {
            permissionList = ['personal', 'activity', 'news', 'user_manage', 'apply'] // 管理员
          } else {
            permissionList = ['personal', 'activity', 'news', 'apply'] // 非管理员
          }
          if (permissionList.length) {
            // 保存权限列表
            commit('setPermission', permissionList)
          } else {
            reject(new Error('角色必须是非空数组!'))
          }
          resolve(permissionList)
        }).catch(error => {
          reject(error)
        })
      })
    },
  
    // 根据role过滤对应路由
    FilterRoutes({ commit }, res) {
      const { permissionList } = res
      return new Promise(resolve => {
        const routerList = filterAsyncRouter(asyncRouterMap, permissionList)
        console.log(routerList)
        routerList.push({
          path: '*',
          redirect: '/exception',
          hidden: true
        })
        commit('setRouterList', routerList)
        resolve()
      })
    },
  
    // 登出
    Logout({ commit }) {
      commit('setPermission', [])
      commit('setRouterList', [])
      commit('setUserInfo', {})
      storage.remove(ACCESS_TOKEN)
      storage.remove(USER_INFO)
    }
  }
}

export default empower

// 根据权限列表过滤路由
// 根据具体业务来进行过滤
function filterAsyncRouter(routerMap, permissionList) {
  const routerList = routerMap.filter(route => {
    if (route.meta && route.meta.permission) {
      const { permission } = route.meta
      if (permissionList.includes(permission) || route.name === 'Index') {
        if (route.children && route.children.length) {
          route.children = filterAsyncRouter(route.children, permissionList)
          // 如果有子路由重定向到第一个
          if (route.children.length) route.redirect = route.children[0].path
        }
        return true
      }
    }
    return false
  })
  return routerList
}
