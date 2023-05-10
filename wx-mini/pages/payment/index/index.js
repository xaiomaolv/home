// pages/payment/index/index.js
import { seachWxUserInfo } from '../../../api/userinfo'
import {accountInfoQuery} from '../../../api/pay'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseList:[],
    info:{},
    isBindCard: false,
    ifShowGas: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  init(){
    seachWxUserInfo({"type":1}).then(res => {
      if (res.code == 200) {
        if (res.data.wxUserInfo) {
          app.globalData.openid = res.data.wxUserInfo.openId
          app.globalData.isAccredit = true
        } else {
          // this.logo.showDialog();//调用子组件的方法
        }
        if(res.data.room.length !== 0){
          app.globalData.room = true
        }
       
        this.setData({
          ifShowGas:res.data.ifShowGas
        })
        app.globalData.root = res.data.root   
        app.globalData.withJson = res.data.withJson
        app.globalData.roomList = res.data.room   
        // user 为空，用户未实名认证，不调以下接口 
        if(!res.data.user) return;
        accountInfoQuery().then(res => {
          if (res.code == 200) {
            app.globalData.isCertification = true
            app.globalData.phone = res.data.user_phone_no
            app.globalData.user_name = res.data.user_name
            this.setData({
              info: res.data,
              ['info.bank_name']: res.data.bank_name,
              ['info.bind_card_tail']: res.data.bind_card_tail ? '**** **** **** ' + res.data.bind_card_tail : '',
              ['info.balance']: app.filters.toFix(res.data.balance / 100),
              ['info.medium_id_tail']: res.data.medium_id_tail ? '**** **** **** ' + res.data.medium_id_tail : "",
            })
          } else {

          }
        })
       
      } else {

      }
    })
  },
  //物业费
  handleProperty(){
    if (app.globalData.isCertification) {
      if(app.globalData.room){
        wx.navigateTo({
          url: '/pages/property/property',
        })
      }else{
        app.bindHouseShowModal()
      }
    } else {
      app.bindCardhowModal()
    }  
  },
   //停车费
   handleStopCar(){
    if (app.globalData.isCertification) {
        wx.navigateTo({
          url: '/pages/property/stopcar/index',
        })
    } else {
      app.bindCardhowModal()
    }  
  },
  // 智慧停车
  handlePark(){
    if (app.globalData.isCertification) {
      wx.navigateTo({
        url: '/pages/park/index',
      })
    } else {
      app.bindCardhowModal()
    }  
  },
  // 押金
  handledeposit(){
    if (app.globalData.isCertification) {
      wx.navigateTo({
        url: '/pages/deposit/index',
      })
    } else {
      app.bindCardhowModal()
    }  
  },
  //交费记录
  handleRecords(){
    if (app.globalData.isCertification) {
      if(app.globalData.room){
        wx.navigateTo({
          url: '/pages/records/records',
        })
      }else{
        app.bindHouseShowModal()
      }
    } else {
      app.bindCardhowModal()
    }  
  },
  handleWater(){
    wx.navigateTo({
      url: '/pages/waterbill/index/index',
    })
  },
  handleElectry(){
    wx.navigateTo({
      url: '/pages/electrybill/index/index',
    })
  }, 
  handleGas(){
    wx.navigateTo({
      url: '/pages/gas/list/list',
    })
  },
  handleTo(){
    // this.showModal('开发中,请稍后。。。')
  },
  // 单条小区交费详情
  paySingleList(e) {
    let item = e.currentTarget.dataset.value
    wx.navigateTo({
      url: `/pages/payment/detail/detail?id=${item.id}&type=${1}`,
    })
  },
  // 单条小区交费账单
  paySingBill(e) {
    let item = e.currentTarget.dataset.value
    wx.navigateTo({
      url: `/pages/payment/detail/detail?id=${item.id}&type=${2}`,
    })
  },
  // 常用
  BindUse() {
     if (app.globalData.isCertification) {
      if(app.globalData.room){
        wx.navigateTo({
          url: "/pages/commonUse/index",
        })
      }else{
        app.bindHouseShowModal()
      }
    } else {
      app.bindCardhowModal()
    }   
  },
  
  wallet(){
    if(this.data.isBindCard){
      if(this.data.info.bind_card_type == '0') return;
      wx.navigateTo({
        url: '/pages/wallet/index/index',
      })
    }else{
      wx.showModal({
        content: '您还未绑定银行卡',
        showCancel: true,
        title: '',
        confirmText:'去绑定',
        confirmColor:'#fd7380',
        cancelColor:'#484848',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/bind/bind',
            })
          } else if(res.cancel) {
           
          }
        },
        fail: (res) => {},
        complete: (res) => {},
      })
    }
  }, 
  Payment(){
    wx.navigateTo({
      url: "/pages/payment/index?id=0",
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
})