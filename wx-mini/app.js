//app.js
import locales from './i18n/i18n'
import { initPage, onPageLoad } from './utils/page'
import request from './utils/request'
import util from './utils/util'

App({
  onLaunch: function () {
    wx.setStorageSync('rKey', "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv7gm6B/bW3ZU95t5q6hdBsjyu1QQcgEcVbXCaVGax/eXyZM4uivYOdNerwtIwm4G0acqWGPG0bAb8qHvCQNTimZXLvVVe4RaveezuXwEO0gP3yBMKvFLkerwXGmlShjDfS12yTf9L8RuRltO2DouLpNVpTuxlXjfqRFAjl8SlkKqpH1G+MlgIeopy+srP2yanGiozlp1ASbBUGktYdug7s37XmlsPzPcUTpiX7MPYiS5FqG/T9DjeIwMvW1+GhK8bprbcHgSVxZpSgycQysNq1qjTl4P919qeCFA8F8DMmIW/cZ8iT82dcP1Z0XfCeBPRU84FnUrdZUUCgW8dx6CPwIDAQAB")
    // 获取语言
    const locale = wx.getStorageSync('locale')
    if (locale) {
      this.T = locales[locale]
    } else { // 默认语言为中文
      this.T = locales.zh
    }
    // 重构Page对象
    initPage(this)
  },
  // 设置语言
  setLocale(locale) {
    // 保存语言到本地存储，以后打开不需要重新设置
    wx.setStorageSync('locale', locale)
    this.T = locales[locale]
    // 重新设置title和T
    onPageLoad(this)
  },
  // 获取当前语言
  getLocale() {
    return wx.getStorageSync('locale') || 'zh'
  },
  // 挂载全局request，使用app.request 替代wx.request
  ...request,
  // 挂载全局工具类
  ...util,
  // api: [...api],
   setToken(token) {
     wx.setStorageSync('token', token)
   },
   getToken() {
     return wx.getStorageSync('token')
   },
  setCode(code) {
    wx.setStorageSync('code', code)
  },
  getCode() {
    return wx.getStorageSync('code')
  },
  // 是否开启logger
  loggerEnable: true,
  openid: null,
  // 是否开启加密
  encryption: true,
  // 非加密是否验签
  sign: true,
  // 加密握手url
  encryptionHandUrl: '/encryptionHandUrl',

  globalData: {
    userInfo: null,
    openid: null,
    root: null,
    room: null,
    roleName: null,
    isCertification: false,
    phone: null,
    user_name:null,
    isAccredit: false,
    communityId:'',
    // prem:['service:repair:list','cost:bills:list'],
    mapKey:'D7NBZ-MIQL3-5SS3B-YVS6D-ZRJH6-ODFBJ',// ejak: pvf34ZOLtbmScvCokIbBlvAGR4fRzHEI  icbcak: MpABadeAAeuGSPtPhhg303DAcVNEQH7x   txmap: D7NBZ-MIQL3-5SS3B-YVS6D-ZRJH6-ODFBJ
    withJson:{},
    roomList:[],
    ifShowGas:false
  }
})

// api需要等待app初始化完成
getApp().api = require('./api/api').default