
// components/showmodal-input/index.js
import { smsCode, showCardNo } from '../../api/bind'
let setTimer;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    second: 60,
    btnValue: '发送验证码',
    btnDisabled: false,
    isDisabled:true,
    form: {}
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    width: {
      type: String,
      value: '80%'
    },
    phone:{
      type: String,
      value:''
    }
  },
  attached(){

  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
    show: function () {
      this.setData({
        showModal: true
      })
    },
    hide: function () {
      clearInterval(setTimer)
      this.setData({
        showModal: false,
        second: 60,
        btnValue: '发送验证码',
        btnDisabled: false,
        ['form.sms_code']:''
      })
    },
    cancel() {
      this.hide()
      this.triggerEvent('cancel')
    },
    // 确定  
    confirm: function () {
      let params = {
        phone: this.data.phone,
        sms_code: this.data.form.sms_code
      }
      this.triggerEvent('confirm', params)
    },
    sendCode: function () {
      smsCode().then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '发送成功',
          })
          this.timer();
        } else {
          this.showModal(res.msg || '验证码发送失败！')
        }
      })

    },
    timer: function () {
      let promise = new Promise((resolve, reject) => {
        setTimer = setInterval(
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
  }
})
