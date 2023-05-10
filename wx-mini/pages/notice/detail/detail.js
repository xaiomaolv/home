// pages/notice/detail/detail.js
import {noticeDetail} from '../../../api/notice'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options.id){
        let id = options.id
        noticeDetail(id).then(res=>{
          if(res.code == 200 && res.data){
              this.setData({
                info: res.data,
                ['info.content']:res.data.content.replace(/\<img/gi, '<img style="width:100%!important;height:auto；display:inline-block;padding:0;margin-left:-8%;"')              
              })
          }
        })
      }
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