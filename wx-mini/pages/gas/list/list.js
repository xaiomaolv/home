import {getPaySelfList} from '../../../api/gas.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    showPageNext: false,
    onMoreFlag: false,
    pageNum: 1
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
   
  },
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.setData({
      list: [],
      showPageNext: false,
      onMoreFlag: false,
      pageNum: 1,
    })
    this.getlist()
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

  //刷新
  onRefresh() {
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    wx.showLoading({
      title: '刷新中...',
    })
    this.getlist()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //调用刷新时将执行的方法
    this.setData({
      list: [],
      showPageNext: false,
      onMoreFlag: false,
      pageNum: 1
    })
    this.onRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    if (!this.data.onMoreFlag) {
      wx.showLoading({
        title: '加载中...',
      })
      this.getlist()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  next(){
    this.getlist()
  },
  getlist(){
    let params = {
      "pageNum": this.data.pageNum,
      "pageSize": 20,
      "type": 2
    }
    getPaySelfList(params).then(res=>{
      wx.hideLoading();
      //隐藏导航条加载动画
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
      if(res.code == 200){
        let len = res.data.length;
        if (len >= 20) {
          this.setData({
            showPageNext: false,
            pageNum: this.data.pageNum + 1 
          })
        } else {
          this.setData({
            showPageNext: true,
            onMoreFlag: true
          })
        }
 
        this.setData({
          list: [...this.data.list, ...res.data]
        })
      }
    })
  },
  //去交费
  handlepay(e){
    let item = e.currentTarget.dataset.value
    let params= {
      id: item.id,
      countAmount: Number(item.params.countAmount) / 100,
      totalBill: Number(item.totalBill),
      type: item.installMent.type,
      gasState: item.gasState
    }
    // 未交过费
    if(!item.params.countAmount){
      wx.navigateTo({
        url: '../index/index?item='+ JSON.stringify(params),
      })
    }
    // 已交过,定金
    if(item.params.countAmount && item.installMent.type == 1){
      wx.navigateTo({
        url: '../detail/detail?params='+ JSON.stringify(params),
      })
    }
     // 已交过,分期
     if(item.params.countAmount && item.installMent.type == 2){
      wx.navigateTo({
        url: '../refund/index?item='+ JSON.stringify(params),
      })
     
    }
    // if(){

    // }
   
   }
})