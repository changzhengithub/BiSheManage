import request from '@/utils/request'

// 接口地址
const api = {
  news: 'api.news.get', // 获取咨询列表
  newsAdd: 'api.news.add', // 添加咨询
  newsSet: 'api.news.set', // 修改咨询
  newsDel: 'api.news.del', // 删除咨询
  newsDetail: 'api.news.content.get' // 详情
}

// 获取咨询列表
export function newsApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.news,
      params: parameter
    }
  })
}

// 添加咨询
export function newsAddApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.newsAdd,
      params: parameter
    }
  })
}

// 修改咨询
export function newsSetApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.newsSet,
      params: parameter
    }
  })
}

// 删除咨询
export function newsDelApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.newsDel,
      params: parameter
    }
  })
}
// 详情
export function newsDetailApi(parameter) {
  return request({
    url: 'index.php/api',
    method: 'POST',
    data: {
      action: api.newsDetail,
      params: parameter
    }
  })
}
