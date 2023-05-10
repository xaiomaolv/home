// pages/gas/single/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navTab: [{
            id: 1,
            title: '上一月'
          },
          {
            id: 2,
            title: '2月'
          },
          {
            id: 3,
            title: '下一月'
          },
          
        ],
        currentTab: -1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            currentTab: 1
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
    currentTab: function (e) {
        let idx = e.currentTarget.dataset.idx
        if (this.data.currentTab == e.currentTarget.dataset.idx) {
          return;
        }
       
        this.setData({
          currentTab: e.currentTarget.dataset.idx,
          periods: this.data.navTab[e.currentTarget.dataset.idx].title
        })
      },
})