// pages/wallet/index/index.js
import {accountInfoQuery} from "../../../api/pay"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  init(){
    accountInfoQuery().then(res => {
      if (res.code == 200) {
        this.setData({
          info: res.data,
          info: res.data,
          ['info.bank_name']: res.data.bank_name, 
          ['info.bind_card_tail']: '**** **** **** ' + res.data.medium_id_tail,
          ['info.balance']: app.filters.toFix(res.data.balance / 100),
          show: true
        })
      } else {

      }
    })
  },
  detail() {
    // 记录
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  bind(){
    wx.navigateTo({
      url: '../card/card',
    })
  },
  
  charge() {
    // 充值
    wx.navigateTo({
      url: '../recharge/recharge',
    })
  },

  cash() {
    // 提现
    wx.navigateTo({
      url: '../cash/cash',
    })
  },

  record() {
    wx.navigateTo({
      url: '/pages/walletrecord/record',
    })
  },
  transDetail() {
    wx.navigateTo({
      url: '/pages/wallettransDetail/transDetail',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})