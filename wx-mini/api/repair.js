const request = getApp().request


// /property/category/search     category 查询
export function category(id) {
  return request({
    url: '/cost/category/options',
    method: 'post',
    data:{
        "communityId": id, // 下拉获取
        "pageNum": 1,
        "pageSize": 20,
        "type": 2  // 写死为2
    }
  })
}
// POST /property/repair/ 新增

export function addRepair(params) {
  return request({
    url: '/service/repair/',
    method: 'post',
    data: params
  })
}

// POST /property/repair/self 查询自己的报修单 报修状态 1.待处理 2.处理中 3.已处理 4.已评价 5.退回
// /service/repair/self 查询自己的报修单
export function repairList(params) { 
  return request({
    url: '/service/repair/self'  +'?'+ 'pageNum='+ params.pageNum+'&'+'pageSize='+ params.pageSize,
    method: 'post',
    data: params
  })
}
//根据id查询报修管理
export function getRepairById (id) {
  return request({
      url:'/service/repair/getById/'+id,
      method:'get'
  })
}

// 派单管理 /service/repair/dispatch 派单
export const dispatchRepair = (params) => {
  return request({
      url: "/service/repair/dispatch",
      method: 'post',
      data:params
  })
}

// 维修人员
export const repairUser = (params, communityId) => {
  return request({
      url: "/user/repair/userList/" + communityId,
      method: 'get',
      data:params
  })
}
// 物业报修查询 
export function propertyRepairList(params) {
  return request({
    url: '/service/repair/list' +'?'+ 'page='+ params.page+'&'+'pageSize='+ params.pageSize,
    method: 'get',
    data: params
  })
}

// 维修人员报修查询  /service/repair/service 维修人员查询自己的报修单
export function serviceRepairList(params) {
  return request({
    url: '/service/repair/service' +'?'+ 'page='+ params.page+'&'+'pageSize='+ params.pageSize,
    method: 'post',
    data: params
  })
}
//  /service/repair/complete 维修人员完成
export function repairComplate(params) {
  return request({
    url: '/service/repair/complete',
    method: 'post',
    data: params
  })
}

// POST /service/repair/evaluation 评价
export function repaireValuation(params) {
  return request({
    url: '/service/repair/evaluation',
    method: 'post',
    data: params
  })
}


// POST /service/repair/finish 管理员完成 派单完成
export function finish(params) {
  return request({
    url: '/service/repair/finish',
    method: 'post',
    data: params
  })
}

// 报修取消 Cancel
export function repairUpdata(params) {
  return request({
    url: '/service/repair',
    method: 'put',
    data: params
  })
}
