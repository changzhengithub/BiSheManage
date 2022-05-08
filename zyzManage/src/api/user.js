import request from '@/utils/request'

// 接口地址
const api = {
  userSet: 'api.user.own.set' // 用户修改自己信息
}

// 用户修改自己信息
export function userSetApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.userSet,
      params: parameter
    }
  })
}