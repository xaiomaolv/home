// pages/mine/houseinfo/houseinfo.js
import { allRoom, roomDeatil, getDicts} from '../../../api/property'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    root:null,
    optinos:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      root:app.globalData.root
    })
   
  },
  init(){
    getDicts("t_owner_identity").then(res =>{
      if(res.code == 200){
        this.setData({optinos: res.rows})
      }
    })
    allRoom().then(res=>{
      if(res.code == 200){
        this.setData({list: res.rows})
      }
    })
  },
  handleItem(e){
    let item = e.currentTarget.dataset.value
    wx.navigateTo({
      url: './detail/detail?id=' + item.buildingRoomId,
    })
  },
  handleAddfamily(e){
    let item = e.currentTarget.dataset.value
    wx.navigateTo({
      url: '/pages/house/familylist/familylist?buildingRoomId=' + item.buildingRoomId+'&communityId='+ item.communityId + "&id="  +  item.buildingUserId,
    })
  },
  handleAdd(){
    wx.navigateTo({
      url: '/pages/house/house',
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