// pages/repair/detail/detail.js
import { getRepairById } from '../../../api/repair'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      let id = options.id
      getRepairById(id).then(res=>{
        if(res.code == 200){
          let stateName = this.stateName(res.data.repairStatus)
          this.setData({
            info: res.data,
            ['info.stateName']: stateName
          })
        }  
      })
    }
  },
  stateName(state) {
    //1.待处理 2.处理中 3.已处理 4.已评价 5.退回
    let name = ''
    switch (state) {
      case 1:
        name = '待处理'
        break;
      case 2:
        name = '处理中'
        break;
      case 3:
        name = '已处理'
        break;
      case 4:
        name = '已评价'
        break;

      default:
        name = '退回'
        break;
    }
    return name;
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