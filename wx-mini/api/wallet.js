const request = getApp().request

//GET /wallet/accountBindingQuery    钱包所有绑定卡查询
export function accountBindingQuery () {
  return request({
    url: '/wallet/accountBindingQuery',
    method: 'get'
  })
}

//GET /wallet/mainCard/{bindCardId}  钱包绑定卡主卡设置
export function mainCard (bindCardId) {
  return request({
    url: '/wallet/mainCard/'+ bindCardId,
    method: 'get'
  })
}
//Post /wallet/addCard             钱包添加绑定银行卡
export function addCard (params) { 
  return request({
    url: '/wallet/addCard',
    method: 'post',
    data: params
  })
}
//POST /wallet/cardScodeVerify       钱包添加绑定银行卡短信校验
export function cardScodeVerify (params) {
  return request({
    url: '/wallet/cardScodeVerify',
    method: 'post',
    data: params
  })
}
// POST /wallet/accountRecharge       钱包充值
export function accountRecharge (params) {
  return request({
    url: '/wallet/accountRecharge',
    method: 'post',
    data: params
  })
}

// GET /wallet/transResult/{corpSerno}  钱包充值结果异步查询
export function transResult (corpSerno) {
  return request({
    url: '/wallet/transResult/' + corpSerno,
    method: 'get'
  })
}

// POST  /wallet/accountWithdraw    钱包提现
export function accountWithdraw (params) {
  return request({
    url: '/wallet/accountWithdraw',
    method: 'post',
    data: params
  })
}

// POST   /wallet/accountDetailQuery   钱包交易成功明细记录
export function accountDetailQuery (params) {
  return request({
    url: '/wallet/accountDetailQuery',
    method: 'post',
    data: params
  })
}

// POST  /wallet/bindTransLog      查询钱包充值提现
export function bindTransLog (params) {
  return request({
    url: '/wallet/bindTransLog',
    method: 'post',
    data: params
  })
}