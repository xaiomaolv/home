const request = getApp().request

// //POST /property/notice/search 查询
export function searchNotice () {
  return request({
    url: '/property/notice/search',
    method: 'post',
    data:{
      "pageNum": 1,
      "pageSize": 20
    }
  })
}


