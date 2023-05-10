// pages/payment/detail/detail.js
import {paySingleBills,getPayBillsList,paySingleRecord,accountInfoQuery} from '../../../api/pay'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 1) {
      const params = {
        pageNum:1,
        pageSize:99999,
        buildingRoom:{
          id:options.id
        },
        state:2
      }
      getPayBillsList(params).then(res=>{
        this.setData({
          list:res.data.list
        })
      })
    }
    if (options.type == 2) {
      const params = {
        pageNum:1,
        pageSize:99999,
        buildingRoom:{
          id:options.id
        },
        states:[0,1],
      }
      getPayBillsList(params).then(res=>{
        this.setData({
          list:res.data.list
        })
      })
    }
  },
  // 交费
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
  // 交费明细
  handleDetail(e){
    let item = e.currentTarget.dataset.value
    console.log(item,'i');
    let cateName = item.category.categoryName
    wx.navigateTo({
      url: `/pages/payment/transaction/transaction?id=${item.id}&cateName=${cateName}`,
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