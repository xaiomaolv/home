// pages/park/index.js
import { checkncpayln, cardtype} from "../../api/park.js"
import { checkcard} from '../../api/bind'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    isXYCard: false,
    isDisabled: false,
    // 0-蓝牌；4-渐变绿
    array: [
      {id: '0', name: '蓝牌'},
      {id: '4', name: '渐变绿'}],
    index: '',
    agreementList:[
      {id:'0',title:'《中国工商银行场景支付客户服务协议》'},
    ],
    agreeTitle:'',
    agreeId:'',
    form:{
      ccCVV2:'',
      ccExpiredDate:'',
      carPlateColor:''
    },
    rules: {   
      carPlateNo: [
        { required: true, msg: '请输入车牌号' },
        { platecard: true, msg: '请输入正确的车牌号' }
      ], //身份证
      carPlateColor: [
        { required: true, msg: '请选择车牌颜色' }
      ], //姓名
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.parkagree = this.selectComponent(".parkagree");

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
  bindPickerChange: function (e) {
    let value = e.detail.value
    this.data.array.forEach((item, index) => {
      if (index == value) {
        this.setData({
          index: e.detail.value,
          ['form.carPlateColor']: item.id
        })
      }
    })
  },
init(){
  checkncpayln().then(res=>{
    if(res.code == 200){
      if(res.data.ncPay == true){
        this.to()
      }else{

      }
    }else{
      app.showModalMsg(res.msg)
    }
  })
},
to(){
  wx.navigateToMiniProgram({
    appId: 'wxf2c6054480278609',//要打开的小程序 appId
    path: '/pages/index/index',//打开的页面路径，如果为空则打开首页
    extraData: {
      foo: 'bar'//需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据
    },
    envVersion: 'release',//要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
    success(res) {
      // 打开成功
      wx.showToast({
        title: ' 打开成功',
      })
    }, fail(res){
      // 打开失败
      wx.navigateBack({delta: 1});
    }
  })
},
  handleSubmit(){
    if (!this.validate()) {
      return
    }
    if (this.data.show && !this.data.form.bankCardNo) {
      app.showModalMsg('请输入银行卡号')
      return
    }
  
    if (this.data.isXYCard && !this.data.form.ccCVV2) {
      app.showModalMsg('请输入信用卡CVV2')
      return
    }
    if (this.data.isXYCard && !this.data.form.ccExpiredDate) {
      app.showModalMsg('请输入信用卡有效期')
      return
    }

    cardtype(this.data.form).then(res=>{
      if(res.code == 200){
        wx.showToast({
          title: res.msg,
          icon:'success'
        })
        let that = this;
        setTimeout(function(){
          that.to()
        },1000)
      }else{
        app.showModalMsg(res.msg)
        if(res.data.bankCardNo){
          this.setData({
            show:true,
            isDisabled:true,
            ['form.bankCardNo']: res.data.bankCardNo
          })
        }
        if(res.data.ccCVV2 && res.data.ccExpiredDate){
            this.setData({
              isXYCard: true,
              ['form.ccCVV2']: res.data.ccCVV2,
              ['form.ccExpiredDate']: res.data.ccExpiredDate
            })
        }
      }
    })
  },
  // 协议查看
  handleAgreement(e){ 
    let that = this
    let item = e.currentTarget.dataset.value
    this.setData({
      agreeTitle: item.title,
      agreeId: item.id
    })
    that.parkagree.showlog()
  },
  switchAgreement() {
    this.setData({ agreement: !this.data.agreement })
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