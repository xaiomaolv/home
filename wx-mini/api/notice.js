const request = getApp().request

// //POST /service/notice/community 查询绑定小区的公告
export function searchNotice (params) {
  return request({
    url: '/service/notice/community' +'?'+ 'pageNum='+ params.pageNum+'&'+'pageSize='+ params.pageSize,
    method: 'post',
    data: params
  })
}

//POST /property/notice/findById 根据id查询
export function noticeDetail (id) {
  return request({
    url: '/service/notice/' + id,
    method: 'get'
  })
}

//GET /property/notice/new 查询最新一条公告
export function noticeNew () {
  return request({
    url: '/property/notice/new',
    method: 'get'
  })
}
//GET /property/payBills/upcoming 查询最新一条公告
export function upcoming () {
  return request({
    url: '/cost/bills/upcoming',
    method: 'get'
  })
}
