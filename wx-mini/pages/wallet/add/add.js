// pages/wallet/add/add.js
import {addCard, cardScodeVerify} from "../../../api/wallet"
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
     
    },
    second: 60,
    btnValue:'发送验证码',
    btnDisabled: false,
    isDisabled: false,
    rules: {
      // user_name: [
      //   { required: true, msg: '请输入姓名' }
      // ], //姓名
      // user_cert_no: [
      //   { required: true, msg: '请输入证件号码' },
      //   { idcard: true, msg: '请输入正确的证件号码' }
      // ], //身份证
      // occupation: [
      //   { required: false, msg: '请选择职业' },
      // ], //职业
      card_no: [
        { required: true, msg: '请输入银行卡号' },
        { bankcard: true, msg: '请输入正确的银行卡号' }
      ], //一类卡号
      user_phone_no: [
        { required: true, msg: '请输入银行预留手机号' },
        { phone: true, msg: '请输入正确的手机号' }
      ], //手机号
      sms_code: [
        { required: false, msg: '请输入验证码' }
      ],
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.setNavigationBarTitle({
    //   title: '添加绑定卡',
    // })
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
  
  // 发送绑卡短信
  sendCode() {
    if (!this.validate()) {
      return
    }
    let params = {
      card_no: this.data.form.card_no,
      user_phone_no: this.data.form.user_phone_no
    } 
    addCard(params).then(res => {
      if (res.code == 200) {
        this.timer();
        this.setData({
          ['resData.corp_serno']: res.data.corp_serno,
          ['resData.sms_send_no']: res.data.sms_send_no,
          iscardDisabled: true
        })
        wx.showToast({
          title: '验证码发送成功',
          icon: 'success'
        })
       
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  handleSubmit(){
    if (!this.validate()) {
      return
    }
    if (!this.data.form.sms_code) {
      this.showModal('请输入验证码')
      return
    }
    let  data = {
      corp_serno: this.data.resData.corp_serno,
      sms_send_no: this.data.resData.sms_send_no,
      sms_code: this.data.form.sms_code
    }
    cardScodeVerify(data).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '银行卡添加成功',
          icon: 'success'
        })
        setTimeout(function(){
          app.goBack()
        },1000)  
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
            btnValue: '重新发送（' + second + 's）',
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
  noPassByName(str){
    if(null != str && str != undefined){
        if(str.length <= 3){
            return "*" + str.substring(1,str.length);
        } else if(str.length > 3 && str.length <= 6){
            return "**" + str.substring(2,str.length);
        } else if(str.length > 6){
            return str.substring(0,2) + "****" + str.substring(6,str.length)
        }
    } else {
        return "";
    }
},
  idCard(val){
    return val.replace(/^(.{3})(?:\d+)(.{3})$/, "$1**** **** ****$2");
  },
  phone(val){
    return val.replace(/\s/g,'').replace(/(\d{3})\d+(\d{4})$/, "$1 **** $2")
  }
})