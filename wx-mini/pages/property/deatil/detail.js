// pages/property/deatil/detail.js
import {
    getPayBillsList,
  } from '../../../api/pay'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        item:{},
        list:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.item){
          let t = JSON.parse(options.item)
          if(t.bindPay){
            this.getList(t.bindPay)
          }else{
            this.setData({
                item: t
            })
          }
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
    getList(bindPay) {
        let params = {
          "pageNum": this.data.pageNum,
          "pageSize": 20,
          "type":'',
          bindPay: bindPay
        }
    
        getPayBillsList(params).then(res => {      
          if (res.code == 200) {   
            this.setData({
              list: res.data
            })
    
          }
        })
      },
})