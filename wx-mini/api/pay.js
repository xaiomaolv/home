const request = getApp().request

// GET /wallet/accountInfoQuery   查询是否实名认证 
export function accountInfoQuery(params) {
  return request({
    url: '/wallet/accountInfoQuery',
    method: 'GET'
  })
}
//POST /cost/bills/self 业主查询自己的账单
export const getPayBillsList = (params) => { 
  return request({
    url: '/cost/bills/self'+'?'+ 'pageNum='+ params.pageNum+'&'+'pageSize='+ params.pageSize + '&bindPay=' + params.bindPay,
    method: 'post',
    data: params
  })
}
// POST /property/payBills/transaction 查询交费明细
export const billsTransaction = (id) => { 
  return request({
    url: "/property/payBills/transaction",
    method: 'post',
    data:{
      'payBillId': id
    }
  })
}
// get /smsCode/payMoney?phone=1 发送短信
export function smsCode (phone) { 
  return request({
    url: '/smsCode/payMoney?phone='+ phone,
    method: 'get'
  })
}

// PUT /wallet/confirmPayment  确认进行支付
export function confirmPayment(data) {
  return request({
    url: '/wallet/confirmPayment/'+ data.id + '?phone='+ data.phone +'&smsCode='+ data.smsCode+'&type='+ data.type,
    method: 'PUT',
    data: data
  })
}
// POST /property/payBills/search    //交费账单
export function payBills(params) {
  return request({
    url: '/property/payBills/search' +'?'+ 'pageNum='+ params.pageNum+'&'+'pageSize='+ params.pageSize,
    method: 'POST',
    data: {
      state: params.state
    }
  })
}
//催交 /cost/bills/remind/{id} 催缴费
export const payRemind = (id) => {
  return request({
    url: "/cost/bills/remind/" + id,
    method: 'get',
  })
}

 // 交费记录/账单(户主)
 export const paySingleBills = (data) => {
  return request({
    url: "/property/bind/user/userRoom",
    method: 'POST',
    data
  })
}

 // 交费明细 /cost/bills/transaction 查询缴费明细
 export const paySingledetail = (data) => {
  return request({
    url: "/cost/bills/transaction",
    method: 'POST',
    data
  })
}

 // /cost/bills/pay/record 交费记录(查询个人所有交费记录)
 export const paySingleRecord = (params) => {
  return request({
    url: "/cost/bills/pay/record" +'?'+ 'pageNum='+ params.pageNum+'&'+'pageSize='+ params.pageSize,
    method: 'POST',
    data:params
  })
}

// POST /property/payBills/findById 根据id查询
export const payBillsFindById = (id) => {
  return request({
    url: "/cost/bills/"+ id,
    method: 'get'
  })
}

// /cost/bills/shortcut 查询常用

export const shortcut = (params) => {
  return request({
    url: "/cost/bills/shortcut"+'?'+ 'pageNum='+ params.pageNum+'&'+'pageSize='+ params.pageSize,
    method: 'get',
  })
}


//POST /property/payBills/search 查询
export const payBillSearch = (params) => {
  return request({
    url: "/cost/bills/list" +'?'+ 'pageNum='+ params.pageNum+'&'+'pageSize='+ params.pageSize,
    method: 'get',
    data: params
  })
}
