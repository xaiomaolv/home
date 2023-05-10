// pages/wallet/card/card.js
import {accountBindingQuery, mainCard} from "../../../api/wallet"
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

  },
  init(){
    accountBindingQuery().then(res => {
      if(res.code == 200){
        res.data.record_detail.forEach(item=>{       
          item.bind_card_tail = "**** **** **** " +item.bind_card_tail
        })
        this.setData({
          list: [... res.data.record_detail],
        })
        
      }
    })
  },
  setBindCard: function (e) {
    let item = e.currentTarget.dataset.value  
   
    let that = this
    wx.showModal({
      title: '',
      content: '确认将银行卡：' + item.bind_card_tail + '改为主要绑定卡？',
      success (res) {
        if (res.confirm) {
          mainCard(item.bind_card_id).then(res => {
            if(res.code == 200){
              wx.showToast({
                title: '设置成功'
              })
              that.init()
            }else{
              app.showModalMsg(res.msg)
            }
          })
        } else if (res.cancel) {
         
        }
      }
    })
 
  },
  handleAdd(){
    wx.navigateTo({
      url: '../add/add',
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