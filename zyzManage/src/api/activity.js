import request from '@/utils/request'

// 接口地址
const api = {
  activity: 'api.stock.get', // 获取项目列表
  activityAdd: 'api.stock.add', // 添加项目
  activitySet: 'api.stock.set', // 修改项目
  activityDel: 'api.stock.del', // 删除项目
  activityDetail: 'api.stock.content.get' // 项目详情
}

// 获取项目列表
export function activityApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.activity,
      params: parameter
    }
  })
}

// 添加项目
export function activityAddApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.activityAdd,
      params: parameter
    }
  })
}

// 修改项目
export function activitySetApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.activitySet,
      params: parameter
    }
  })
}

// 删除项目
export function activityDelApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.activityDel,
      params: parameter
    }
  })
}

// 详情
export function activityDetailApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.activityDetail,
      params: parameter
    }
  })
}