// pages/gas/refund/index.js
import { getPaySelfMent, confirmPayment } from '../../../api/gas'

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        params: {},
        list:[],
        info:{},
        amountDue:'',
        isIndex:'',
        // 是否跨期交费
        intertemporal: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.showmodal = this.selectComponent(".showmodal");
        this.setData({
            phone: app.globalData.phone,
            params: JSON.parse(options.item) 
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
    init(){
      
      let params = {
        id: this.data.params.id
      }
      getPaySelfMent(params).then(res => {

        if(res.code == 200){
          if(res.data.mentDtlList.length !== 0 || res.data.bill.length !== 0){
            this.setData({
              list: res.data.mentDtlList,
              info: res.data.bill[0],
              isIndex: res.data.tran.length,
              amountDue: (res.data.bill[0].totalBill - (res.data.bill[0].params.countAmount / 100) ).toFixed(2)
            })
            console.log(this.data.amountDue,res.data.bill[0].totalBill,res.data.bill[0].params.countAmount,8888)
          }else{
            this.setData({         
              amountDue: 0,
              list:[],
              info:{},
              isIndex:''
            })
          }
         
          
        }
      })
     
    },
    // 提前全部结清
    handlePayAll(){
        this.showmodal.show()
    },
    // 单期提前结清
    handlePay(e){

        let item = e.currentTarget.dataset.value
        let index = e.currentTarget.dataset.index
        let info = this.data.info
        // 判断是否跨期支付
        if(!item.ifPay){
          // 上一期未支付，视为跨期支付
          if(!this.data.list[index -1].ifPay){
            this.setData({
              intertemporal: true
            })
          }else{
            this.setData({
              intertemporal: false
            })
          }
        }else{
          this.setData({
            intertemporal: false
          })
        }
       
        let params= {
          id: info.id,
          totalBill: info.totalBill,
          type: 2,
          ownerName: info.room.owner.ownerName,   
          payTitle: info.payTitle,
          categoryName:info.category.categoryName,
          intervalStart:info.intervalStart + '至' + info.intervalEnd
        }
        // this.showmodal.show()
        wx.navigateTo({
          url: '../detail/detail?info=' + JSON.stringify(params) + '&row=' + JSON.stringify(item)+ '&index=' + index +'&intertemporal='+ this.data.intertemporal,
        })
    },
    // 取消短信验证
  cancel(e) {
    this.showmodal.hide()
    this.setData({
      ['form.sms_code']: '',
      show: false
    })
  },
  // 短信验证
  confirm(e) {
    let form = e.detail
   
    if (!form.sms_code) {
      app.showModalMsg('请输入验证码')
      return;
    }
    let params = {
      id: [this.data.params.id],
      phone: this.data.phone,
      smsCode: form.sms_code,
      type:2,
      index: '',
      list: this.data.list,
      advancePay: true,
      amount: this.data.amountDue
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
        app.showModalMsg(res.msg || '还款失败')
      }
    })
  },
})