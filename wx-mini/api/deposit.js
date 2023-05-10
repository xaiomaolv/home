const request = getApp().request

// post    /cost/category/options   参数  communityId   小区id   type固定值  3 获取押金类型
// 验证无感停车是否已经成功开通
export function costCategory (communityId) { 
  return request({
    url: '/cost/category/options',
    method: 'post',
    data:{
      'communityId': communityId,
      'type':3
    }
  })
}

// /community/room/loginuserroom  获取当前可以选择的小区
export function loginuserroom () { 
  return request({
    url: '/community/room/loginuserroom',
    method: 'post',
    data:{} 
  })
}

// /wallet/depositPay   post 支付押金
export function depositPay (params) { 
  return request({
    url: '/wallet/depositPay'+ '?phone='+ params.phone +'&smsCode='+ params.smsCode,
    method: 'post',
    data: params
  })
}