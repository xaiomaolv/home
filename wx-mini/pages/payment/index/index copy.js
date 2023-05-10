// pages/payment/index/index.js
import {paySingleBills} from '../../../api/pay'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseList:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const params = {
      page:1,
      pageSize:10
    }
    paySingleBills(params).then(res=>{
      if(res.code == 200){
        this.setData({houseList:res.data.list})
      } 
    })
  },
  // 单条小区交费详情
  paySingleList(e) {
    let item = e.currentTarget.dataset.value
    wx.navigateTo({
      url: `/pages/payment/detail/detail?id=${item.id}&type=${1}`,
    })
  },
  // 单条小区交费账单
  paySingBill(e) {
    let item = e.currentTarget.dataset.value
    wx.navigateTo({
      url: `/pages/payment/detail/detail?id=${item.id}&type=${2}`,
    })
  },
  // 绑定房产
  Bindhouse() {
     if (app.globalData.isCertification) {
      if(app.globalData.room){
        wx.navigateTo({
          url: '/pages/house/house',
        })
      }else{
        wx.navigateTo({
          url: '/pages/house/house',
        })
      }
     
    } else {
      app.bindCardhowModal()
    }   
  },
  Paylist(){
     if (app.globalData.isCertification) {
      if(app.globalData.room){
        wx.navigateTo({
          url: "/pages/payment/index?id=2",
        })
      }else{
        wx.navigateTo({
          url: '/pages/house/house',
        })
      }
      
    } else {
      app.bindCardhowModal()
    }   
  }, 
  Payment(){
    wx.navigateTo({
      url: "/pages/payment/index?id=0",
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
  onShow: function (options) {
     this.onLoad(options)
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