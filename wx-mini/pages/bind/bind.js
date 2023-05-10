
// pages/bind/bind.js
import { checkcard, ScodeVerify, bindAccount, OCR , getowner,checkCloseBindCard,checkBinduser,restoreBindCard} from '../../api/bind'
import { img2Base64 } from '../../utils/util'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    isIcbc: true,
    bindShow: false,
    isIcbcCard: '',
    isXYCard: false,
    second: 60,
    btnValue: app.T.bind.send_code,
    btnDisabled: false,
    // 1-公务员;2-事业单位员工;3-公司员工;4-军人警察;5-工人;6-农民;7-管理人员;8-技术人员;9-私营业主; 10-文体明星;11-自由职业者;12-学生; 13-无职业;
    occupation: ['公务员', '事业单位员工', '公司员工', '军人警察', '工人', '农民', '管理人员', '技术人员', '私营业主', '文体明星', '自由职业者', '学生', '无职业'],
    occupationIndex: 0,
    imgList0: [],
    img0Base64: null,
    imgList1: [],
    img1Base64: null,
    imgList2: [],
    img3Base64: null,
    card_no: '',
    form: {
      occupation: ''
    },
    isDisabled: false,
    agreement: false,
    agreeTitle: '',
    agreeId: '',
    agreementList: [
      { id: '0', title: '《中国工商银行电子银行个人客户服务协议》' },
      { id: '1', title: '《个人银行电子账户服务协议》' },
      { id: '2', title: '《中国工商银行“彩云居家”微信小程序账户绑定协议》' },
      { id: '3', title: '《中国工商银行电子银行个人客户服务协议》' },
    ],
    rules: {
      user_name: [
        { required: true, msg: '请输入姓名' }
      ], //姓名
      user_cert_no: [
        { required: true, msg: '请输入证件号码' },
        { idcard: true, msg: '请输入正确的证件号码' }
      ], //身份证
      occupation: [
        { required: false, msg: '请选择职业' },
      ], //职业
      card_no: [
        { required: true, msg: '请输入银行卡号' },
        { bankcard: true, msg: '请输入正确的银行卡号' }
      ], //一类卡号
      user_phone_no: [
        { required: true, msg: '请输入银行预留手机号' },
        { phone: true, msg: '请输入正确的手机号' }
      ], //手机号
      // communityId:[ { required: true, msg: '请选择小区' }],
      sms_code: [
        { required: false, msg: '请输入验证码' }
      ],
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.logo = this.selectComponent(".logo");
    this.changebind = this.selectComponent(".changebind");
    this.changebindmodal = this.selectComponent(".changebindmodal");
    checkBinduser().then(res => {
      if(res.code == 200){
        if(res.data == 1){    
          this.changebindmodal.show();
        }
      }else {
        this.showModal(res.msg || '没有获取到用户信息')
      }
    })
    if (!app.globalData.isAccredit) {
      this.logo.showDialog();//调用子组件的方法
    }
    getApp().watch(this.data.form,'user_phone_no',this.seachPhone);
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
  inputBindChange: function (e) {
    let dataset = e.currentTarget.dataset;
    if (dataset.value) {
      this.data[dataset.obj] = dataset.value
    } else {
      let value = e.detail.value.replace(/(\d{4})(?=\d)/g, "$1 ");
      this.data[dataset.obj] = value
    }
    this.setData(this.data)
  },

  // ------------------------------------工行卡绑定----------------------------------------
  // 银行卡查询
  handleSeach() {
    if (!this.data.card_no) {
      this.showModal('请输入银行卡号')
      return
    }
    if (!/^[0-9]{15,}$/.test(this.data.card_no)) {
      this.showModal('请输入正确的银行卡号！')
      return
    }
    this.cardcheck(this.data.card_no)
  },
  /* 判断卡号是否是工行卡 */
  cardcheck(card_no) {
    checkcard(card_no).then(res => {
      if (res.code == 200) {
        this.setData({
          ['form.card_no']: this.data.card_no,
          ['form.is_icbc_card']: res.data.is_icbc_card,
          ['form.card_type']: res.data.card_type
        })
        var that = this;
         wx.request({
          url: 'https://ccdcapi.alipay.com/validateAndCacheCardInfo.json?_input_charset=utf-8&cardNo='+ this.data.card_no +'&cardBinCheck=true',
          method:"GET",
          data:{},
          success (res) {
            if (res.data.cardType == 'CC') {
              that.setData({
                isShow: false
              })
              app.showModalMsg('暂不支持信用卡！')
              return;
            }else{
              that.setData({
                isShow: true
              })
            }  
          }
        })
        
        if (res.data.card_type == '2') {
          this.setData({
            isXYCard: true,
          })
        }

        if (res.data.is_icbc_card == '0') {
          this.setData({
            ['form.user_phone_no']: '',
            ['form.sms_code ']: '',
            ['form.occupation']: '',
            isIcbcCard: true,
            isIcbc: true,
            occupationIndex: '',
          })

        } else {
          this.setData({
            ['form.user_phone_no']: '',
            ['form.sms_code ']: '',
            ['form.occupation']: '',
            isIcbcCard: false,
            isIcbc: false,
            occupationIndex: '',
          })
        }
      } else {
        app.showModalMsg(res.msg)
      }
    })
  },
  // 通过手机号查询小区
  seachPhone(phone) {
    if (!/^1[3456789]\d{9}$/.test(phone)) {
      // app.showModalMsg('请输入正确的银行卡号！')
      return
    }
    let params ={
      user_phone_no: phone
    }
    getowner(params).then(res => {
      if(res.code == 200){
        if(!res.data.community){
          this.setData({ bindShow:true })  
          return  
        }
        this.setData({
          ['form.communityId']: res.data.community.id,
          ['form.communityName']: res.data.community.communityName,
          bindShow:true
        })   
       
      }
    })
  },
  
  // 发送短信
  sendCode() {
    // if (!this.data.form.validity_period && !this.data.form.sign_date) {
    //   this.showModal('请上传身份证信息')
    //   return
    // }
    if (!this.validate()) {
      return
    }
    if (!this.data.isIcbc && !this.data.form.occupation) {
      this.showModal('请选择职业')
      return
    }
    if (this.data.isXYCard && !this.data.form.ccCVV2) {
      this.showModal('请输入信用卡CVV2')
      return
    }
    if (this.data.isXYCard && !this.data.form.ccExpiredDate) {
      this.showModal('请输入信用卡有效期')
      return
    }



    if (this.data.isIcbc) {
      let params = {
        is_icbc_card: this.data.form.is_icbc_card,
        card_type: this.data.form.card_type,
        card_no: this.data.form.card_no,
        user_cert_no: this.data.form.user_cert_no,
        user_name: this.data.form.user_name,
        user_phone_no: this.data.form.user_phone_no,
        validity_period: this.data.form.validity_period,
        sign_date: this.data.form.sign_date,
        ccCVV2: this.data.form.ccCVV2,
        ccExpiredDate: this.data.form.ccExpiredDate,
        communityId: this.data.form.communityId
      }
      this.cardbind(params)
    } else {
      let params = {
        is_icbc_card: this.data.form.is_icbc_card,
        card_type: this.data.form.card_type,
        card_no: this.data.form.card_no,
        user_cert_no: this.data.form.user_cert_no,
        user_name: this.data.form.user_name,
        user_phone_no: this.data.form.user_phone_no,
        gender: this.data.form.gender,
        occupation: this.data.form.occupation,
        forever_flag: this.data.form.forever_flag,
        validity_period: this.data.form.validity_period,
        sign_date: this.data.form.sign_date,
        birthday: this.data.form.birthday,
        issuing_authority: this.data.form.issuing_authority,
        address: this.data.form.address,
        id_img_front: this.data.form.id_img_front,
        id_img_back: this.data.form.id_img_back,
        seller_code: this.data.form.seller_code,
        account_org_no: this.data.form.account_org_no,
        communityId: this.data.form.communityId
      }
      this.cardbind(params)
    }
  },
  
  cardbind(params) {
    bindAccount(params).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '验证码发送成功',
          icon: 'success'
        })
        this.setData({
          ['form.sms_send_no']: res.data.sms_send_no,
          ['form.icbc_bind_no']: res.data.icbc_bind_no,
        })
        this.timer()
      } else {
        this.showModal(res.msg)
      }
    })
  },
  handleSubmit() {
    if (!this.validate()) {
      return
    }
    if(!this.data.form.communityId){
      app.showModalMsg('请选择小区')
      return
    }
    if (!this.data.form.sms_code) {
      this.showModal('请输入验证码')
      return
    }
    if (!this.data.agreement) {
      this.showModal('请先阅读协议，并同意')
      return
    }

    let params = {
      icbc_bind_no: this.data.form.icbc_bind_no,
      sms_code: this.data.form.sms_code,
      sms_send_no: this.data.form.sms_send_no
    }
    ScodeVerify(params).then(res => {
      if (res.code == 200) {
        if (this.data.isIcbc) {
          wx.showToast({
            title: '绑卡成功',
          })
        } else {
          wx.showToast({
            title: '账户开通成功',
          })
        }

        setTimeout(function () {
          app.goBack()
        }, 1000)
      } else {
        app.showModalMsg(res.msg) 
      }
    })
  },

  // ------------------------------------工行卡绑定----------------------------------------

  // ------------------------------------开通钱包----------------------------------------
  PickerChange(e) {
    let value = e.detail.value
    this.setData({
      occupationIndex: value,
      ['form.occupation']: Number(value) + 1
    })
  },
  ChooseImage(e) {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        if (e.currentTarget.dataset.type == 0) {
          this.setData({
            imgList0: res.tempFilePaths
          })

          img2Base64(res.tempFilePaths[0]).then(base64 => {
            this.setData({
              ['form.id_img_front']: base64,
              img0Base64: base64
            })
            this.ocr('101', 1, base64)
          })
        }
        if (e.currentTarget.dataset.type == 1) {
          this.setData({
            imgList1: res.tempFilePaths
          })
          img2Base64(res.tempFilePaths[0]).then(base64 => {
            // this.data.img1Base64 = base64
            this.setData({
              ['form.id_img_back']: base64,
              img1Base64: base64
            })
            this.ocr('101', 2, base64)
          })
        }
        if (e.currentTarget.dataset.type == 2) {
          this.setData({
            imgList2: res.tempFilePaths
          })
          img2Base64(res.tempFilePaths[0]).then(base64 => {
            // this.data.img3Base64 = base64
            this.setData({
              img3Base64: base64
            })
            this.ocr('17', 3, base64)
          })
        }
      }
    });
  },
  ViewImage(e) {
    if (e.currentTarget.dataset.type == 0) {
      console.log(e, 999)
      wx.previewImage({
        urls: this.data.imgList0,
        current: e.currentTarget.dataset.url
      });
    }
    if (e.currentTarget.dataset.type == 1) {
      wx.previewImage({
        urls: this.data.imgList1,
        current: e.currentTarget.dataset.url
      });
    }
    if (e.currentTarget.dataset.type == 2) {
      wx.previewImage({
        urls: this.data.imgList2,
        current: e.currentTarget.dataset.url
      });
    }

  },
  DelImg(e) {
    if (e.currentTarget.dataset.type == 0) {
      this.setData({
        imgList0: [],
        img0Base64: null
      })
    }
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        imgList1: [],
        img1Base64: null
      })
    }
    if (e.currentTarget.dataset.type == 2) {
      this.setData({
        imgList2: [],
        img3Base64: null
      })
    }
  },
  ocr(type, value, base64) {
    // 识别身份证
    var that = this;
    let params = {
      type: type,
      base64: base64
    }
    OCR(params).then(res => {
      if (res.code == 200) {
        let data = res.data.recodata
        if (type == '101') {
          if (value == 1) {
            // this.IDCard = res.recodata		
            let gender = ''
            if (data[2].content == '男') {
              gender = 1
            } else {
              gender = 2
            }
            this.setData({
              ['form.gender']: gender,
              ['form.address']: data[5].content,
              ['form.birthday']: data[4].content,
              ['form.user_cert_no']: data[6].content,
              ['form.user_name']: data[1].content
            })
          }
          if (value == 2) {
            let forever_flag, validity_period;
            if (data[4].content == '长期' || data[4].content == '长期有效') {
              forever_flag = 1
              validity_period = "9999-12-30"
            } else {
              forever_flag = 0
              validity_period = data[4].content
            }
            this.setData({
              ['form.forever_flag']: forever_flag,
              ['form.validity_period']: validity_period,
              ['form.sign_date']: data[3].content,
              ['form.issuing_authority']: data[1].content,
              validity_period_date: data[3].content + '至' + data[4].content
            })
          }
        }
        if (type == '17') {
          if (!res.data.extobj) {
            wx.showModal({
              title: '',
              content: '无法判断是否是工行卡',
              showCancel: false,
              success(res) {
                if (res.confirm) {

                }
              }
            })
            return
          }
          this.setData({
            // isIcbc: res.data.extobj.is_icbc_card == 1 ? false : true,
            // ['form.is_icbc_card']: res.data.extobj.is_icbc_card,
            // ['form.card_type']: res.data.extobj.card_type,
            card_no: data[0].content
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          content: 'OCR识别失败，请选择 "确定"【再次识别】或 "取消"【重新上传】',
          success(e) {
            if (e.confirm) {
              if (value == 1) {
                that.ocr('101', 1, that.data.img0Base64)
              }
              if (value == 2) {
                that.ocr('101', 2, that.data.img1Base64)
              }
              if (value == 3) {
                that.ocr('17', 3, that.data.img3Base64)
              }

            }
            if (e.cancel) {
              if (value == 1) {
                that.setData({
                  imgList0: [],
                  img0Base64: null
                })
              }
              if (value == 2) {
                that.setData({
                  imgList1: [],
                  img1Base64: null
                })
              }
              if (value == 3) {
                that.setData({
                  imgList2: [],
                  img3Base64: null
                })
              }
            }
          }
        })
      }
    }).catch(err => {

    })

  },
  // 协议查看
  handleAgreement(e) {
    let that = this
    let item = e.currentTarget.dataset.value
    this.setData({
      agreeTitle: item.title,
      agreeId: item.id
    })
    that.agreement.showlog()
  },
  handlecummutiyChange() {
    wx.navigateTo({
      url: '/pages/house/house?type=1',
    })
  },
  // 更换解绑交费卡
  // 继续更换
  changebindmodalCancel(){

  }, 
  changebindmodalConfirm(e){
    this.changebind.show()
  },
  // 取消信息验证
  changebindCancel(){

  },
  // 恢复信息验证
  changebindConfirm(e){
    let form = e.detail
    if (!form.sms_code) {
      app.showModalMsg('请输入验证码')
      return;
    }
    restoreBindCard(form).then(res => {
      if (res.code == 200) {
        this.changebind.hide();
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        this.showModal(res.msg || '短信验证失败！')
      }
    })

  },
  
  // ------------------------------------开通钱包----------------------------------------
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: second + 'S',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '重新发送',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
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
  switchAgreement() {
    this.setData({ agreement: !this.data.agreement })
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
    this.agreement = this.selectComponent(".agreement");
    const pages = getCurrentPages()
    const currPage = pages[pages.length - 1] // 当前页
    if (currPage.data.communityName || currPage.data.communityId) {

      //如果是从上个页面传的值则赋值remarks  1
      this.setData({
        ['form.communityName']: currPage.data.communityName,
        ['form.communityId']: currPage.data.communityId
      })
    }
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