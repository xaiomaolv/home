// pages/waterbill/pay/pay.js
import {smsCode,confirmPayment,payBillsFindById} from '../../../api/pay' 
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      id:''
    },
    phone:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showmodal = this.selectComponent(".showmodal");
    if(options.id){
      this.setData({
        ['form.id']: options.id,
        phone:app.globalData.phone
      })
    }
  },
  init(){
    payBillsFindById(this.data.form.id).then(res=>{
      if(res.code == 200){
        this.setData({
          info: res.data
        })
      }
    })
  },
  handlePay(){
    this.showmodal.show()
    // smsCode(this.data.phone).then(res=>{
    //   if(res.code == 200){
    //     this.showmodal.show()
    //   }else{
    //     app.showModalMsg(res.msg || '验证码发送失败')
    //   }
    // })
  },
  cancel(e) {
    this.showmodal.hide()
    this.setData({
      ['form.sms_code']: ''
    })
  },
  confirm(e) {
    let form = e.detail
    if (!form.sms_code) {
      app.showModalMsg('请输入验证码')
      return;
    }
    let  params = {
      id:this.data.form.id,
      phone: this.data.phone,
      smsCode:form.sms_code 
    }
    confirmPayment(params).then(res=>{     
      if(res.code == 200){
        wx.showToast({
          title: '支付成功',
        })
        this.showmodal.hide()
        if(res.data){
          wx.navigateTo({
            url: '/pages/webview/webview?item='+ JSON.stringify(res.data),
          })
        }else{
          setTimeout(function () {
            app.goBack()
          }, 1000)
        }
      }else{
        app.showModalMsg(res.msg || '交费失败')
      }
    })
  },
  // 交费记录
  handleRecords(){
    wx.navigateTo({
      url: '/pages/records/records',
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