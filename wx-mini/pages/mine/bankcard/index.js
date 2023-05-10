// pages/mine/bankcard/index.js
import {accountBinding,cardChangeVerify} from "../../../api/bind"
import { checkcard} from '../../../api/bind'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    showphone: false,
    second: 60,
    btnValue: '发送验证码',
    btnDisabled: false,
    form: {
     
    },
    isDisabled: false,
    rules: {
      card_no: [
        { required: true, msg: '请输入银行卡号' },
        { bankcard: true, msg: '请输入正确的银行卡号' }
      ], //一类卡号
      // user_phone_no: [
      //   { required: true, msg: '请输入银行预留手机号' },
      //   { phone: true, msg: '请输入正确的手机号' }
      // ], //手机号
      // sms_code: [
      //   { required: false, msg: '请输入验证码' }
      // ],
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().watch(this.data.form,'card_no',this.cardcheck);
  },
  inputChange: function (e) {
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    if (dataset.value) {
      this.data[dataset.obj] = dataset.value
    } else {
      this.data[dataset.obj] = value
    }
    // 用set才会触发页面刷新
    this.setData(this.data)
  },
  handleBindblur(e){
    // this.cardcheck(this.data.form.card_no)
  },
  handlefocus(e){
    // console.log(e,8888888)
  },
    /* 判断卡号是否是工行卡 */
cardcheck(card_no) {
  if (!/^([1-9]{1})(\d{15}|\d{16}|\d{18})$/.test(card_no)) {
    // app.showModalMsg('请输入正确的银行卡号！')
    return
  }
  checkcard(this.data.form.card_no).then(res => {
    if(res.code == 200){
        if(res.data.card_type == '2'){
          this.setData({
            show: true
          })
        }else{
          this.setData({
            show: false
          })
        }
    }
  })
},
  // 发送短信
  sendCode() {
    if (!this.validate()) {
      return
    }
    if(this.data.show){
      if(!this.data.form.ccCVV2){
        app.showModalMsg('请输入信用卡CVV2')
        return
      }
      if(!this.data.form.ccExpiredDate){
        app.showModalMsg('请输入信用卡有效期')
        return
      }
    }
    accountBinding(this.data.form).then(res=>{
      if(res.code == 200){
        wx.showToast({
          title: '验证码发送成功',
          icon: 'success'
        })
        this.setData({
          ['form.sms_send_no']: res.data.sms_send_no,
          ['form.icbc_bind_no']: res.data.icbc_bind_no_new,
          ['form.phone_no_tail']: res.data.phone_no_tail,
          showphone: true
        })
        this.timer()
      }else{
        this.showModal(res.msg || '验证码发送失败！')
      }
    })
       
  },
  
  handleSubmit() {
    if (!this.validate()) {
      return
    }
    if (!this.data.form.sms_code) {
      this.showModal('请输入验证码')
      return
    }
    let params = {
      icbc_bind_no: this.data.form.icbc_bind_no,
      sms_code: this.data.form.sms_code,
      sms_send_no: this.data.form.sms_send_no
    }
    cardChangeVerify(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '银行卡更换成功',
        })
        setTimeout(function () {
          app.goBack()
        }, 1000)
      } else {
        this.showModal(res.msg)
      }
    })
  },

  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: second + 'S',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '重新发送',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  showModal(msg) {
    wx.showModal({
      title: '',
      content: msg,
      showCancel: false,
      success(res) {
        if (res.confirm) {

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