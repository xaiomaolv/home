// pages/electrybill/records/records.js
import {
  paySingleRecord
} from '../../api/pay'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    showPageNext: false,
    onMoreFlag: false,
    pageNum: 1,
    menuTapCurrent:"0",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getList()
  },
  next() {
    this.getList()
  },
  getList() {
    let params = {
      "pageNum": this.data.pageNum,
      "pageSize": 20,
      "startPayDate": "",
      "endPayDate": "",
      "params":{
       "refundType":this.data.menuTapCurrent
      }
    }
    paySingleRecord(params).then(res => {
      wx.hideLoading();
      //隐藏导航条加载动画
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
      if (res.code == 200) {
        let len = res.data.length;
        if (len >= 20) {
          this.setData({
            showPageNext: false,
            pageNum: this.data.pageNum + 1 
          })
        } else {
          this.setData({
            showPageNext: true,
            onMoreFlag: true,
          })
        }

        this.setData({
          list: [...this.data.list, ...res.data]
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
    this.getList()  
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
  handleDeatil(e) {
    let item = JSON.stringify(e.currentTarget.dataset.value) 
    wx.navigateTo({
      url: './../property/deatil/detail?item='+ item,
    })
  },

  menuTap(e){
    let current=e.currentTarget.dataset.current;
    this.setData({
    list: [],
    menuTapCurrent:current,
    pageNum:1
    });
    this.getList();
  },

  //刷新
  onRefresh() {
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    wx.showLoading({
      title: '刷新中...',
    })
    this.getList();
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
      this.getList()
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})