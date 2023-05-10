const request = getApp().request


// /property/category/search     category 查询
export function category(id) {
  return request({
    url: '/property/category/search',
    method: 'post',
    data:{
        "communityId": id, // 下拉获取
        "pageNum": 1,
        "pageSize": 20,
        "type": 2  // 写死为2
    }
  })
}
// POST /property/suggestions/ 新增

export function addSuggestions(params) {
  return request({
    url: '/service/suggestions/',
    method: 'post',
    data: params
  })
}

// POST /service/suggestions/self 查询自己的投诉建议
export function suggestioLlist(params) {
  return request({
    url: '/service/suggestions/self' +'?'+ 'pageNum='+ params.pageNum+'&'+'pageSize='+ params.pageSize,
    method: 'post',
    data: params
  })
}