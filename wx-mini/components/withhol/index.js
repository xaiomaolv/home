// components/agreement/index.js
import {withhold} from '../../api/property'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    roomList:{
      value:[],
      type:Array
    },
    title:{
      value: '',
      type:String
    },
    Id:{
      value: '',
      type:String
    },
    communityId:{
      value: '',
      type:String
    },
    show: {
      type: Boolean,
      value: false
    },
    //modal的高度
    height: {
      type: String,
      value: '80%'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:'',
    checkAll:[],  
    tabCur: 0,
    scrollLeft:0,
    tabList:['中国工商银行“物业管理费”委托代扣协议','电子账户自动充值客户服务协议'],
    tabLeftList:[0,210],
    tabLeft: 0,
  },
  pageLifetimes: {
    
},
observers: {
    
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
      this.triggerEvent('withholcancel')
    },

    confirm() {
      this.hide()         
      this.triggerEvent('withholconfirm', true)
    },
    tabSelect(e) {
      this.setData({
        tabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id-1)*60
      })
  
      this.setData({tabLeft: this.data.tabLeftList[this.data.tabCur]})
      
    },
  }
})
