
class BaseEntity {
  constructor(baseUrl, fields) {
    // 字段可有可无，主要方便对接
    this.fields = fields
    const request = getApp().request

    // 增加
    this.save = data => {
      return request({
        url: baseUrl + '/' + data.id,
        method: 'post',
        data
      })
    }

    // 详情获取一个
    this.detail = params => {
      return request({
        url: baseUrl + '/' + data.id,
        method: 'get',
        params
      })
    }

    // 获取列表
    this.list = params => {
      return request({
        url: baseUrl + '/' + data.id,
        method: 'get',  
        params
      })
    }

    // 修改
    this.update = data => {
      return request({
        url: baseUrl + '/' + data.id,
        method: 'put',
        data
      })
    }
    

    // 删除
    this.delete = data => {
      return request({
        url: baseUrl + '/' + data.id,
        method: 'delete',
        data
      })
    }
  }
}
export default BaseEntity

