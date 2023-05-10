// pages/repair/repairform/repairform.js
import { userRoom, community, floor, buildingUnit, buildingRoom, bindRoom, allRoom } from '../../../api/property.js'
import { category, addRepair, getRepairById, repairUpdata } from '../../../api/repair'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    communityArray: [],
    communityIndex: '',

    array: [],
    index: '',

    form: {
      phone: '',
      content: '',
      image: '',
      categoryId: '',
      communityId: '',
      buildingRoomId: '',
    },
    rules: {
      buildingRoomId: [
        { required: true, msg: '请选择房屋信息' }
      ],
      categoryId: [
        { required: true, msg: '请选择报修类别' }
      ],
      // 'userName': [
      //   { required: true, msg: '请输入姓名' }
      // ], //身份证
      phone: [
        { required: true, msg: '请输入联系电话' },
        { phone: true, msg: '请输入正确的手机号' }
      ], //手机号
      content: [
        { required: true, msg: '请输入报修内容' }
      ], //身份证
    },
    countPic: 9,//上传图片最大数量
    showImgUrl: "http://192.168.0.110:8084/", //路径拼接，一般上传返回的都是文件名，
    uploadImgUrl: 'http://192.168.0.110:8084/property/buildingRoom/upload',//图片的上传的路径,
    upId: '',
    upIdDaiabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      let id = options.id
      this.setData({ upId: options.id })

    }
    this.setData({
      ['form.phone']: app.globalData.phone
    })
    this.setData({
      ['form.newHomeTime']: this.getNowFormatDate()   
    })
    
   // 修改
    if(this.data.upId){
      this.init(this.data.upId)
    }else{
      // 添加
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
    }
  },
  init(id) {
    getRepairById(id).then(res => {
      if (res.code == 200) {
        let data = res.data;
        data.communityname = data.communityName + data.name + data.unitNum + data.roomNum;
        this.setData({ 
          form: data, 
          upIdDaiabled: true
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
  handleChange(e) {
    this.setData({
      ['form.newHomeTime']: e.detail.dateString
    })
  },
  //小区选择器
  bindCommunityChange: function (e) {
    let value = e.detail.value
    this.data.communityArray.forEach((item, index) => {
      if (index == value) {
        this.setData({
          communityIndex: e.detail.value,
          ['form.communityId']: item.communityId,
          ['form.buildingRoomId']: item.buildingRoomId
        })
        category(item.communityId).then(res => {
          if (res.code == 200) {
            this.setData({
              array: res.data
            })
          }
        })
      }
    })
  },

  bindPickerChange: function (e) {
    let value = e.detail.value
    this.data.array.forEach((item, index) => {
      if (index == value) {
        this.setData({
          index: e.detail.value,
          ['form.categoryId']: item.id
        })
      }
    })
    this.setData({
      index: e.detail.value
    })
  },
  bindTextAreaFocus(e){
    this.setData({ ['form.content']: e.detail.value })
  },
  bindTextAreaBlur: function (e) {
    this.setData({ ['form.content']: e.detail.value })
  },
  //监听组件事件，返回的结果
  myEventListener: function (e) {
    console.log("上传的图片结果集合")
    console.log(e.detail.picsList)
  },
  handleRepair() {
    if (!this.validate()) {
      return
    }
    let params = {
      communityId: this.data.form.communityId,
      buildingRoomId: this.data.form.buildingRoomId,
      categoryId: this.data.form.categoryId,
      content: this.data.form.content,
      phone: this.data.form.phone,
      newHomeTime: this.data.form.newHomeTime? this.data.form.newHomeTime + ":00" : ""
    }
    if (this.data.upId) {
      params.id = this.data.upId
      repairUpdata(params).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: res.msg,
            icon: "success"
          })
          setTimeout(function () {
            app.goBack()
          }, 1000)
        } else {
          app.showModalMsg(res.msg)
        }
      })
    } else {
      addRepair(params).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: res.msg
          })
          setTimeout(function () {
            app.goBack()
          }, 1000)
        } else {
          this.showModal(res.msg)
        }
      })
    }
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
  getNowFormatDate() {
    let d = new Date()
    let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    let date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    let curHours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    let curMinutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    let curSeconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();

    var datetime = d.getFullYear() + '-' + month + '-' + date + ' ' + curHours +':' + curMinutes // + ':' + curSeconds
    
    return datetime;
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