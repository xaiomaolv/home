// pages/house/map/map.js
import { userRoom, community, floor, buildingUnit, buildingRoom, bindRoom } from '../../../api/property.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    communityArray: [],
    communityIndex: '',

    floorArray: [],
    floorIndex: '',

    unitArray: [],
    unitIndex: '',

    roomArray: [],
    roomIndex: '',

    form: {
      nickName: '',
      phone: '',
      communityId: '',
      communityName: '',
      buildingRoomId: '',
    },
    rules: {
      buildingRoomId: [
        { required: true, msg: '请选择房屋信息' }
      ],
      'nickName': [
        { required: true, msg: '请输入姓名' }
      ], //身份证
      // 'phone': [
      //   { required: true, msg: '请输入业主手机号' },
      //   { phone: true, msg: '请输入正确的手机号' }
      // ], //手机号
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.item)
    this.setData({
      ['form.communityId']: options.id,
      ['form.communityName']: options.name,
    })
    if (app.globalData.phone) {
      this.setData({
        ['form.phone']: app.globalData.phone,
        disabled: true
      })
    }
  },
  init() {
    // community().then(res => {
    //   if (res.code == 200) {
    //     this.setData({
    //       communityArray: res.data
    //     })
    //   }
    // })
    floor(this.data.form.communityId).then(res => {
      if (res.code == 200) {
        this.setData({
          floorArray: res.rows,
        })
      }
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
  //小区选择器
  bindCommunityChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail, e.detail.value)
    this.setData({
      floorIndex: '',
      unitIndex: '',
      roomIndex: ''
    })
    let value = e.detail.value
    this.data.communityArray.forEach((item, index) => {
      if (index == value) {
        floor(item.id).then(res => {
          if (res.code == 200) {
            this.setData({
              communityIndex: e.detail.value,
              floorArray: res.rows,
              ['form.communityId']: item.id
            })
          }
        })
      }
    })
  },
  bindFloorChange(e) {
    this.setData({
      unitIndex: '',
      roomIndex: ''
    })
    let value = e.detail.value
    this.data.floorArray.forEach((item, index) => {
      if (index == value) {
        buildingUnit(item.id).then(res => {
          if (res.code == 200) {
            this.setData({
              floorIndex: e.detail.value,
              unitArray: res.rows
            })
          }
        })
      }
    })
  },
  bindUnitChange(e) {
    this.setData({
      roomIndex: ''
    })
    let value = e.detail.value
    this.data.unitArray.forEach((item, index) => {
      if (index == value) {
        buildingRoom(item.id).then(res => {
          if (res.code == 200) {
            this.setData({
              unitIndex: e.detail.value,
              roomArray: res.rows
            })
          }
        })
      }
    })
  },
  bindRoomChange(e) {

    let value = e.detail.value
    this.data.roomArray.forEach((item, index) => {
      if (index == value) {
        this.setData({
          roomIndex: e.detail.value,
          ['form.buildingRoomId']: item.id
        })
      }
    })
  },
  bindHouse() {
    if (!this.validate()) {
      return
    }
    let params = {  
        "buildingRoomId": this.data.form.buildingRoomId,
        "communityId": this.data.form.communityId,
        "owner": {
          "ownerName": this.data.form.nickName,
          "ownerPhone": this.data.form.phone,
        }           
    }
    bindRoom(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: res.msg,
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 2
          })
        }, 1000)
      } else {
        this.showModal(res.msg || '绑定失败')
      }
    })
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