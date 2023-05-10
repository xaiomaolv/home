const request = getApp().request

// post    /cost/category/autopay/category   参数  communityId   小区id   type固定值  1 {"params":{	"autoPayType":"1"}} 获取自主缴费的缴费类目
export function autoPayCategory (communityId) { 
  return request({
    url: '/cost/category/autopay/category',
    method: 'post',
    data:{
      'communityId': communityId,
      'type':1,
      'params':{
        'autoPayType':"1"
      }
    }
  })
}

// /cost/auto/mini/autobill  自主缴费  参数  communityId   小区id  payCycle   交费周期   totalBill  账单总额  categoryId  交费类目  intervalEnd  账单结束时间  intervalStart  账单开始间
export function miniAutoPayBill (data) { 
  return request({
    url: '/cost/auto/mini/autobill',
    method: 'post',
    data:data
  })
}
