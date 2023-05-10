
import { costCategory, loginuserroom, depositPay} from '../../api/deposit'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,

    array: [],
    index: '',

    form:{
      categoryId:'',
      buildingRoomId:'',
      totalBill:''
    },
    communityArray: [],
    communityIndex: '',
    rules: {   
      buildingRoomId: [
        { required: true, msg: '请选择房屋' }
      ], 
      // categoryId: [
      //   { required: true, msg: '请选择押金类型' }
      // ], 
    },
    btnValue: '发送验证码',
    btnDisabled: false,
    phone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showmodal = this.selectComponent(".showmodal");
    this.parkagree = this.selectComponent(".parkagree");
    this.setData({
      ['form.phone']:app.globalData.phone,
      phone:app.globalData.phone
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
    let value = e.detail.value
    this.data.array.forEach((item, index) => {
      if (index == value) {
        if(item.id == "1"){
          this.setData({
            index: e.detail.value,
            ['form.categoryId']: '',
            show: true
          })
        }else{
          this.setData({
            index: e.detail.value,
            ['form.categoryId']: item.id,
            show: false
          })
        }     
      }
    })
  },
init(){
  loginuserroom().then(res => {
    if (res.code == 200) {
      let arr = []
      let data = res.data
      data.forEach(item => {
        item.name = item.deptName +( item.floorNum ?  item.floorNum:'' ) + (item.unitNum ? '-' + item.unitNum:'') + (item.roomNum ? '-' + item.roomNum:'')
        arr.push(item)
      })
      this.setData({
        communityArray: arr
      })
    }
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
        costCategory(item.communityId).then(res => {
          if (res.code == 200) {
            let obj = {
              categoryName: '其他',
              id: '1',
            }
            let newArr = res.data
            //newArr.push(obj)
            this.setData({
              array: newArr
            })
          }
        })
      }
    })
  },
  handleSubmit(){

   
    if (!this.validate()) {
      return
    }
    
    if (!this.data.show && !this.data.form.categoryId) {
      app.showModalMsg('请选择押金类型')
      return
    }

    if (this.data.show && !this.data.form.totalBill) {
      app.showModalMsg('请输入押金金额')
      return
    }
  
    if (this.data.show && !this.data.form.totalBill) {
      app.showModalMsg('请输入押金金额')
      return
    }

    this.showmodal.show()
    
  },
  cancel(e) {
    this.showmodal.hide()
    this.setData({
      ['form.sms_code']: ''
    })
  },
  confirm(e) {

    let form = e.detail
    if (!form.sms_code) {
      app.showModalMsg('请输入验证码')
      return;
    }

    this.setData({
      ['form.smsCode']:form.sms_code 
    })

    let params = this.data.form; 
    params.phone =  this.data.phone;
    params.smsCode =  form.sms_code;
    depositPay(params).then(res=>{
      if(res.code == 200){
        wx.showToast({
          title: res.msg,
          icon: "success"
        })
        this.showmodal.hide()
        this.setData({
          show: false
        })
        setTimeout(function () {
          app.goBack()
        }, 1000)
      }else{
        app.showModalMsg(res.msg || '支付失败')
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

  },
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: second + 'S',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '重新发送',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
})