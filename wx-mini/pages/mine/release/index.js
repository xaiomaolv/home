// pages/mine/release/index.js
import {
  withhold, uploadImg
} from '../../../api/property'
import {
  seachWxUserInfo
} from '../../../api/userinfo'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    itemId: false,
    checked: false,
    agreementList: [{
      id: '5',
      title: '《中国工商银行“物业管理费”委托代扣协议》'
    }],
    agreement: false,
    agreeTitle: '',
    agreeId: '',
    item:'',
    index:'',
    signImg:'',
    canvasShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.agreement = this.selectComponent(".agreement"); 
    this.sign = this.selectComponent(".sign");
    this.sign.show() 
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
  init() {
    seachWxUserInfo().then(res => {
      if (res.code == 200) {
        app.globalData.withJson = res.data.withJson
        app.globalData.roomList = res.data.room 
       
        let roomList = []
        let arr = res.data.room
        let obj = res.data.withJson
        if(arr.length != 0 && obj){
          arr.forEach(item => {         
            Object.keys(obj).forEach(key => {
              if (item.communityId == key) {
                let em = Object.assign(item, obj[key]);
                roomList.push(em)
              }
            })
          })
          this.setData({
            list: roomList
          })    
        }
          
      } else {

      }
    })
  },

  switchChange(e) {
    let item = e.currentTarget.dataset.value
    let index = e.currentTarget.dataset.index
    this.setData({
      item: item,
      index: index
    })
    
    let obj = app.globalData.withJson
    Object.keys(obj).forEach(key => {
      if (item.communityId == key) {
         app.globalData.withJson[key].ifWith = !item.ifWith  
         app.globalData.withJson[key].ifOne =  item.ifOne       
      }
    })
    if(!item.ifWith){
      this.setData({
        agreeTitle: this.data.agreementList[0].title,
        agreeId: this.data.agreementList[0].id,
        show: true       
      })
      this.agreement.showlog()
    }else{
      this.updataList(item, index)
    }
    

  },

  handleCencel(){
    this.data.list[this.data.index].ifWith = this.data.item.ifWith
    this.setData({
      list: this.data.list,
      canvasShow: false
    })
  },
  handleConfirm(e) {
   
    this.setData({
      canvasShow: true
    })
    
    
    // this.updataList(this.data.item, this.data.index)
  },

  signCancel(){
    this.setData({
      canvasShow: false
    })
    this.data.list[this.data.index].ifWith = this.data.item.ifWith
    this.setData({
      list: this.data.list
    })
  },
  signConfirm(e){
    this.setData({
      canvasShow: false
    })
    
    let params = {
      base64: 'data:image/jpeg;base64,' + e.detail.src
    }
    // 上传签名
    uploadImg(params).then(res=>{
      this.setData({
        signImg: res.data
      })
      this.updataList(this.data.item, this.data.index)
    }) 
     
  },
       
  updataList(item, index){
    wx.showModal({
      content: item.ifWith ? '确认解除代扣协议？':'确认签订代扣协议',
      // showCancel: false,
      title: '',
      success: (res) => {
        if (res.confirm) {
          let params = {
            withJson: app.globalData.withJson,
            signImg: this.data.signImg
          }
          
          withhold(params).then(res => {
            if (res.code == 200) {
              wx.showToast({
                title: '修改成功',
                icon: 'success'
              })
              this.init()
            } else {
              app.showModalMsg(res.msg)
              this.data.list[index].ifWith = item.ifWith
              this.setData({
                list: this.data.list
              })
            }
          })
        } else if (res.cancel) {
            this.data.list[index].ifWith = item.ifWith
            this.setData({
              list: this.data.list
            })
        }
      },
      fail: (res) => {},
      complete: (res) => {},
    })


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
  
})