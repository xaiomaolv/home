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
    //授权
    handelPush(e) {
      wx.requestSubscribeMessage({
        tmplIds: ['r4RR_lfnDIvV2zyipEYpbnGydD6iK3thA8-52kjUcfA'],
        success (res) {
          console.log(res,'===============')
          //发送请求到后端，后端接收到请求后调用订阅消息接口进行推送
          // wx.request({
          //   url: '你后端编写的推送api地址',
          //   method:"GET",
          //   data:{},
          //   success (res) {
          //     console.log(res.data)
          //   }
          // })
         }
      })
      // let pages = getCurrentPages();
      // let beforePage = pages[pages.length - 2];
      // wx.navigateBack({
      //   success: function () {
      //     beforePage.onLoad({})
      //   }
      // })
     

    }
  }
})
