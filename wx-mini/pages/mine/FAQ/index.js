// pages/mine/FAQ/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[
      {
        id:'0',
        title:'什么是电子账户？',
      },
      {
        id:'1',
        title:'注册时开立电子账户失败是什么原因?',
      },
      {
        id:'2',
        title:'用电子账户交费失败怎么办?',
      },
      {
        id:'3',
        title:'如何提取电子账户上的资金？',
      },
      {
        id:'4',
        title:'电子账户上的资金还可以怎么用？',
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleTo(e){
    let item = e.currentTarget.dataset.value
    wx.navigateTo({
      url: './detail/detail?id=' + item.id,
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