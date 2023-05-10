const request = getApp().request

// GET /wallet/checkcard/{card} 银行卡查询
export function checkcard (card_no) {
  return request({
    url: '/wallet/checkcard/' + card_no,
    method: 'get'
  })
}

//POST /wallet/accountScodeVerify 结算账户短信验证码校验 
export function ScodeVerify (params) {
  return request({
    url: '/wallet/accountScodeVerify',
    method: 'post',
    data: params
  })
}
//POST /wallet/bindAccount 绑卡钱包开户
export function bindAccount (params) {
  return request({
    url: '/wallet/bindAccount',
    method: 'post',
    data: params
  })
}
//GET /wallet/checkcard/{card} 检查卡号是否是工行卡
//POST /wallet/ocr OCR识别
export function OCR (params) {
  return request({
    url: '/wallet/ocr',
    method: 'post',
    data: params
  })
}

// 解除绑定银行卡信息
// GET  /smsCode/closeBindCard 发送解除绑定银行卡验证码
export function restoreSendPhone (phone) { 
  return request({
    url: '/smsCode/restoreSendPhone?phone=' + phone,
    method: 'get'
  })
}



// 解除绑定银行卡信息
// GET  /smsCode/closeBindCard 发送解除绑定银行卡验证码
export function closeBindCard () { 
  return request({
    url: '/smsCode/closeBindCard',
    method: 'get'
  })
}

// 解除绑定银行卡信息
// POST  /wxUserInfo/closesms 解除绑定银行卡信息验证短信验证码
export function checkCloseBindCard (params) { 
  return request({
    url: '/wxUserInfo/closesms',
    method: 'post',
    data:params
  })
}

// 查看是否已经绑定了信息
// POST  /wxUserInfo/binduser 查看是否已经绑定了信息
export function checkBinduser (params) { 
  return request({
    url: '/wxUserInfo/binduser',
    method: 'post',
    data:params
  })
}

// 恢复绑定银行卡信息
// POST  /wxUserInfo/restorebind 恢复绑定银行卡信息
export function restoreBindCard (params) { 
  return request({
    url: '/wxUserInfo/restorebind',
    method: 'post',
    data:params
  })
}


// 卡号查看
// GET  /smsCode/showCardNo 发送查看卡号验证码
export function smsCode () { 
  return request({
    url: '/smsCode/showCardNo',
    method: 'get'
  })
}
//GET  /wallet/showCardNo?smsCode=  校验短信验证码获取卡号
export function showCardNo(code) {
  return request({
    url: '/wallet/showCardNo?smsCode=' + code,
    method: 'get'
  })
}
// accountBinding 更换卡号发送短信
export function accountBinding(card) {
  return request({
    url: '/wallet/accountBinding',
    method: 'post',
    data:card
  })
}
// cardChangeVerify   修改绑定的个人银行卡短信验证
export function cardChangeVerify(params) {
  return request({
    url: '/wallet/cardChangeVerify',
    method: 'post',
    data:params
  })
}

// /wallet/owner post
export function getowner(params) {
  return request({
    url: '/wallet/owner',
    method: 'post',
    data:params
  })
}
/**
 * 图片转经过压缩的base64
 * 最大的宽高为1024
 * 调换用页面必须还有canvas 且id为canvas
 */
export function img2Base64 (src) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: src,
      success(imgInfo) {
        // 计算高度计算方式，此高度只试用于身份证，其他场景需调节
        let {
          width,
          height
        } = imgInfo
        let scale = 1
        if (width > height) {
          scale = 1024 / width
          height = height * scale
          width = 1024
        } else {
          scale = 1024 / height
          width = width * scale
          height = 1024
        }

        // 获取画布
        const canvas = wx.createCanvasContext('canvas')
        canvas.drawImage(src, 0, 0, width, height)
        canvas.draw(false, () => {
          // 保存图片
          wx.canvasToTempFilePath({
            canvasId: 'canvas',
            width: width,
            height: height,
            destWidth: width/2,
            destHeight: height/2,
            fileType: 'jpg',
            quality: 0.6,
            success(file) {
              wx.getFileSystemManager().readFile({
                filePath: file.tempFilePath,
                encoding: 'base64',
                success: res => resolve(res.data),
                fail: reject
              })
              // getLocalBuffer(file.tempFilePath).then(imgRes => {
              //   const base64 = wx.arrayBufferToBase64(imgRes)
              //   resolve(base64)
              // }).catch(error => {
              //   reject(error)
              // })
            },
            complete: res => {
              app.log('canvasToTempFilePath complete', res)
            }
          })
        })
      }
    })
  })
}