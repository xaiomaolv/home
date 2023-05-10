// pages/login/login.js
import {info, smsCode, checkPhone} from '../../api/login.js'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fanished:false,
    second: 60,
    btnValue: '发送验证码',
    btnDisabled: false,
    isDisabled: false,
    form:{
      phone:'',
      smsCode:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     //父组件获取子组件对象方法,根据样式获取，建议使用selectAllComponents
     this.logo = this.selectComponent(".logo");
    //  this.logo.showDialog();//调用子组件的方法
     this.info = this.selectComponent(".info");
    //  this.info.showDialog()
     //判断缓存中有没有授权信息，如果没有就显示弹窗，有就直接隐藏弹窗
    //  seachWxUserInfo().then(res => {
    //    if (res.code == '0') {
    //      this.logo.hideDialog();//调用子组件的方法
    //    } else {
    //      this.logo.showDialog();//调用子组件的方法
    //    }
    //  })
    // info().then(res=>{
    //   app.log(res)
    //   if(res.code == '0' && res.data && res.data.user.wxOpenId){
    //   app.globalData.openid = res.data.user.wxOpenId
    //     wx.switchTab({
    //       url: '/pages/index/index',
    //     })
    //   }
    // })
  },
  // getUserInfo(e){
  //   console.log(e)
  //   this.info.showDialog()
  // },
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
  sendcode() {
    if (!this.data.form.phone) {
     this.showModal('请输入手机号码')
      return;
    }
    if (!/^1[3456789]\d{9}$/.test(this.data.form.phone)) {
      this.showModal('请填写正确的手机号码')
      return;
    }
    smsCode(this.data.form.phone).then(res=>{
      if(res.code == 200){
        this.timer();
      }else{
        this.showModal(res.msg || '验证码发送失败！')
      }
    })
     
  },
  submit(e) {
    if (!this.data.form.smsCode) {
      this.showModal('请输入验证码')
      return;
    }
  
    checkPhone(this.data.form).then(res=>{
      if(res.code == 200){
        this.logo.showDialog();//调用子组件的方法
      }else{
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
            btnValue:  second + 'S',
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
  showModal(msg){
    wx.showModal({
      title: '',
      content: msg,
      showCancel: false,
      success (res) {
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
    this.resetForm()
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