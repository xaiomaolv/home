// pages/house/house.js
import { communityposition, communityFind ,communityFindCity} from '../../api/property'
var QQMapWX  = require('../../libs/qqmap-wx-jssdk.min.js');
const app = getApp()
var wxMarkerData = [];
let keys = app.globalData.mapKey

let _page, _this;
Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    placeData: {},
    name: '',
    show: false,
    checkedId: -1,
    customItem: '',
    list: [],
    region: [],
    district: '',
    communityName: '',
    communityNum: '',
    selectItem: {},
    type:'',
  },
  inputChange: function (e) {
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    if (dataset.value) {
      this.data[dataset.obj] = dataset.value
    } else {
      this.data[dataset.obj] = value
    }
    // 用set才会触发页面刷新
    this.setData(this.data)
  },
  inputFocus(e) {
    this.setData({
      show: true
    })
  },
  // 取消搜索
  handelCancel() {
    this.setData({
      show: false,
      communityName: ''
    })
    this.getList()
  },
  // 搜索
  handelSeach() {
    this.setData({
      checkedId: -1,
      list: []
    })
    this.getList()
  },
  checkeChange(e) {
    let that = this
    let item = e.currentTarget.dataset.value
    if (item.id == this.data.checkedId) {
      this.setData({
        checkedId: -1
      })
    } else {
      this.setData({
        checkedId: item.id,
        selectItem: item
      })
      setTimeout(function () {
        if(that.data.type && that.data.type == 1){
          const pages = getCurrentPages()
          const prevPage = pages[pages.length-2] // 上一页// 调用上一个页面的setData 方法，将数据存储
          prevPage.setData({
            communityName: item.communityName,
            communityId:  item.id
          })
          wx.navigateBack({
           delta: 1
          })
        }else{
          wx.navigateTo({
            url: './map/map?id=' + item.id + '&name=' + item.communityName,
          })
        }      
      }, 1000)
    }
  },
  handleSelectCencel() {
    this.setData({
      checkedId: -1
    })
    this.getList()
  },
  handleSelectConfirm() {
    console.log(this.data.selectItem, 7777)
  },
  getList() {
    let params = {
      "areaName": this.data.district,
      "communityName": this.data.communityName, // 小区名称模糊搜索
      "communityNum": this.data.communityNum, // 小区编号精确搜索
      "pageNum": 0,
      "pageSize": 9999

    }
    if(this.data.type && this.data.type == 1){   
      communityFindCity(params).then(res => {
        if (res.code == 200) {
          this.setData({
            list: res.rows,
            checkedId: -1,
          })
        }
      })
    }else{
      communityFind(params).then(res => {
        if (res.code == 200) {
          this.setData({
            list: res.rows,
            checkedId: -1,
          })
        }
      })
    }
  },
  onLoad: function (options) {
    if(options.type){
      this.setData({type: options.type})
    }
  },
  onShow:function(){
    this.init()
  },
  init(){
    _this = this;
    var qqmapsdk = new QQMapWX({
        key: app.globalData.mapKey // 必填
    });  
   
    // 获取当前经纬度
    wx.getLocation({
      success: function (res) {

        qqmapsdk.reverseGeocoder({
          //位置坐标，默认获取当前位置，非必须参数
         
          /**
           *
           //String格式
            location: '39.984060,116.307520',
          */
          location:  res.latitude + ',' + res.longitude, //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
          //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
          success: function(res) {//成功后的回调
            console.log(res);
            var data = res.result.address_component;
            // 省
            let province = data.province;
            // 市
            let city = data.city;
            // 区
            let district = data.district;

            _this.setData({
              district: data.district,
              region: [province, city, district]
            })
            _this.getList()
          
          },
          fail: function(error) {
            wx.showToast({
              title: '请检查位置服务是否开启',
            })
          },
          complete: function(res) {
            console.log(res);
          }
        })
      },
    })
  },
  // 根据经纬度逆解析地址
  getDistrict(latitude, longitude) {
    _page = this;
    wx.request({
      url: `http://api.map.baidu.com/reverse_geocoding/v3/?location=${latitude},${longitude}&ak=${app.globalData.mapKey}&output=json&coordtype=wgs84ll&`,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.result.addressComponent.district, res.data.result)
        // 省
        let province = res.data.result.addressComponent.province;
        // 市
        let city = res.data.result.addressComponent.city;
        // 区
        let district = res.data.result.addressComponent.district;

        _page.setData({
          district: res.data.result.addressComponent.district,
          region: [province, city, district]
        })
        _page.getList()
      }
    })
  },

  bindRegionChange(e) {
    let arr = e.detail.value
    this.setData({
      region: arr,
      district: arr[2],
    })
    this.getList()
  }
})