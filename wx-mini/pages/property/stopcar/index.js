// pages/property/property.js
import {
  getPayBillsList,
  smsCode,
  confirmPayment,
  payBillsFindById
} from '../../../api/pay'
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
    checkArr: []
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showmodal = this.selectComponent(".showmodal");
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
    this.getList()
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
      "type":1
    }
   
    getPayBillsList(params).then(res => {
      wx.hideLoading();
      //隐藏导航条加载动画
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
      if (res.code == 200) {
        let len = res.data.length;
        if (len >= 20) {
          this.setData({
            showPageNext:false ,
            pageNum: this.data.pageNum + 1  
          })
        } else {
          this.setData({
            showPageNext: true,
            onMoreFlag: true,
          })
        }

        this.setData({
          list: [...this.data.list, ...res.data],
        })

      }
    })
  },
  handleadd() {
    wx.navigateTo({
      url: './repairform/repairform',
    })
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
    if (this.data.checkArr.length == 0) {
      app.showModalMsg('请选择交费项目')
      return
    }
    if (!form.sms_code) {
      app.showModalMsg('请输入验证码')
      return;
    }
    let params = {
      id: this.data.checkArr,
      phone: this.data.phone,
      smsCode: form.sms_code,
      type:1
    }
    confirmPayment(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '支付成功',
        })
        this.showmodal.hide()
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
  },
  // 交费记录
  handleRecords() {
    wx.navigateTo({
      url: '/pages/records/records',
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