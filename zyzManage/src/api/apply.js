import request from '@/utils/request'

// 接口地址
const api = {
  userstock: 'api.map.userstock.get', // 查看报名列表
  userstockState: 'api.map.userstock.state.set', // 取消报名
  userstockRemark: 'api.map.userstock.remark.set', // 修改备注
  userstockSet: 'api.map.userstock.set' // 报名
}

// 查看报名列表
export function userstockApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.userstock,
      params: parameter
    }
  })
}

// 取消报名
export function userstockStateApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.userstockState,
      params: parameter
    }
  })
}

// 修改备注
export function userstockRemarkApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.userstockRemark,
      params: parameter
    }
  })
}

// 报名
export function userstockSetApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.userstockSet,
      params: parameter
    }
  })
}