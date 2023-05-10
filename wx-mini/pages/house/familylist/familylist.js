// pages/house/familylist/familylist.js
import { getBindingUserList, defaultNotice,bindUserUntie, getDicts } from '../../../api/property.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    familyList: [],
    form: {
      buildingRoomId: '',
      communityId:'',
      id: ''
    },
    itemId: null,
    optinos:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      this.setData({
        ['form.buildingRoomId']: options.buildingRoomId,
        ['form.communityId']: options.communityId,
        ['form.id']:options.id
      })
    }
  },
init(){
  
  let params = {
    id: this.data.form.id,
    page: 1,
    pageSize: 99999
  }
  getBindingUserList(params).then(res => {
    if (res.code == 200) {
      let arr = res.data
      arr.forEach(item =>{         
        item.dictValue = app.selectOptionLabel(this.data.optinos, item.owner.dictDataId)
        if(item.isDefault == 1){
          this.setData({
            itemId: item.id,
          })
        }
      })
      let newArr = arr.sort(this.compare)
      this.setData({ familyList: newArr }) 
    } else {
      wx.showModal({
        content: res.msg,
        showCancel: false
      })
    }
  })
},
// 数组对象排序
compare(obj1,obj2){
  var val1 = obj1.owner.dictDataId;
  var val2 =  obj2.owner.dictDataId;
  if(val1 < val2){
     return -1;
  }else if(val1 > val2){
    return 1;
  }else{
    return 0;
  }
},
  handleAdd() {
    wx.navigateTo({
      url: '../familytenants/familytenants?buildingRoomId=' + this.data.form.buildingRoomId + '&communityId=' + this.data.form.communityId + '&id='+ this.data.form.id,
    })
  },
  switchChange(e) {
    let item = e.currentTarget.dataset.value
    this.setData({
      itemId: item.id,
    })
    let params = {
      "buildingRoomId":item.buildingRoomId,
      "id": item.id
    }
    defaultNotice(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '默认设置成功',
        })
        this.init()
      }
    })
  },
  // 租客家人修改信息
  handleAmend(e){
    let item = e.currentTarget.dataset.value
    wx.navigateTo({
      url: './amend/amend?id=' + item.ownerId,
    })
  },
  // 解绑
  handleItem(e){
    let that = this
    let item = e.currentTarget.dataset.value
    wx.showModal({
      content: '确认解绑？',
      // showCancel: false,
      title: '',
      success: (res) => {
        if (res.confirm) {
          bindUserUntie(item.id).then(res=>{
            if(res.code == 200){
              wx.showToast({
                title: res.msg,
              })
              setTimeout(function(){
                that.init()
              },1000)           
            }else{
              app.showModalMsg(res.msg)
            }
          })
        }else if (res.cancel) {

        }
      },
      fail: (res) => { },
      complete: (res) => { },
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
  onShow: function (options) {
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