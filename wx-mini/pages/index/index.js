// pages/index/index.js
import {
  seachWxUserInfo
} from '../../api/userinfo'
import {
  accountInfoQuery
} from '../../api/pay'
import {
  searchNotice,
  upcoming
} from '../../api/notice'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerShow: false,
    bannerSrc: '',
    form: {},
    src: './img/floor.png',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show: false,
    info: {},
    noticeList: [],
    schedule: '0',
    tabList: [{
        title: '房屋信息',
        icon: 'icon-fangwufangchan',
        page: '/pages/mine/houseinfo/houseinfo',
        img:'../../img/icon/fwxx.png'
      },
      {
        title: '物业交费',
        icon: 'icon-wuyejiaofei',
        page: '/pages/payment/index/index',
        img:'../../img/icon/wyjf.png'
      },
      { 
        title: '智慧出行', 
        icon: ' icon-tingche', 
        page: '/pages/park/index',
        img:'../../img/icon/zhcx.png' 
    },
      {
        title: '报修报事',
        icon: 'icon-baoxiu',
        page: '/pages/repair/index',
        img:'../../img/icon/bxbs.png'
      },
      { 
        title: '投诉建议', 
        icon: ' icon-tousujianyi', 
        page: '/pages/complain/complain',
        img:'../../img/icon/tsjy.png' 
       },
       { 
        title: '通知公告', 
        icon: ' icon-tongzhi', 
        page: '/pages/complain/complain',
        img:'../../img/icon/tzgg.png' 
       } 
    ],
    swiperList: [{
        id: 0,
        type: 'image',
        url: 'img/1.jpg'
      },
      {
        id: 1,
        type: 'image',
        url: 'img/5.jpg',
      },
      {
        id: 2,
        type: 'image',
        url: 'img/3.png',
      },
      //  {
      //   id: 2,
      //   type: 'image',
      //   url: 'img/4.jpg',
      //   src:'https://channels1.mall.icbc.com.cn/channels/mobile/operation/ego/index.html'
      // }
    ],
    money: '****',
    moneyShow: false,
  },
  onShow: function (options) {
    this.setData({
      info: {},
      show: false,
      noticeList: [],
      schedule: 0
    })
    app.globalData.isCertification = false
    app.globalData.phone = null
    app.globalData.user_name = null
    this.init(options)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  init() {
    //父组件获取子组件对象方法,根据样式获取，建议使用selectAllComponents
    this.logo = this.selectComponent(".logo");
    //判断缓存中有没有授权信息，如果没有就显示弹窗，有就直接隐藏弹窗
    seachWxUserInfo().then(res => {
      if (res.code == 200) {
        if (res.data.wxUserInfo) {
          if (app.encryption) {
            wx.setStorageSync('rKey', res.rKey)
          }
          app.globalData.openid = res.data.wxUserInfo.openId
          app.globalData.isAccredit = true
        } else {
          // this.logo.showDialog();//调用子组件的方法
        }

        if (res.data.room != null && res.data.room.length !== 0) {
          app.globalData.room = true
        }
        app.globalData.ifShowGas = res.data.ifShowGas
        app.globalData.root = res.data.root
        app.globalData.withJson = res.data.withJson
        app.globalData.roomList = res.data.room

        // user 为空，用户未实名认证，不调以下接口
        if (!res.data.user) return;

        accountInfoQuery().then(res => {
          if (res.code == 200) {
            app.globalData.isCertification = true
            app.globalData.phone = res.data.user_phone_no
            app.globalData.user_name = res.data.user_name

            this.setData({
              info: res.data,
              ['info.bank_name']: res.data.bank_name,
              ['info.bind_card_tail']: res.data.bind_card_tail ? '**** **** **** ' + res.data.bind_card_tail : '',
              ['info.balance']: app.filters.toFix(res.data.balance / 100),
              ['info.medium_id_tail']: res.data.medium_id_tail ? '**** **** **** ' + res.data.medium_id_tail : "",
              show: true
            })
            this.getNoticeAndDan()
          } else {
            this.setData({
              info: {},
              show: false
            })
            app.globalData.isCertification = false
            app.globalData.phone = null
            app.globalData.user_name = null
          }
        })

      } else {
        app.showModalMsg('系统正在升级维护中，请稍后再试')
      }
    })
  },
  getNoticeAndDan() {
    let params = {
      "pageNum": 1,
      "pageSize": 2
    }
    searchNotice(params).then(res => {
      if (res.code == 200) {
        this.setData({
          noticeList: res.data
        })
      } else {
        this.setData({
          noticeList: []
        })
      }
    })


    upcoming().then(res => {
      if (res.code == 200) {
        this.setData({
          schedule: res.data
        })
      } else {
        this.setData({
          schedule: 0
        })
      }
    })
  },
  handelSwiper(e) {
    let item = e.currentTarget.dataset.value
    if (item.id == 1) {
      wx.navigateToMiniProgram({
        appId: 'wx35319e99c3540611', //要打开的小程序 appId
        path: '/pages/index/index', //打开的页面路径，如果为空则打开首页
        extraData: {
          foo: 'bar' //需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据
        },
        envVersion: 'release', //要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
        success(res) {
          // 打开成功
          wx.showToast({
            title: ' 打开成功',
          })
        }
      })
    }
    if (item.id == 2) {
      // this.setData({
      //   bannerShow: true,
      //   bannerSrc: item.src,
      // })
      wx.navigateTo({
        url: '/pages/park/index',
      })
    }
  },
  handleTo(e) {
    let item = e.currentTarget.dataset.value
    if (app.globalData.isCertification) {
      if (item.title == "生活服务") {
        wx.switchTab({
          url: item.page,
        })
      } else if (item.title == "报事报修") {
        if (!app.globalData.room) {
          app.bindHouseShowModal()
          return
        }
        wx.navigateTo({
          url: item.page,
        })
      } else {
        wx.navigateTo({
          url: item.page,
        })
      }
    } else {
      app.bindCardhowModal()
    }
  },
  // 用户授权获取头像信息
  handleAccredit(e) {
    this.init()
  },
  // 实名认证
  Certification() {
    wx.navigateTo({
      url: '/pages/bind/bind',
    })
  },
  handleTowallet(e) {
    let item = e.currentTarget.dataset.value
    console.log(item)
    if (item.bind_card_type == '0') {
      return
    }
    wx.navigateTo({
      url: '/pages/wallet/index/index',
    })
  },
  // 绑定房产
  Bindhouse() {
    if (app.globalData.isCertification) {
      wx.navigateTo({
        url: '/pages/mine/houseinfo/houseinfo',
      })
    } else {
      app.bindCardhowModal()
    }
  },


  //通知公告
  Notice() {
    if (app.globalData.isCertification) {
      if (app.globalData.room) {
        wx.navigateTo({
          url: '/pages/notice/index',
        })
      } else {
        app.bindHouseShowModal()
      }

    } else {
      app.bindCardhowModal()
    }
  },
  // 查看余额
  handleLook() {
    if (!this.data.moneyShow) {
      this.setData({
        money: this.data.info.balance,
        moneyShow: !this.data.moneyShow
      })
    } else {
      this.setData({
        money: "****",
        moneyShow: !this.data.moneyShow
      })
    }

  },
  //待办事项
  handelToPay() {
    wx.navigateTo({
      url: '/pages/property/property',
    })
  }
})