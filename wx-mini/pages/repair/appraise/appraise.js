// pages/repair/appraise/appraise.js
import {repaireValuation} from '../../../api/repair'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      score:'',
      evaluation:''
    },
    rules: {
      score: [
        { required: true, msg: '请评分' }
      ], 
      evaluation: [
        { required: true, msg: '请输入评价内容' }
      ], 
    }
  },
  getScore(e) {
    console.log("被评价的object：", e.detail.rateObj, "评分：", e.detail.value);
    this.setData({
      ['form.score']: e.detail.value,
    })
  },
  handleSubmit(){
    if (!this.validate()) {
      return
    }
    let params = {    
        "buildingRoomId": this.data.form.buildingRoomId,
        "evaluation": this.data.form.evaluation,
        "id": this.data.form.id,
        "score": this.data.form.score.toString()
    }

    repaireValuation(params).then(res=>{
      if(res.code == 200){
        wx.showToast({
          title: res.msg,
        })
        setTimeout(function(){
          app.goBack()
        },1000)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ['form.id']: options.id,
      ['form.buildingRoomId']: options.buildingRoomId
    })
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
  bindTextAreaBlur: function (e) {
    this.setData({ ['form.evaluation']: e.detail.value })
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