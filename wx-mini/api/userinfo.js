const request = getApp().request

//POST /property/wxUserInfo/ 保存微信用户信息
export function saveWxUserInfo (params) {
  return request({
    url: '/wxUserInfo/',
    method: 'post',
    data: params
  })
}
// DELETE /property/wxUserInfo/ 删除微信用户信息
export function delWxUserInfo (params) {
  return request({
    url: '/wxUserInfo/',
    method: 'DELETE'
  })
}
// GET /property/wxUserInfo/ 查询微信用户信息
export function seachWxUserInfo (params) {
  return request({
    url: '/wxUserInfo/' + '?type='+ (params != undefined &&  params.type != undefined ?params.type:"0"),
    method: 'GET'
  })
}