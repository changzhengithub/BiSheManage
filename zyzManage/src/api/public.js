import request from '@/utils/request'

// 接口地址
const api = {
  upload: 'index.php/upload' // 文件上传
}

// 文件上传
export function uploadApi(parameter) {
  return request({
    url: api.upload,
    method: 'POST',
    data: parameter
  })
}
