// pages/Payment/index.js
import {accountInfoQuery, confirmPayment, payBills,paySingleRecord} from '../../api/pay'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTab: ['待交费', '已交费'],
    currentTab: 0,
    list:[]
  },
  currentTab: function (e) {
    if (this.data.currentTab == e.currentTarget.dataset.idx) {
      return;
    }
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    this.listData(this.data.currentTab)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  init(){
    const params = {
      pageNum:1,
      pageSize:9999
    }
    paySingleRecord(params).then(res=>{
      this.setData({list:res.data.list})
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  listData(tab){
    // let num = tab == 0 ? 0 : 2
    let params={
      state: tab,
      pageNum: 1,
      pageSize: 20 
    }  
    payBills(params).then(res=>{
      if(res.code == 200){
        this.setData({
          list: res.data.list
        })
      }
    })
  },
  handlePay(e){
    let item = e.currentTarget.dataset.value
    accountInfoQuery().then(res=>{
      if(res.code == 200){
        wx.showModal({
          title: '提示',
          content: '确认交费'+ item.totalBill + '元？',
          success(e) {
            if (e.confirm) {
              let arr= []
              arr.push(item.id.toString())
              confirmPayment(item.id).then(res=> {
                  if(res.code == 200){
                    wx.showToast({
                      title: '交费成功',
                      icon:'success'
                    })
                  }
                  // this.listData()
              })
            }
            if (e.cancel) {
             
            }
          }
        })
      }else{
        wx.showModal({
          title: '',
          content: '未实名认证',
          showCancel: false,
          success(e) {
            if (e.confirm) {
             
  
            }
          }
        })
      }
    })
    // wx.navigateTo({
    //   url: './pay/pay',
    // })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init()
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