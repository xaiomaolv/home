// pages/sendorder/dispatch/dispatch.js
import { repairUser,repairList,dispatchRepair } from '../../../api/repair.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repairUserList:[],
    repairId: null,
    communityId: null,
    communityName:null,
    repairUserId: null,
    obj:{
      id:'9999'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      repairId: options.id,
      communityId: options.communityId,
      communityName: options.communityName
    })
   
  },
  init(){
    let params = {
      type: 1,
      page: 1,
      pageSize: 9999
    }
    repairUser(params, this.data.communityId).then(res=>{
      if(res.code == 200){
        res.rows.forEach(item=>{
          item.communityName = this.data.communityName
        })
        this.setData({
          repairUserList: res.rows
        })
      }   
    })
  },
  // 派单
  dispathChange:function(e) {
    var that = this
    this.setData({
      repairUserId:e.currentTarget.dataset.value.userId || e.detail.value.userId 
    })
    wx.showModal({
      title: '派单',
      content: '是否确认派单',
      success(res) {
       if (res.confirm) {
         let params = {
          id: that.data.repairId,
          userId: that.data.repairUserId
         }
        dispatchRepair(params).then(res=>{
          if (res.code == 200) {
            wx.showToast({
              title: res.msg,
              icon:'success'
            })
            setTimeout(function(){
              app.goBack()
            },1000)
          }
        })
       } else if (res.cancel) {
        that.setData({
            repairUserId:''
         })
        console.log('用户点击取消')
       }
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