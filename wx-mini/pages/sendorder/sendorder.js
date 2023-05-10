// pages/sendorder/sendorder.js
import { propertyRepairList, dispatchRepair, finish } from '../../api/repair.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTab: ['未派单', '已派单', '已完成'],
    currentTab: 0,
    remark: '',
    form: {
      id: ''
    },
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
    this.showmodal = this.selectComponent(".showmodal");
    // this.showmodal.show()
  },
  next(){
    this.getList(this.data.currentTab)
  },
  getList(tab) {
    let num = tab + 1
    let params = {
      page: this.data.pageNum,
      pageSize: 20,
      dispatchStatus: num,
      communityId: app.globalData.communityId
    }
    propertyRepairList(params).then(res => {
      wx.hideLoading();
      //隐藏导航条加载动画
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
      if (res.code == 200) {
        res.rows.forEach(item => {
          item.statusDispatch = item.dispatchStatus == 1 ? '待派单' : '' || item.dispatchStatus == 2 ? '已派单' : '' || item.dispatchStatus == 3 ? '已完成' : ''
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
          list: [...this.data.list, ...res.rows]
        })
     
      }
    })
  },
  dispatch(e) {
    let item = e.currentTarget.dataset.value
    wx.navigateTo({
      url: './dispatch/dispatch?id=' + item.id +'&communityId=' + item.communityId +'&communityName=' + item.room.community.communityName
    })
  },
  // 完成
  handleFinish(e) {
    let item = e.currentTarget.dataset.value
    this.setData({
      ['form.id']: item.id,
    })
    this.showmodal.show()
  },
  changeCancelReason(e) {
    this.setData({
      remark: e.detail.value,
    })
  },
  bindfocus(e) {
    this.setData({
      remark: e.detail.value,
    })
  },
  bindblur(e) {
    this.setData({
      remark: e.detail.value,
    })
  },
  cancel(e) {
    this.setData({
      remark: '',
    })
  },
  confirm(e) {
    let params = {
      id: this.data.form.id,
      remark: this.data.remark
    }
    this.showmodal.hide()
    finish(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: res.msg,
        })
        this.setData({
          list: [],
          showPageNext: false,
          onMoreFlag: false,
          pageNum: 1
        })
        this.getList(this.data.currentTab)
      
        this.setData({
          remark: '',
        })
      }
    })
  },
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