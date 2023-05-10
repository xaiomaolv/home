const request = getApp().request

// PUT /wallet/confirmPayment  确认进行支付
export function confirmPayment(data) {
  return request({
    url: '/wallet/confirmPayment/'+ data.id + '?phone='+ data.phone +'&smsCode='+ data.smsCode+'&type=2',
    method: 'PUT',
    data: data
  })
}

//POST /cost/bills/self 业主查询自己的燃气账单
export const getPaySelfList = (params) => { 
    return request({
      url: '/cost/bills/self'+'?'+ 'pageNum='+ params.pageNum+'&'+'pageSize='+ params.pageSize,
      method: 'post',
      data: {
        type: params.type
      },   
    })
}

// 分期账单 /cost/bills/self/ment
export const getPaySelfMent = (params) => { 
    console.log(params.type,'=========111111')
    return request({
      url: '/cost/bills/self/ment',
      method: 'post',
      data: params
    })
}
