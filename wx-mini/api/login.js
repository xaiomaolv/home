const request = getApp().request

//GET /info 获取个人信息。账号是否与该微信绑定存在
export function info () {
  return request({
    url: '/info',
    method: 'get'
  })
}
//GET /smsCode/wxAccount 微信验证账号短信验证码获取
export function smsCode (phone) {
  return request({
    url: '/smsCode/wxAccount?phone='+ phone,
    method: 'get'
  })
}

// POST/checkPhone用户账号验证
export function checkPhone(params) {
  return request({
    url: '/checkPhone',
    method: 'post',
    data:params
  })
}
