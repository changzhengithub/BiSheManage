import request from '@/utils/request'

// 接口地址
const api = {
  login: 'api.user.login', // 登录
  logout: '/auth/logout', // 退出登录
  info: 'api.user.own.get' // 获取用户信息
}

// 登录
export function loginApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.login,
      params: parameter
    }
  })
}

// 获取用户信息
export function infoApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.info,
      params: parameter
    }
  })
}

// 退出登录
export function logoutApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.login,
      params: parameter
    }
  })
}
