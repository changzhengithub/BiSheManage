import request from '@/utils/request'

// 接口地址
const api = {
  stock: 'api.stock.get', // 获取活动列表
  logout: '/auth/logout' // 退出登录
}

// 获取活动列表
export function stockApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.stock,
      params: parameter
    }
  })
}
