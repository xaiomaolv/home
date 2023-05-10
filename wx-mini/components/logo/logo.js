// components/modal/logo/logo.js
import { saveWxUserInfo } from '../../api/userinfo'
const app = getApp();
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    fanished: {
      type: Boolean,
      value: false
    },
    title:{
      type: String,
      value: ''
    }

  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
      // this.info = this.selectComponent(".info");
      // this.info.showDialog()

    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    ishow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 隐藏授权弹窗
    hideDialog() {
      this.setData({
        ishow: false
      })
    },
    //显示授权弹窗
    showDialog() {
      this.setData({
        ishow: true
      })
    },
    getUserProfile() {
      let that = this;
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '用于完善用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写 获取你的公开信息(昵称、头像、手机等),用于完善用户信息
        success: (res) => {
          saveWxUserInfo(res.userInfo).then(res => {
            if (res.code == 200) {  
              that.setData({
                ishow: false
              })          
             that.triggerEvent('accredit')
            } else {
              that.showModal(res.msg)
              that.setData({
                ishow: true
              })
            }
          })
        },
        fail: (error) =>{
          wx.showToast({
            title: '授权失败！',
            icon: 'none'
          })
        }
      })
    },
    //授权
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
  },

})
