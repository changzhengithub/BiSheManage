import request from '@/utils/request'

// 接口地址
const api = {
  user: 'api.user.get', // 获取用户列表
  userSet: 'api.user.set', // 用户信息修改
  userAdd: 'api.user.add', // 用户信息修改
  userDel: 'api.user.del' // 用户信息删除
}

// 获取用户列表
export function userApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.user,
      params: parameter
    }
  })
}

// 用户信息修改
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

// 用户信息增加
export function userAddApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.userAdd,
      params: parameter
    }
  })
}

// 用户信息删除
export function userDelApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.userDel,
      params: parameter
    }
  })
}
