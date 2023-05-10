import { login } from 'util'
import { encryptData, decryptData, verifySign, sign } from 'soil-encrypt'


// 授权域名网络接口基础路径
// export const baseUrl ='http://ip.ynejkj.com:10080/eh-api-dev'
// export const baseUrl ='https://icbc.ynejkj.com/eh-api-dev/'
// export const baseUrl ='https://icbc.ynejkj.com/eh-api-test/'
// export const baseUrl ='https://icbc.ynejkj.com/rej-test'
export const baseUrl ='https://yn.icbc.com.cn/corp/api/ecommunity-test'
// export const baseUrl ='https://yn.icbc.com.cn/corp/api/ecommunity'
//  export const baseUrl ='http://10.3.7.82:8080'
// export const baseUrl ='http://ucmed.iok.la/' 

// ejAppId= 'wxb1f2a5ece9d820c3'
// icbcAppId = "wx9a624448d5180e93"
// --------------------以下为网络请求-------------------------

/**
 * 通用请求
 * 使用data为 表单 提交
 * 使用params 为 json提交
 * @param {url , method, header, data, params, responseType, local, cancleAuth} query
 */
const request = query => {
  let { url, method, header, data, params, responseType, local, cancleAuth } = query

  // 需要form与data 绑定
  query.data = Object.assign({}, data)

  if("get" != method) {
    // 加密 包含签名
    if (getApp().encryption && data) {
      encryptData(query)
    }

    // 签名
    if (!getApp().encryption && data) {
      sign(query)
    }
  }
  // const token = getApp().getToken()
  const code = getApp().getCode()

  // const formHeader = { 'content-type': 'application/x-www-form-urlencoded', 'X-Token': token }
  const formHeader = { 'content-type': 'application/x-www-form-urlencoded', 'wx-code': code }
  // const jsonHeader = { 'content-type': 'application/json', 'X-Token': token }
  const jsonHeader = { 'content-type': 'application/json','wx-code': code }
  wx.showLoading({
    title: getApp().T.common ? getApp().T.common.loading : '加载中...',
    mask: true
  })

  // 微信不支持await Promise，先定义
  const req = () => {
    return new Promise((resolve, reject) => {
      getApp().log('request', query)
      wx.request({
        url: local ? url : baseUrl + url,
        method: method,
        header: params ? { ...formHeader, ...header } : { ...jsonHeader, ...header },
        data: params || query.data,
        responseType: responseType,
        success: res => {
          // 加密握手url
          res.data.rKey ? wx.setStorageSync('rKey', res.data.rKey): null;
          getApp().log('responce', res.data)
          // 解密包含验签
          if (getApp().encryption) {
            decryptData(res)
            console.log(decryptData(res),'================')
          }
          // 验签
          if (!getApp().encryption && getApp().sign && res.code == 200) {
            verifySign(res)
          }
          resolve(res.data)
        },
        fail: err => reject(err),
        complete: () => wx.hideLoading()
      })
    })
  }

  // 权限验证
  if (!cancleAuth) {
    return new Promise((resolve, reject) => {
      getApp().login().then(loginRes => {
        header = {
          'wx-code': loginRes.code,
          ...header
        }
        req().then(res => resolve(res)).catch(err => reject(err))
      })
    })
  }
  return req()
}

/**
 * 获取本地buffer
 * @param {url} url
 */
const getLocalBuffer = url => {
  return request({
    url: url,
    method: 'get',
    responseType: 'arraybuffer',
    local: true
  })
}

export default { baseUrl, request, getLocalBuffer }
