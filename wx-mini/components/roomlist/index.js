// components/agreement/index.js
import {
  withhold
} from '../../api/property'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    roomList: {
      value: [],
      type: Array
    },
    signImg: {
      value: '',
      type: String
    },   
    show: {
      type: Boolean,
      value: false
    },
    //modal的高度
    height: {
      type: String,
      value: '60%'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: '',
    checkAll: []
  },
  pageLifetimes: {

  },
  observers: {

  },
  lifetimes: {
    attached() {
        
    },
    ready() {
      
    },
    detached() {},
},
  /**
   * 组件的方法列表
   */
  methods: {
    clickMask() {
      // this.setData({show: false})
    },
    showlog: function () {
      this.setData({
        show: true
      })
    },
    hide: function () {
      this.setData({
        show: false,
      })
    },
    cancel() {
      this.hide()
      this.triggerEvent('roomcancel') 
    },

    confirm() {

      if (this.data.checkAll.length == 0) {
        app.showModalMsg('请选择小区')
        return
      }

      let obj = app.globalData.withJson
      this.data.checkAll.forEach(item => {
        Object.keys(obj).forEach(key => {
          if (item == key) {
            if (!obj[key].ifWith && obj[key].ifOne) {
             app.globalData.withJson[key].ifWith = true
             app.globalData.withJson[key].ifOne = false
            }
            
          }
        })
      })
      let params = {
        withJson:app.globalData.withJson,
        signImg: this.data.signImg
      }

      withhold(params).then(res => {
          if(res.code == 200){
            wx.showToast({
              title: '修改成功',
              icon: 'success'
            })
            this.hide()
            this.triggerEvent('roomconfirm', true)
          }else{
            app.showModalMsg(res.msg)
          }
      })
      
    },
    // 单选
    checkboxChange: function (e) {
      let checked = e.detail.value
      this.setData({
        checkAll: checked
      })
    },
  }
})