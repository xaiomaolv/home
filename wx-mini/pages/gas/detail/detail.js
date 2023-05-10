// pages/gas/detail/detail.js
import {
    confirmPayment
} from '../../../api/gas'
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        params: {},
        phone: '',
        //还款金额
        totalBill: '',
        // 分期list
        installment: [],
        // 首期
        eachAmount: '',
        // 定金
        depositAmount: '',
        info:{},
        row:{},
        index:'',
        type:'',
        intertemporal:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.showmodal = this.selectComponent(".showmodal");
        let item = options.params ? JSON.parse(options.params) : {}
        let row = options.row ? JSON.parse(options.row) : {}
        let info = options.info ? JSON.parse(options.info) : {}
        let index = options.index ? options.index : ''
        let type = options.type ?  options.type: ''
        let intertemporal = options.intertemporal? options.intertemporal: false
        
        this.setData({
            phone: app.globalData.phone,
            params: item,
            info: info,
            row: row,
            index: Number(index),  
            intertemporal: intertemporal       
        })

        this.setData({
            ['params.totalBill']: Number(this.data.params.totalBill)
        })
        this.setData({
            depositAmount: (this.data.params.totalBill - Number(this.data.params.countAmount)).toFixed(2) 
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

    },
    // 还款
    handlePay() {      
        this.setData({
            show: true
        })
        if(this.data.intertemporal === 'true' ){
            app.showModalMsg('不能跨期还款')
            return;
        }
        this.showmodal.show()
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
        let params = {
            id: this.data.info.id ? [this.data.info.id] : [this.data.params.id],
            phone: this.data.phone,
            smsCode: form.sms_code,
            type: this.data.info.type ? this.data.info.type: this.data.params.type,
            index: this.data.index ? this.data.index : '',
            list: this.data.info.type == 2 ? [this.data.row] : [],
            amount: this.data.info.type == 2 ? this.data.row.amount : this.data.depositAmount
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
                setTimeout(function () {
                    app.goBack()
                }, 1000)
            } else {
                app.showModalMsg(res.msg || '交费失败')
            }
        })
    },

})