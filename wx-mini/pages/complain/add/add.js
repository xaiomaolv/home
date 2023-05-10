// pages/complain/add/add.js
import { userRoom, community, floor, buildingUnit, buildingRoom, bindRoom , allRoom} from '../../../api/property.js'
import {addSuggestions} from '../../../api/complain'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    communityArray: [],
    communityIndex: '',

    floorArray: [],
    floorIndex: '',

    unitArray: [],
    unitIndex: '',

    roomArray: [],
    roomIndex: '',
    isDisabled: true,
    form: {
      communityId: '',
      buildingRoomId: '',
      type:'',
      complainant: "",
      phone: "",
      content: "",
      image: ""
    },
    rules: {
      buildingRoomId: [
        { required: true, msg: '请选择房屋信息' }
      ], 
      type: [
        { required: true, msg: '请选择投诉类型' }
      ],
      complainant: [
        { required: true, msg: '请输入投诉人' }
      ],
      phone: [
        { required: true, msg: '请输入业主手机号' },
        { phone: true, msg: '请输入正确的手机号' }
      ], //手机号
      content: [
        { required: true, msg: '请输入投诉内容' }
      ],
      // image: [
      //   { required: true, msg: '请输入姓名' }
      // ],
      
    },
    array: [{ id: 1, name: '投诉' }, { id: 2, name: '建议' }],
    index:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     ['form.complainant']:app.globalData.user_name,
     ['form.phone']:app.globalData.phone
   })
   allRoom().then(res => {
    if (res.code == 200) {
      let arr = []
      let data = res.rows
      data.forEach(item => {
        item.name = item.communityName + (item.name ?  item.name :'' ) + (item.unitNum ? '-' + item.unitNum:'')  + (item.roomNum ? '-' + item.roomNum:'')
        arr.push(item)
      })
      this.setData({
        communityArray: arr
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
    let value = e.detail.value
    this.data.communityArray.forEach((item, index) => {
      if (index == value) {
        this.setData({
          communityIndex: e.detail.value,
          ['form.communityId']: item.communityId,
          ['form.buildingRoomId']: item.buildingRoomId
        })
      }
    })
  },
  
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let value =  e.detail.value
    this.data.array.forEach((item, index) => {
      if (index == value) {
        this.setData({
          index: e.detail.value,
          ['form.type']: item.id
        })
      }
    })
  },
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
    this.setData({ ['form.content']: e.detail.value })
  },
  handleAdd(){
    
      if (!this.validate()) {
        return
      }
      console.log('form', this.data.form)
      let params = {
        communityId: this.data.form.communityId,
        buildingRoomId: this.data.form.buildingRoomId,
        type: this.data.form.type,
        complainant: this.data.form.complainant,
        phone: this.data.form.phone,
        content: this.data.form.content,
        image: this.data.form.image      
      }
      addSuggestions(params).then(res=>{
          if(res.code == 200){
            wx.showToast({
              title: res.msg,
            })
             setTimeout(function(){
               app.goBack()
             },1000)
          }else{
            this.showModal(res.msg)
          }
      })
    },
    showModal(msg){
      wx.showModal({
        title: '',
        content:  msg,
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