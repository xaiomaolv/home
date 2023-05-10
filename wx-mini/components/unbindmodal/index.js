
// components/showmodal-input/index.js
import { smsCode, showCardNo } from '../../api/bind'
let setTimer;
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    width: {
      type: String,
      value: '80%'
    },
    phone:{
      type: String,
      value:''
    }
  },
  attached(){

  },
  pageLifetimes: {
   
  },
  /**
   * 组件的方法列表
   */
  methods: {
   
    show: function () {
      this.setData({
        show: true
      })
    },
    hide: function () {
      this.setData({
        show: false
      })
    },
    cancel() {
      this.hide()
      this.triggerEvent('unbindmodalCancel')
    },

    confirm() {
      this.hide()
      this.triggerEvent('unbindmodalConfirm')
    }
  }
})
