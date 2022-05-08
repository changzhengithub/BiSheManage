import request from '@/utils/request'

// 接口地址
const api = {
  homeInfo: 'api.conf.get', // 获取用户信息
  logout: '/auth/logout' // 退出登录
}

// 获取用户信息
export function homeInfoApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.homeInfo,
      params: parameter
    }
  })
}
