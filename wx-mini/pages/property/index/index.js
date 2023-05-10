// pages/property/index/index.js
import {getcommunitydept} from "../../../api/property"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    root:null,
    type:'',
    roleName: null,

    array: [],
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let isBoolen = app.globalData.prem.some(item => {
    //   return item == 'cost:bills:list'
    //   })
    this.setData({
      // root: isBoolen,
      root: app.globalData.root,
      type: options.type,
      // roleName: app.globalData.roleName
    })
  },
  bindPickerChange: function (e) {
    let value = e.detail.value
    this.data.array.forEach((item, index) => {
      if (index == value) {
        this.setData({
          index: e.detail.value,
          roleName: item.communityName
        })
        app.globalData.roleName = item.communityName
        app.globalData.communityId = item.id
      }
    })
  },
  init(){
    getcommunitydept().then(res =>{
      if(res.code == 200 && res.data.length != 0){
        let arr = res.data
        app.globalData.communityId = arr[0].id
        console.log(arr[0].id,777)
        this.setData({
          array: res.data,
          index: 0,
          roleName: arr[0].communityName
        })
      }
    })
  },
  // 报修报事
  Repair() {  
     if (app.globalData.isCertification) {
      if(app.globalData.room){
        wx.navigateTo({
          url: '/pages/repair/index',
        })
      }else{
       app.bindHouseShowModal()
      }
      
    } else {
      app.bindCardhowModal()
    } 
  },

  //通知公告
  Notice() {
     if (app.globalData.isCertification) {
      if(app.globalData.room){
        wx.navigateTo({
          url: '/pages/notice/index',
        })
      }else{
        app.bindHouseShowModal()
      }
      
    } else {
      app.bindCardhowModal()
    } 
  },
  // 投诉建议
  Cmplain() {  
     if (app.globalData.isCertification) {
      if(app.globalData.room){
        wx.navigateTo({
          url: '/pages/complain/complain',
        })
      }else{
        app.bindHouseShowModal()
      }
     
    } else {
      app.bindCardhowModal()
    } 
  },
  // 物业费状态
  Property() {
     if (app.globalData.isCertification) {
      //  if(!this.data.root){
        if(this.data.root == '2'){
         app.showModalMsg('您当前无权限')
        return
       }
      wx.navigateTo({
        url: '/pages/properstate/index',
      })
      
    } else {
      app.bindCardhowModal()
    } 
  },
  // 催交通知
  Reminder() {
     if (app.globalData.isCertification) {
       //  if(!this.data.root){
      if(this.data.root == '2'){
        app.showModalMsg('您当前无权限')
       return
      }
      wx.navigateTo({
        url: '/pages/reminder/reminder',
      })  
    } else {
      app.bindCardhowModal()
    } 
  },
  // 报修
  Repairw(){
     if (app.globalData.isCertification) {
      wx.navigateTo({
        url: '/pages/repair/index/index',
      })
    } else {
      app.bindCardhowModal()
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