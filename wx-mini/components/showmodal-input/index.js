// components/showmodal-input/index.js
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
    title:{
      type:String,
      value: ''
    },
    width:{
      type:String,
      value:'80%'
    }
   
  },
  /**
   * 组件的方法列表
   */
  methods: {
    show: function() {
      this.setData({
        showModal:true
      })
    },
    hide: function() {
      this.setData({
        showModal:false
      })
    },
    cancel(){
      this.hide()
      this.triggerEvent('cancel')  
    },
    cancel(){
      this.hide()
    },
    // 确定  
    confirm: function () {
      this.triggerEvent('confirm')  
    },
    sendCode(){
      this.triggerEvent('sendCode')
    }
  }
})
