// pages/repair/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    root:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let isBoolen = app.globalData.prem.some(item => {
    //   return item == 'cost:bills:list'
    //   })
    this.setData({
      root: app.globalData.root
    })
  },
  Sendorder() {
    // if(!this.data.root){
    if(this.data.root == '2'){
      app.showModalMsg('您当前无权限')
     return
    }
    wx.navigateTo({
      url: '/pages/sendorder/sendorder',
    })
  },
  Processorder() {
    // if(!this.data.root){
    //   if(this.data.root == '1'){
    //   app.showModalMsg('您当前无权限')
    //  return
    // }
    wx.navigateTo({
      url: '/pages/processorder/processorder',
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