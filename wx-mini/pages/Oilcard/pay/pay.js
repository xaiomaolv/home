// pages/waterbill/pay/pay.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      money: ''
    },
    navTab: [
      { id: 1, value: 50 },
      { id: 2, value: 100 },
      { id: 3, value: 150 },
      { id: 4, value: 200 },
    ],
    currentTab: -1,
    showValue:null
  },
  handelInputChange: function (e) {
    console.log( e.currentTarget.dataset, e.detail.value,77777)
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value; 
    if(e.detail.value !== this.data.showValue){
      console.log(e.detail.value !== this.data.showValue)
      this.setData({
        currentTab: -1
      })
    }
    if (dataset.value) {
      this.data[dataset.obj] = dataset.value
    } else {
      this.data[dataset.obj] = value
    }
    // 用set才会触发页面刷新
    this.setData(this.data)
   
  },

  currentTab: function (e) {
    let idx = e.currentTarget.dataset.idx
    if (this.data.currentTab == e.currentTarget.dataset.idx) {
      return;
    }
    this.data.navTab.forEach((item, index) => {
      if (index == idx) {
        this.setData({
          ['form.money']: item.value,
          showValue: item.value
        })
      }
    })
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  handleRecords(){
    wx.navigateTo({
      url: '../records/records',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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