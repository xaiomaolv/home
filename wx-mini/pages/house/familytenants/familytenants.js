// pages/repair/repairform/repairform.js
import { addFamily ,getDicts} from '../../../api/property.js'

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

    array: [],
    index: '',

    form: {
      email: '',
      idcard: '',
      nickName:'',
      phone: '',
      dictDataId: '',
      communityId: '',
      buildingRoomId: '',
      id:''
    },
    rules: {
      // buildingRoomId: [
      //   { required: true, msg: '请选择房屋信息' }
      // ],
      dictDataId: [
        { required: true, msg: '请选择类别' }
      ],
      nickName: [
        { required: true, msg: '请输入姓名' }
      ], 
      // idcard: [
      //   { required: true, msg: '请输入身份证号' },
      //   { idcard: true, msg: '请输入正确的身份证号' }
      // ], 
      phone: [
        { required: true, msg: '请输入联系电话' },
        { phone: true, msg: '请输入正确的手机号' }
      ], 
      // email: [
      //   { required: true, msg: '请输入邮箱' },
      //   { email: true, msg: '请输入正确的邮箱' }
      // ]
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      this.setData({
        ['form.buildingRoomId']: options.buildingRoomId,
        ['form.communityId']: options.communityId,
        ['form.id']: options.id,
      })
    }
    
  },
  init(){
     getDicts("t_owner_identity").then(res =>{
        if(res.code == 200){
           const list = res.data.filter(r => r.dictValue != '1')
          this.setData({array:list})      
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
  
  bindPickerChange: function (e) {
    let value =  e.detail.value
    this.data.array.forEach((item, index) => {
      if (index == value) {
        this.setData({
          index: e.detail.value,
          ['form.dictDataId']: item.dictValue
        })
      }
    })
    this.setData({
      index: e.detail.value
    })
  },
  handleRepair() {
    if (!this.validate()) {
      return
    }
    let params = {
      id: this.data.form.id,
      communityId: this.data.form.communityId,
      buildingRoomId: this.data.form.buildingRoomId,
      owner: {
        dictDataId:this.data.form.dictDataId,
        email: this.data.form.email,
        idcard: this.data.form.idcard,
        ownerName:this.data.form.nickName, 
        ownerPhone: this.data.form.phone
      }
     
    }
    
    addFamily(params).then(res=>{
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