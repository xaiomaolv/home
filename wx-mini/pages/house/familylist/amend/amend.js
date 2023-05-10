// pages/house/familylist/amend/amend.js
// pages/repair/repairform/repairform.js
import {getOwnerInfo, ownerModify } from '../../../../api/property.js'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    index: '',
    form: {
      nickName:'',
      phone: ''
    },
    rules: { 
      nickName: [
        { required: true, msg: '请输入姓名' }
      ], 
      phone: [
        { required: true, msg: '请输入联系电话' },
        { phone: true, msg: '请输入正确的手机号' }
      ],
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        ['form.id']: options.id
      })
    }
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
  init(){
    getOwnerInfo(this.data.form.id).then(res=>{
      if(res.code == 200){
        this.setData({
          ['form.nickName']: res.data.ownerName,
          ['form.phone']:  res.data.ownerPhone
        })
      }else{
        app.showModalMsg(res.msg)
      }
    })
  },
  //修改手机号
    handleRepair() {
    if (!this.validate()) {
      return
    }

    let params = {
      id: this.data.form.id,
      ownerName: this.data.form.nickName,
      ownerPhone: this.data.form.phone     
    }
    ownerModify(params).then(res=>{
        if(res.code == 200){
          wx.showToast({
            title: res.msg,
          })
           setTimeout(function(){
             app.goBack()
           },1000)
        }else{
          app.showModalMsg(res.msg)
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