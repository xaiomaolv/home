// pages/wallet/record/record.js
import { paySingleRecord } from '../../api/pay'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      start_date: '',
      end_date: '',
    },
    list: [],
    showPageNext: false,
    onMoreFlag: false,
    pageNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    this.setData({
      ['form.start_date']: this.getDateTime(),
      ['form.end_date']: this.getDateTime(),
    })
  },
  getDateTime(){
    let d = new Date()
    let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    let date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    var datetime = d.getFullYear() + '-' + month + '-' + date
    return datetime
  },
  // 时间段选择 
  bindDateChange(e) {
    this.setData({
      [e.target.dataset.obj]: e.detail.value
    })
    this.reset()
  },
  reset() {
    this.setData({
      list: [],
      showPageNext: false,
      onMoreFlag: false,
      pageNum: 1,
      // ['form.start_date']: '',
      // ['form.end_date']: '',
    })
  },
  search() {  
    this.reset()
    this.next()
  },
  next() {
    if (!this.data.form.start_date) {
      wx.showToast({
        title: '请选择开始日期',
        icon: 'none'
      })
      return;
    }
    if (!this.data.form.end_date) {
      wx.showToast({
        title: '请选择结束日期',
        icon: 'none'
      })
      return;
    }
    
    this.getList()
    
  },
  getList() {
    let params = {
      "pageNum": this.data.pageNum,
      "pageSize": 20,
      "startPayDate": this.data.form.start_date + ' 00:00:00',
      "endPayDate": this.data.form.end_date + ' 23:59:59'
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
    // this.init()
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
      pageNum: 1,
      // ['form.start_date']: this.getDateTime(),
      // ['form.end_date']: this.getDateTime(),
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