// pages/property/property.js
import {
  getPayBillsList,
  smsCode,
  confirmPayment,
  payBillsFindById
} from '../../api/pay'
import {uploadImg} from '../../api/property'
import {loginuserroom} from '../../api/deposit'
import {autoPayCategory,miniAutoPayBill} from '../../api/autoBilles'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    onMoreFlag: false,
    showPageNext: false,
    pageNum: 1,
    phone: '',
    selectAll: false,
    checked: false,
    settleAccounts: 0,
    total: 0,
    checkArr: [],
    agreementList: [{
      id: '5',
      title: '《中国工商银行“物业管理费”委托代扣协议》'
    }],
    agreement: false,
    agreeTitle: '',
    agreeId: '',
    communityId: '',
    roomList: [],
    finished: false,
    bindList:[],
    signImg:'' ,//签名
    canvasShow: false,
    menuTapCurrent:"0",
    form:{
      communityId:'',
      categoryId:'',
      buildingRoomId:'',
      totalBill:'',
      intervalStart:"",
      intervalEnd:"",
      payCycle:''
    },
    categoryAutoType:'',
    payCycleArray:[{name:"年度"},{name:"半年"},{name:"季度"},{name:"月"}],
    payCycArrayIndex:'',
    totoalBillShow: false,
    array: [],
    communityArray: [],
    communityIndex: '',
    rules: {   
      buildingRoomId: [
        { required: true, msg: '请选择房屋' }
      ], 
    },
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showmodal = this.selectComponent(".showmodal");
    this.agreement = this.selectComponent(".agreement");
    this.roomlist = this.selectComponent(".roomlist");
    this.sign = this.selectComponent(".sign");
    // this.agreement.showlog()
    this.sign.show() 
    this.setData({
      phone: app.globalData.phone,
      showPageNext: false,
      onMoreFlag: false,
      pageNum: 1,
      list: [],
      selectAll: false,
      checkArr: [],
      total: 0
    })
    this.getList();
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
    });
  },
  next() {
    this.setData({
      selectAll: false,
      checkArr: [],
    })
    this.getList()
  },
  getList() {
    let params = {
      "pageNum": this.data.pageNum,
      "pageSize": 20,
      "type":''
    }

    getPayBillsList(params).then(res => {
      wx.hideLoading();
      //隐藏导航条加载动画
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
      if (res.code == 200) {   
        let arr = res.data
        var map = {},
        dest = [];
        for (var i = 0; i < arr.length; i++) { 
          var ai = arr[i];
          ai['num'] = 1
          if(!ai.bindPay){
            dest.push(ai)
          }else{
          if (!map[ai.bindPay]) {
            dest.push(ai);
            map[ai.bindPay] = ai;

          } else {
            for (var j = 0; j < dest.length; j++) {
              var dj = dest[j];
              if (dj.bindPay == ai.bindPay) {
                dj.totalBill =  (parseInt(dj.totalBill * 100 ) + parseInt(ai.totalBill* 100))/100;
                dj['num'] = parseInt(dj.num) + parseInt(ai.num);
                break;
              }
            }
          }
        }
        };
 
        let len = res.data.length;
        if (len >= 20) {
          this.setData({
            showPageNext: false,
            pageNum: this.data.pageNum + 1
          })
        } else {
          this.setData({
            showPageNext: true,
            onMoreFlag: true,
          })
        }

        this.setData({
          list: [...this.data.list, ...dest],
        })

      }
    })
  },
  handleadd() {
    wx.navigateTo({
      url: './repairform/repairform',
    })
  }, 
    // 时间段选择  
    bindDateChange(e) {
      this.setData({
        [e.target.dataset.obj]: e.detail.value
      })

    },
  handleSubmit(){

    if (!this.data.form.communityId) {
      app.showModalMsg('请选择房屋')
      return
    }
    if (!this.data.form.categoryId) {
      app.showModalMsg('请选择缴费类目')
      return
    }
    if (!this.data.form.intervalStart) {
      app.showModalMsg('请选择开始时间')
      return
    }
    if (!this.data.form.intervalEnd) {
      app.showModalMsg('请选择结束时间')
      return
    }
    if (!this.data.form.totalBill) {
      app.showModalMsg('请输入缴费金额')
      return
    }
    if (!this.data.form.payCycle) {
      app.showModalMsg('请选择交费周期')
      return
    }
    if (this.data.form.intervalStart > this.data.form.intervalEnd) {
      app.showModalMsg('开始时间必须大于等于结束时间')
      return
    }
    this.showmodal.show()
    
  },
  bindPayCycleArrayChange: function (e) {
    let value = e.detail.value
    this.data.payCycleArray.forEach((item, index) => {
      if (index == value) {
          this.setData({
            payCycArrayIndex: e.detail.value,
            ['form.payCycle']: item.name,
          })   
      }
    })
  },
  bindPickerChange: function (e) {
    let value = e.detail.value
    this.data.array.forEach((item, index) => {
      if (index == value) {
        if(item.autoPayType == "1"){
          this.setData({
            index: e.detail.value,
            ['form.categoryId']: item.id,
            ['form.totalBill']: null,
            categoryAutoType:"1",
            totoalBillShow: false
          })
        }else{
          this.setData({
            index: e.detail.value,
            ['form.categoryId']: item.id,
            ['form.totalBill']: item.autoPayMoney,
            categoryAutoType:"0",
            totoalBillShow: true
          })
        }     
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
            ['form.buildingRoomId']: item.buildingRoomId,
            ['form.totalBill']: ''
          })
          autoPayCategory(item.communityId).then(res => {
            if (res.code == 200) {
              let newArr = res.data
              this.setData({
                array: newArr
              })
            }
          })
        }
      })
    },
  menuTap(e){
    let current=e.currentTarget.dataset.current;
    this.setData({
    menuTapCurrent:current
    });
  },
  //全选与反全选
  selectall: function (e) {
    console.log(e)
    var that = this;
    var arr = []; //存放选中id的数组
    let total = 0
    this.setData({
      total: 0
    })
    for (let i = 0; i < that.data.list.length; i++) {

      that.data.list[i].checked = (!that.data.selectAll)

      if (that.data.list[i].checked == true) {
        // 全选获取选中的值
        arr = arr.concat(that.data.list[i].id.toString().split(','));

        total += that.data.list[i].totalBill * 100
      }
    }
    console.log(arr)
    that.setData({
      list: that.data.list,
      selectAll: (!that.data.selectAll),
      checkArr: arr,
      total: total / 100
    })
  },

  // 单选
  checkboxChange: function (e) {
    this.setData({
      total: 0
    })
    let checked = e.detail.value
    let list = this.data.list
    let total = 0
    let checked_all = ''
    for (let i = 0; i < list.length; i++) {
      checked.forEach(item => {
        if (item == list[i].id) {
          total += list[i].totalBill * 100
        }
      })
    }
    if (checked.length == this.data.list.length) {
      checked_all = true
    } else {
      checked_all = false
    }
    this.setData({
      selectAll: checked_all,
      checkArr: e.detail.value, //单个选中的值
      total: total / 100
    })
  },
  handlePay() {
    if (this.data.checkArr.length == 0) {
      app.showModalMsg('请选择交费项目')
      return
    }

    let list = this.data.list
    let arr = []
    for (let i = 0; i < list.length; i++) {
      this.data.checkArr.forEach(item => {
        if (item == list[i].id) {
          arr.push(list[i].room.communityId)
        }
      })
    }
    let that = this
    // 筛选业主绑定过的小区
    let newarr = [...new Set(arr)]
    this.setData({
      bindList: newarr
    })
    let obj = app.globalData.withJson;

    if(obj != null && obj != ''){
    newarr.forEach(item => {
      Object.keys(obj).forEach(key => {

        if (item == key) {
          if (!obj[key].ifWith && obj[key].ifOne) {
            that.agreement.showlog()
            that.setData({
              // agreeTitle: that.data.agreementList[0].title,
              // agreeId: that.data.agreementList[0].id,
              show: true,
              // communityId: item,
              
            })
            return
          }
        }
      })
    })
  }
    this.showmodal.show()
    this.setData({
      show: true
    })
  },
  cancel(e) {
    this.showmodal.hide()
    this.setData({
      ['form.sms_code']: '',
      show: false
    })
  },
  confirm(e) {
    let form = e.detail

    if (!form.sms_code) {
      app.showModalMsg('请输入验证码')
      return;
    }
    //判断是什么类型
    if( this.data.menuTapCurrent == '0' ){
    if (this.data.checkArr.length == 0) {
      app.showModalMsg('请选择交费项目')
      return
    }
    let params = {
      id: this.data.checkArr,
      phone: this.data.phone,
      smsCode: form.sms_code
    }
    confirmPayment(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '支付成功',
        })
        this.showmodal.hide()
        this.setData({
          show: false
        })
        if(res.data){
          wx.navigateTo({
            url: '/pages/webview/webview?item='+ JSON.stringify(res.data),
          })
        }else{
          setTimeout(function () {
            app.goBack()
          }, 1000)
        }
        
      } else {
        app.showModalMsg(res.msg || '交费失败')
      }
    })
  }else if( this.data.menuTapCurrent == '1' ){
    var params =  {
      phone: this.data.phone,
      smsCode: form.sms_code,
      ...this.data.form
    }
    miniAutoPayBill(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '支付成功',
        })
        this.showmodal.hide()
        this.setData({
          show: false
        })
        if(res.data){
          wx.navigateTo({
            url: '/pages/webview/webview?item='+ JSON.stringify(res.data),
          })
        }else{
          setTimeout(function () {
            app.goBack()
          }, 1000)
        }  
      } else {
        app.showModalMsg(res.msg || '交费失败')
      }
    })
  }
  },
  // 协议
  handleCencel(){
    this.showmodal.show()
  },
  handleConfirm(e) {
    this.setData({
      canvasShow: true
    })
    // this.sign.show()  
  },
  // 取消
  roomcancel(e) {
    this.showmodal.show()
  },
  roomconfirm(e) {
    this.showmodal.show()
  },
  // 取消
  signCancel(){
    this.setData({
      canvasShow: false
    })
    this.showmodal.show()
  },
  // 签名完成
  signConfirm(e){

    this.setData({
      canvasShow: false
    })
    let params = {
      base64: 'data:image/jpeg;base64,' + e.detail.src
    }
    
    let list = app.globalData.roomList
    let arr = []
    let obj = app.globalData.withJson
    if(obj !== null || obj !== ''){
      list.forEach(item => {
        Object.keys(obj).forEach(key => {
          if (item.communityId == key) {
            let em = Object.assign(item, obj[key]);
            arr.push(em)
          }
        })
      })
    }
    
    this.setData({
      roomList: arr
    })

    this.roomlist.showlog()
    // 上传签名
    uploadImg(params).then(res=>{
      this.setData({
        signImg: res.data
      })
      
    }) 
     
  },
  // 交费记录
  handleRecords() {
    wx.navigateTo({
      url: '/pages/records/records',
    })
  },
  // 协议查看
  handleAgreement(e) {
    let that = this
    let item = e.currentTarget.dataset.value
    this.setData({
      agreeTitle: item.title,
      agreeId: item.id,
      show: true
    })
    that.agreement.showlog()
  },
  switchAgreement() {
    this.setData({
      agreement: !this.data.agreement
    })
  },
  handleDeatil(e) {

    let item = e.currentTarget.dataset.value
    wx.navigateTo({
      url: './deatil/detail?item='+ JSON.stringify(item),
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

  //刷新
  onRefresh() {
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    wx.showLoading({
      title: '刷新中...',
    })
    this.getList();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //调用刷新时将执行的方法
    for (let i = 0; i < this.data.list.length; i++) {

      this.data.list[i].checked = false

    }

    this.setData({
      showPageNext: false,
      onMoreFlag: false,
      pageNum: 1,
      list: [],
      selectAll: false,
      checkArr: [],
      total: 0
    })
    this.onRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    if (!this.data.onMoreFlag) {
      for (let i = 0; i < this.data.list.length; i++) {
        this.data.list[i].checked = false
      }
      this.setData({
        selectAll: false,
        checkArr: [],
        total: 0
      })

      wx.showLoading({
        title: '加载中...',
      })
      this.getList()
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
