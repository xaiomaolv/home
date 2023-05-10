// pages/gas/index/index.js
import {
  confirmPayment
} from '../../../api/gas'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navTab: [{
        id: 1,
        value: 3,
        title: '3期'
      },
      {
        id: 2,
        value: 6,
        title: '6期'
      },
      {
        id: 3,
        value: 9,
        title: '9期'
      },
      {
        id: 4,
        value: 12,
        title: '12期'
      },
    ],
    currentTab: -1,
    periods: '',
    periodsValue:'',
    show: false,
    dialogShow: false,
    checkedId: '',
    list: ['0', '1', '2'],
    stageShow: false,
    moneyShow: false,
    allShow: false,
    gasShow: false,
    djShow: false,
    params: {},
    phone:'',
    //还款金额
    totalBill:'',
    // 分期list
    installment:[],
    // 首期
    eachAmount:'',
    // 定金
    depositAmount:'' ,
    agreementList: [
      { id: '10', title: '《云南中能天然气配套入户安装分期合同》' }
    ],
    agreeTitle: '',
    agreeId: '',
    agreement: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.agreement = this.selectComponent(".agreement");
    this.showmodal = this.selectComponent(".showmodal");
    this.setData({
        phone: app.globalData.phone
    })
    this.params = JSON.parse(options.item);
    this.setData({
      currentTab: 0,
      periods: this.data.navTab[0].title,
      periodsValue: this.data.navTab[0].value,
      params: JSON.parse(options.item),
      allShow: this.params.gasState == null || this.params.gasState == '' ||   this.params.gasState.indexOf("1") != -1,
      gasShow: this.params.gasState == null || this.params.gasState == '' ||  this.params.gasState.indexOf("2") != -1,
      djShow:  this.params.gasState == null || this.params.gasState == '' ||  this.params.gasState.indexOf("3") != -1,
    });
    
    this.setData({
      ['params.totalBill']: Number(this.data.params.totalBill)
    })
     this.sumAndDate(this.data.periodsValue, this.data.params.totalBill)
    
   
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

  },
  // 
  dispathChange: function (e) {
    let item = e.detail.value
    this.setData({
      checkedId: item,
      agreement: false
    })
    if (item == 2) {
      this.setData({
        currentTab: 0
      })
    }
  },
  
  currentTab: function (e) {
    let idx = e.currentTarget.dataset.idx
    if (this.data.currentTab == e.currentTarget.dataset.idx) {
      return;
    }

    this.setData({
      currentTab: e.currentTarget.dataset.idx,
      periods: this.data.navTab[idx].title,
      periodsValue: this.data.navTab[idx].value
    })
    this.sumAndDate(this.data.periodsValue, this.data.params.totalBill)
  },
  // 还款
  handlePay() {
    if (!this.data.checkedId) {
      app.showModalMsg('请选择还款方式')
      return
    }
    

    if(this.data.checkedId == 2 && !this.data.agreement){
      app.showModalMsg('请阅读分期协议，并同意')
      return
    }
    this.setData({
      show: true
    })
    this.showmodal.show()
   
  },
  handleCencel() {
    this.setData({
      show: false
    })
  },
  // 确认分期
  handleConfirm() {
    
  },
  handleStage() {
    this.setData({
      stageShow: !this.data.stageShow
    })
    this.setData({
      periods: this.data.navTab[this.data.currentTab].title
    })
    if (this.data.stageShow) {
      this.setData({
        currentTab: this.data.currentTab
      })
    }
  },
  handleMoney() {
    this.setData({
      moneyShow: !this.data.moneyShow
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
    if (!this.data.checkedId) {
      app.showModalMsg('请选择还款方式')
      return
    }
    if (!form.sms_code) {
      app.showModalMsg('请输入验证码')
      return;
    }
    let params = {
      id: [this.data.params.id],
      phone: this.data.phone,
      smsCode: form.sms_code,
      type: this.data.checkedId,
      index: this.data.checkedId == 2 ? 0 : '',
      list: this.data.checkedId == 2 ? this.data.installment: [],
      amount: this.data.checkedId == 1 ? this.data.depositAmount : ""
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
  },

  /**
   * 分期时间金额计算
   * num 分期期数
   * total 总金额
  */
  sumAndDate(num, total){
    let n = 1 // 每期间隔一个月
    let arr = []
   
    // 每期金额， 向下取整
    let _total = Math.floor(total / num).toFixed(2);
    // 第一期金额
    let oneTotal = (total - (_total * (num - 1))).toFixed(2)

    var dataArr = [];
    var data = new Date();
    var years = data.getFullYear();
    var month = data.getMonth() < 10 ? '0' + (data.getMonth() + 1) : (data.getMonth() + 1);
    var day = data.getDate() < 10 ? '0' + data.getDate()  : data.getDate();
    if( day > 28){ 
      day = 28
    }
   // 首期还款数据
    arr.push({
      dueDate: years + "-" + month + "-" + day,
      amount: oneTotal,
      No: 1,
      totalPeriods: num
    })
   
    var afterYear; //增加后的年份
    for (var i = 0; i < num - 1; i++) {
      //day = (day < 10 ? ( "0" + day ) :  day);
      var afterMonth = (Number(month) + Number(n + (n * i))) % 12; //增加后的月份
      afterMonth == 0 ? afterMonth = 12 : afterMonth = afterMonth;
      afterMonth < 10 ? afterMonth = "0" + afterMonth : afterMonth = afterMonth;
      var year = Math.ceil((Number(month) + Number(n) + (n * i)) / 12); //年数向上取整
      if (year > 1) {
        afterYear = Number(years) + year - 1;
      } else {
        afterYear = years;
      }

      let obj= {
        dueDate: afterYear + "-" + afterMonth + "-" + day,
        amount: _total,
        No: i + 2,
        totalPeriods: num
      } 
      dataArr.push(obj);
    }

    this.setData({
      installment: [...arr, ...dataArr],
      eachAmount: oneTotal,
      depositAmount: (this.data.params.totalBill * 0.3).toFixed(2),
      totalBill: this.data.params.totalBill.toFixed(2)
    }) 

  },
   // 协议查看
   handleAgreement(e) {
    let that = this
    let item = e.currentTarget.dataset.value
    this.setData({
      agreeTitle: item.title,
      agreeId: item.id
    })
    that.agreement.showlog()
  },
  switchAgreement() {
    this.setData({ agreement: !this.data.agreement })
  },
})

