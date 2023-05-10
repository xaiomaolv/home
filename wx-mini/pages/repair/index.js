// pages/Repair/index.js
import {
  repairList,
  repairUpdata
} from '../../api/repair'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTab: ['待处理', '待上门', '待评价', '已完成'],
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
      list: [],
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
    // this.getList(this.data.currentTab)
  },
  next() {
    this.getList(this.data.currentTab)
  },
  getList(tab) {
    let num = tab + 1
    let params = {
      "repairStatus": num,
      "pageNum": this.data.pageNum,
      "pageSize": 20
    }
    repairList(params).then(res => {
      wx.hideLoading();
      //隐藏导航条加载动画
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
      if (res.code == 200) {
        let arr = []
        res.data.forEach(item => {
          item.stateName = this.stateName(item.repairStatus)
          arr.push(item)
        })
        let len = res.data.length;
        if(len >= 20){
          this.setData({
            showPageNext: false,
            pageNum:this.data.pageNum + 1           
          })			
        }else{
          this.setData({
            showPageNext: true,
            onMoreFlag: true
          })				
        }

        this.setData({
          list: [...this.data.list, ...arr],
        })

      }
    })
  },
  handleAdd() {
    wx.navigateTo({
      url: './repairform/repairform',
    })
  },
  handelAppraise(e) {
    let item = e.currentTarget.dataset.value
    wx.navigateTo({
      url: './appraise/appraise?id=' + item.id + '&buildingRoomId=' + item.buildingRoomId,
    })
  },
  stateName(state) {
    //1.待处理 2.处理中 3.已处理 4.已评价 5.退回
    let name = ''
    switch (state) {
      case 1:
        name = '待处理'
        break;
      case 2:
        name = '处理中'
        break;
      case 3:
        name = '已处理'
        break;
      case 4:
        name = '已评价'
        break;

      default:
        name = '退回'
        break;
    }
    return name;
  },
  handelDetail(e) {
    let item = e.currentTarget.dataset.value
    wx.navigateTo({
      url: `./detail/detail?id=${item.id}`,
    })
  },
  //修改
  handelupdata(e) {
    let item = e.currentTarget.dataset.value
    wx.navigateTo({
      url: `./repairform/repairform?id=${item.id}`,
    })
  },
  //取消
  handelCancel(e) {
    let item = e.currentTarget.dataset.value
    let params = {
      id: item.id,
      dispatchStatus: 3,
      repairStatus: 5
    }
    repairUpdata(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: res.msg,
          icon: "success"
        })
        let that = this;
        setTimeout(function () {
          that.getList(that.data.currentTab)
        }, 1000)
      } else {
        app.showModalMsg(res.msg)
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