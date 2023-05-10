const request = getApp().request

// 验证无感停车是否已经成功开通
export function checkncpayln () { 
  return request({
    url: '/wallet/checkncpayln',
    method: 'post',
    data:{}
  })
}
//
export function cardtype (params) {
  return request({
    url: '/wallet/cardtype',
    method: 'post',
    data: params
  })
}
