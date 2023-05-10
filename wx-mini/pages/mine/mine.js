// pages/mine/mine.js
import {
  seachWxUserInfo
} from '../../api/userinfo'
import {
  accountInfoQuery
} from '../../api/pay'
import {
  smsCode, showCardNo,checkCloseBindCard
} from '../../api/bind'

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: '/img/header.png',
      nickName: '登录'
    },
    show: false,
    info: {},
    isLogin: false,
    form: {},
    user: {},
    root: null,
    money: '****',
    moneyShow: false,
    tabList: [
      { title: '我的钱包', icon: '', page: '/pages/mine/wallet/wallet' },
      { title: '修改手机号', icon: '', page: '/pages/mine/amendphone/index' },
      { title: '房屋信息', icon: '', page: '/pages/mine/houseinfo/houseinfo' },
      { title: '家人及租户', icon: '', page: '/pages/house/familylist/familylist' },
      { title: '报修清单', icon: '', page: '/pages/repair/index' },
      { title: '投诉单', icon: '', page: '/pages/complain/complain' }
    ],
    withJson:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showmodal = this.selectComponent(".showmodal");
    this.logo = this.selectComponent(".logo");
    this.unbind = this.selectComponent(".unbind");
    this.unbindmodal = this.selectComponent(".unbindmodal");
 

    this.setData({
      root:app.globalData.root,
      withJson: app.globalData.withJson
    })
  },

  init() {
    this.setData({
      info:{},
      show: false
    })
    app.globalData.isCertification = false
    app.globalData.phone = null
    app.globalData.user_name = null
    seachWxUserInfo().then(res => {
      let that = this
      if (res.code == 200) {
        this.setData({
          isLogin: true,
          // root: res.data.root
        })
        if (res.data.wxUserInfo) {
          app.globalData.openid = res.data.wxUserInfo.openId
          app.globalData.isAccredit = true
          this.setData({
            userInfo: res.data.wxUserInfo,
          })
        } else {
          // that.logo.showDialog()
        }
        if (res.data.user && res.data.user.dept) {
          app.globalData.roleName = res.data.user.dept.deptName
        }
        if(res.data.room.length !== 0){
          app.globalData.room = true
        }
        app.globalData.ifShowGas = res.data.ifShowGas
        app.globalData.root = res.data.root
        app.globalData.withJson = res.data.withJson
        app.globalData.roomList = res.data.room 
        // app.globalData.room = res.data.room
        // user 为空，用户未实名认证，不调以下接口
        if(!res.data.user) return;

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
          } else {
            this.setData({
              info:{},
              show: false
            })
            app.globalData.isCertification = false
            app.globalData.phone = null
            app.globalData.user_name = null
          }
        })      
      } else {

      }
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
  handleLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
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
  handleTo(e) {
    let item = e.currentTarget.dataset.value
    if (app.globalData.isCertification) {
      if (app.globalData.room) {
        wx.navigateTo({
          url: item.page,
        })
      } else {
        app.bindHouseShowModal()
      }

    } else {
      app.bindCardhowModal()
    }
  },
  handleWallet() {
    if (app.globalData.isCertification) {
      if (app.globalData.room) {
        wx.navigateTo({
          url: './wallet/wallet',
        })
      } else {
        app.bindHouseShowModal()
      }

    } else {
      app.bindCardhowModal()
    }

  },
  handleProperty() {
    if (app.globalData.isCertification) {
      wx.navigateTo({
        url: '/pages/property/index/index?type=2',
      })
    } else {
      app.bindCardhowModal()
    }
  },
  handlePhone() {
    if (app.globalData.isCertification) {
      if (app.globalData.room) {
        wx.navigateTo({
          url: './amendphone/index',
        })
      } else {
        wx.navigateTo({
          url: '/pages/house/house',
        })
      }

    } else {
      app.bindCardhowModal()
    }
  },
  handleHouse() {
    if (app.globalData.isCertification) {
      if (app.globalData.room) {
        wx.navigateTo({
          url: './houseinfo/houseinfo',
        })
      } else {
        wx.navigateTo({
          url: './houseinfo/houseinfo',
        })
      }

    } else {
      app.bindCardhowModal()
    }
  },
  handlefamily() {
    if (app.globalData.isCertification) {
      if (app.globalData.room) {
        wx.navigateTo({
          url: '/pages/house/familylist/familylist',
        })
      } else {
        app.bindHouseShowModal()
      }

    } else {
      app.bindCardhowModal()
    }

  },
  handleRepair() {
    if (app.globalData.isCertification) {
      if (app.globalData.room) {
        wx.navigateTo({
          url: '/pages/repair/index',
        })
      } else {
        app.bindHouseShowModal()
      }

    } else {
      app.bindCardhowModal()
    }
  },
  //交费记录
  handleRecords(){
    if (app.globalData.isCertification) {
      if (app.globalData.room) {
        wx.navigateTo({
          url: '/pages/records/records',
        })
      } else {
        app.bindHouseShowModal()
      }

    } else {
      app.bindCardhowModal()
    }
  },
  handleComplain() {
    if (app.globalData.isCertification) {
      if (app.globalData.room) {
        wx.navigateTo({
          url: '/pages/complain/complain',
        })
      } else {
        app.bindHouseShowModal()
      }

    } else {
      app.bindCardhowModal()
    }
  },
  handleNotice() {
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
  handleRelease() {
    wx.navigateTo({
      url: './release/index',
    })
    // if (app.globalData.isCertification) {
    //   if (app.globalData.room) {
    //     wx.navigateTo({
    //       url: './release/index',
    //     })
    //   } else {
    //     app.bindHouseShowModal()
    //   }

    // } else {
    //   app.bindCardhowModal()
    // }
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
  // 常见问题
  handleFAQ() {
    wx.navigateTo({
      url: './FAQ/index',
    })
  },
  // 更换卡号
  handleCard() {
    if (this.data.info.bind_card_type == '0') {
      wx.navigateTo({
        url: './bankcard/index',
      })
    } else {
      if (this.data.info.balance > 0) {
        this.showModal('钱包当前余额' + this.data.info.balance + '元,请先提现再更换银行卡')
        return
      }
      wx.navigateTo({
        url: './bankcard/index',
      })
    }

  },
  // 查看卡号
  handleCardNo() {
    this.showmodal.show()
  },
  cancel(e) {
    this.setData({
      ['form.user_phone_no']: '',
      ['form.sms_code']: ''
    })
  },
  confirm(e) {
    let form = e.detail
    if (!form.sms_code) {
      this.showModal('请输入验证码')
      return;
    }

    showCardNo(form.sms_code).then(res => {
      if (res.code == 200) {
        if (this.data.info.bind_card_type == '0') {
          this.setData({
            ['info.bind_card_tail']: res.data.cardNo
          })
        } else {
          this.setData({
            ['info.medium_id_tail']: res.data.cardNo,
            ['info.bind_card_tail']: res.data.bindCardNo
          })
        }
        this.showmodal.hide()
      } else {
        this.showModal(res.msg || '短信验证失败！')
      }
    })
  },
  // 解绑
  handleUnbind(){
    this.unbindmodal.show()
  },
  unbindCancel(){},
  // 解绑短信验证
  unbindConfirm(e){
    let form = e.detail
    if (!form.sms_code) {
      app.showModalMsg('请输入验证码')
      return;
    }
    checkCloseBindCard(form).then(res => {
      if (res.code == 200) {
        this.unbind.hide();
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        this.showModal(res.msg || '短信验证失败！')
      }
    })
  }, 
  unbindmodalCancel(){}, 
  unbindmodalConfirm(){
    this.unbind.show()
  },


  showModal(msg) {
    wx.showModal({
      title: '',
      content: msg,
      showCancel: false,
      success(res) {
        if (res.confirm) {

        }
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
  onShow: function (options) {
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
  name(str) {
    if (null != str && str != undefined) {
      if (str.length <= 3) {
        return "*" + str.substring(1, str.length);
      } else if (str.length > 3 && str.length <= 6) {
        return "**" + str.substring(2, str.length);
      } else if (str.length > 6) {
        return str.substring(0, 2) + "****" + str.substring(6, str.length)
      }
    } else {
      return "";
    }
  },
  IDcard(str) {
    return str.replace(/\s/g, '').replace(/(\d{4})\d+(\d{4})$/, "$1 **** **** **** $2")
  },
  cardNo(str) {
    return str.replace(/\s/g, '').replace(/(\d{4})\d+(\d{4})$/, "$1 **** **** **** $2")
  },
  noMobileNo(str) {
    return str.replace(/\s/g, '').replace(/(\d{3})\d+(\d{2})$/, "$1 **** **$2")
  },
})