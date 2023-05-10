import { accountDetailQuery, bindTransLog  } from '../../api/wallet'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPageNext: false,
    // form: {
    //   begin_date: '',
    //   end_date: '',
    //   page: '1',
    //   query_mode: '1',
    //   pn_busidate: '',
    //   pn_rowRecord: '',
    // },
    form: {
      start_date: '',
      end_date: '',
    },
    list: [],
    navTab: [
      { id: 1, value: '全部' },
      { id: 2, value: '成功' },
      { id: 3, value: '处理中' },
      { id: 4, value: '失败' },
    ],
    currentTab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let d = new Date()
    let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    let date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    var datetime = d.getFullYear() + '-' + month + '-' + date
    this.setData({
      ['form.start_date']: datetime,
      ['form.end_date']: datetime,
    })
  },
  currentTab: function (e) {
    let idx = e.currentTarget.dataset.idx
    if (this.data.currentTab == e.currentTarget.dataset.idx) {
      return;
    }
    this.data.navTab.forEach((item, index) => {
      if (index == idx) {
        this.setData({
          ['form.money']: item.value,
          showValue: item.value
        })
      }
    })
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  init() {
    
  },
  // 时间段选择 
  bindDateChange(e) {
    this.setData({
      [e.target.dataset.obj]: e.detail.value
    })
    this.reset()
  },
  reset() {
    this.setData({
      list: [],
      showPageNext: false,
      ['form.query_mode']: 1,
      ['form.pn_busidate']: '',
      ['form.pn_rowRecord']: '',
    })
  },
  search() {
    this.reset()
    this.next()
  },
  next() {
    if (!this.data.form.start_date) {
      wx.showToast({
        title: '请选择开始日期',
        icon: 'none'
      })
      return;
    }
    if (!this.data.form.end_date) {
      wx.showToast({
        title: '请选择结束日期',
        icon: 'none'
      })
      return;
    }
   
    bindTransLog(this.data.form).then(res => {
      if (res.code == 200 ) {
        res.data.logs.forEach(item => {
          // item.rechargeFlag = item.rechargeFlag == 1 ? '客户手动资金转入' : '系统自动资金转入'

          item.trans_type = item.trans_type == 1 ? '资金转入' : '资金转出'
          if (item.status == '0') {
            item.doc = "成功"
          }
          if (item.status == '-1' && item.trans_retmsg) {
            item.doc = item.trans_retmsg
          }
          if (item.status == '-1' && !item.trans_retmsg) {
            item.doc = '失败'
          }
          item.amount = app.filters.toFix(item.amount / 100)
        })
        this.setData({
          list: [...res.data.logs],
        })
      }else{
        // 查询失败提示
        app.showModalMsg(res.msg)
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
    // this.init()
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
