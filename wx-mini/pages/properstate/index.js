
// pages/property/properstate/index.js
import {payBillSearch} from '../../api/pay'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTab: ['未交', '已交'],
    currentTab: 0,
    list: [],
    showPageNext: false,
    onMoreFlag: false,
    pageNum: 1
  },
  currentTab: function (e) {
    if (this.data.currentTab == e.currentTarget.dataset.idx) {
      return;
    }
    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      list:[],
      showPageNext: false,
      onMoreFlag: false,
      pageNum: 1
    })
    this.getList(this.data.currentTab)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },   
  next(){
    this.getList(this.data.currentTab)
  },
  getList(tab) {
    console.log(tab,'tab')
    let num = tab == 0 ? 0 : 2
    let params = {
      'communityId':app.globalData.communityId,
      "state": num,
      "pageNum": this.data.pageNum,
      "pageSize": 20
    }
    payBillSearch(params).then(res => {
      wx.hideLoading();
      //隐藏导航条加载动画
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
      if (res.code == 200) {
        let arr = []
       res.rows.forEach(item=>{
        item.stateName = item.state == 0 ? '未交':'' || item.state == 2 ? '已交':''
        arr.push(item)
       })
       let len = res.rows.length;
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
         list: [...this.data.list, ...arr]
       })
       
      }
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
    this.setData({
      list: [],
      showPageNext: false,
      onMoreFlag: false,
      pageNum: 1
    })
    this.getList(this.data.currentTab)
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
    this.getList(this.data.currentTab)
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
      this.getList(this.data.currentTab)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})