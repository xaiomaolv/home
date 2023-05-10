import BaseEntity from './base'

class WxMiniUser extends BaseEntity {
  constructor(fields) {
    super('这里写url', fields)
    const app = getApp()
    const request = app.request
    const login = app.login
    const getUserInfo = app.getUserInfo
    self = this
    /**
     * 完整的miniUser获取
     */
    this.userInfo = function () {
      return new Promise((resolve, reject) => {
        getUserInfo().then(userRes => {
          const data = {
            encryptedData: userRes.encryptedData,
            iv: userRes.iv
          }
          login().then(loginRes => {
            app.log( loginRes.code)
            data['code'] = loginRes.code
            request({
              url: self.baseUrl + '/wx/mini/decrypt',
              method: 'post',
              data,
              cancleAuth: true  // 特殊方法，强制取消微信授权验证
            }).then(res => resolve(res)).catch(err => reject(err))
          }).catch(err => {
            app.log(err)
          })
        }).catch(err => {
          app.log(err)
        })
      })
    }
    /**
     * 获取电话号码
     */
    this.phoneNumber = function (data) {
      return new Promise((resolve, reject) => {
        if (!data.iv || !data.encryptedData) {
          const err = "参数中应当包含{iv,encryptedData}"
          app.err(err)
          reject(err)
          return
        }
        login().then(loginRes => {
          data['code'] = loginRes.code
          request({
            url: self.baseUrl + '/wx/mini/decrypt',
            method: 'post',
            data,
            cancleAuth: true  // 特殊方法，强制取消微信授权验证
          }).then((res) => {
            if (res.data && res.data.phoneNumber) {
              resolve(res)
              return
            }
            wx.showToast({
              title: '授权失败请重试！',
              icon: 'none'
            })
          }).catch(err => reject(err))
        })
      })
    }

    this.openid = function () {
      return new Promise((resolve, reject) => {
        login().then(loginRes => {
          request({
            url: self.baseUrl + '/wx/mini/openid/' + loginRes.code,
            method: 'get',
            cancleAuth: true  // 特殊方法，强制取消微信授权验证
          }).then(res => resolve(res)).catch(err => reject(err))
        }).catch(err => {
          app.log(err)
        })
      })
    }
  }
}
//字段可有可无，主要方便对接
const fields = {
  'code': {
    'name': 'wx_mini_user.code',
    'view': true,
    'form_view': true,
    'edit': true,
    'type': 'input'
  },
  'encryptedData': {
    'name': 'wx_mini_user.encrypted_data',
    'view': true,
    'form_view': true,
    'edit': true,
    'type': 'input'
  },
  'iv': {
    'name': 'wx_mini_user.iv',
    'view': true,
    'form_view': true,
    'edit': true,
    'type': 'input'
  },
  'avatarUrl': {
    'name': 'wx_mini_user.avatar_url',
    'view': true,
    'form_view': true,
    'edit': true,
    'type': 'input'
  },
  'gender': {
    'name': 'wx_mini_user.gender',
    'view': true,
    'form_view': true,
    'edit': true,
    'type': 'input'
  },
  'nickName': {
    'name': 'wx_mini_user.nick_name',
    'view': true,
    'form_view': true,
    'edit': true,
    'type': 'input'
  },
  'country': {
    'name': 'wx_mini_user.country',
    'view': true,
    'form_view': true,
    'edit': true,
    'type': 'input'
  },
  'province': {
    'name': 'wx_mini_user.province',
    'view': true,
    'form_view': true,
    'edit': true,
    'type': 'input'
  },
  'city': {
    'name': 'wx_mini_user.city',
    'view': true,
    'form_view': true,
    'edit': true,
    'type': 'input'
  },
  'language': {
    'name': 'wx_mini_user.language',
    'view': true,
    'form_view': true,
    'edit': true,
    'type': 'input'
  }
}
// 字段可有可无，主要方便对接
const wxMiniUser = new WxMiniUser(fields)

export default wxMiniUser

