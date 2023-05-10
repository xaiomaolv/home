// pages/webview/webview.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let url = 'https://wypzf.xsy365.com.cn/miniapp/send_sign/hebeiv2/index.html?pid=3Jhf918'
        // 
        if(options.item){
            let obj = JSON.parse(options.item)
            let str = '&agent_name=' + obj.agentName+ '&out_trade_no='+ obj.outTradeNo + '&mobile=' + obj.mobile +'&prize_id='+ obj.prizeId + '&sign=' + obj.sign
            
            this.setData({
                src: url + str
            })
        }
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