import FormValidate from './form_validate'

// 更改默认微信Page构造器
export const initPage = app => {
  const wxPage = Page
  Page = obj => {
    let wxOnLoad = obj.onLoad
    let wxOnHide = obj.onHide
    let wxOnUnload = obj.onUnload
    // // 页面加载
    obj.onLoad = (query) => {
      onPageLoad(app)
      if (wxOnLoad) {
        wxOnLoad.call(getCurrentPage(), query)
      }
    }
    // 隐藏页面
    obj.onHide = () => { 
      onPageLeave(app)
      if (wxOnHide) {
        wxOnHide.call(getCurrentPage())
      }
    }
    // 离开页面
    obj.onUnload = () => {
      onPageLeave(app)
      if (wxOnUnload) {
        wxOnUnload.call(obj)
      }
    }
    // 挂载常用方法
    if (obj.data && obj.data.form) {
      hookFormPages(obj)
    }
    wxPage(obj)
  }
}

// 页面加载完会执行此钩子函数
export const onPageLoad = (app) => {
  app.log('钩子函数', 'onPageLoad', '当前app', app)
  let pages = getCurrentPages()
  pages.forEach(page => {
    let route = page.route
    // 使用路由定位title翻译
    let routeItems = route.split('/')
    let pageT = null
    routeItems.slice(1, routeItems.length - 1).forEach(item => {
      pageT = (pageT || app.T)[item]
    })
    // 动态修改页面标题接口
    wx.setNavigationBarTitle({ title: pageT && pageT.title ? pageT.title : '未配置title' })
    // 设置当前页面数据翻译
    page.setData({ T: pageT })
    // 还原表单
    if (page.data && page.data.form) {
      page.revertForm()
    }
  })
}

// 离开页面时执行此钩子
const onPageLeave = (app) => {
  // 保存表单
  if (typeof getCurrentPage.saveForm == "function") {
    getCurrentPage().saveForm()
  }
}

/**
 * 挂载带有form常用方法
 * @param {Obj} obj 
 */
const hookFormPages = obj => {
  /**
   * Input,Button 深度双向绑定
   * input示例：<input data-obj="obj.key" value="{{obj.key}}" bindinput="inputChange"></input>
   * 输入时，data中obj.key的值跟随input值改变
   * button示例：<button data-obj="obj.key" data-value="value" bindtap="inputChange">xxx</button>
   * 点击button时，data中obj.key的值设置为value
   * @param {Event} e 
   */
  // getApp().log('hookPages', obj, 'inputChange') 
  obj.inputChange = e => {
    getApp().log(e)
    let dataset = e.currentTarget.dataset;
    let value = e.detail.value;
    if (dataset.value) {
      getCurrentPage().setData({ [dataset.obj]: dataset.value })
    } else {
      getCurrentPage().setData({ [dataset.obj]: value })
    }
  }

  /**
   * picker双向绑定
   * 示例：<picker bindchange="pickerChange" data-obj="obj.key" value="{{obj.key}}" range="{{objRange}}" range-key="{{name}}">
   * @param {Event} e 
   */
  const pickerChange = obj.pickerChange
  obj.pickerChange = e => {
    if (e.currentTarget.dataset.obj) {
      const key = e.currentTarget.dataset.obj
      const range = e.currentTarget.dataset.range
      const selectIndex = e.detail.value
      getApp().log('pickerChange', key, selectIndex)
      getCurrentPage().setData({
        [key + 'Index']: selectIndex,
        [key]: range[selectIndex].value
      })
    }
    if (pickerChange) {
      pickerChange.call(getCurrentPage(), e)
    }
  }

  /**
   * 选择图默认
   * 最长边1024
   * @param {*} e 
   */
  const imageChanged = obj.imageChanged

  obj.chooseImage = (e) => {
    const key = e.currentTarget.dataset.obj
    // const urlKey = e.currentTarget.dataset.url
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        getApp().img2Base64(res.tempFilePaths[0]).then(base64 => {
          getCurrentPage().setData({
            [key]: base64,
            [key + 'Url']: res.tempFilePaths
          })
          if (imageChanged) {
            imageChanged.call(getCurrentPage(), e)
          }
        })
      }
    })
  }

  /**
   * 预览图片
   * @param {*} e 
   */
  obj.viewImage = (e) => {
    getApp().log(e, '预览图片')
    const urls = e.currentTarget.dataset.url
    wx.previewImage({
      urls: urls,
    });
  }

  /**
   * 删除图片
   * @param {*} e 
   */
  obj.delImage = (e) => {
    const objs = e.currentTarget.dataset.obj.split(",")
    for (let index in objs) {
      let key = objs[index]
      getCurrentPage().setData({
        [key]: ''
      })
    }
    if (imageChanged) {
      imageChanged.call(getCurrentPage(), e)
    }
  }

  // 保存表单
  obj.saveForm = () => {
    if (obj.data && obj.data.form) {
      const curPage = getCurrentPage()
      wx.setStorageSync(curPage.route, curPage.data.form)
    }
  }

  // 还原表单
  obj.revertForm = () => {
    if (obj.data && obj.data.form) {
      const curPage = getCurrentPage()
      const form = wx.getStorageSync(curPage.route)
      if (form) {
        curPage.setData({ form: form })
      }
    }
  }

  // 清空表单
  obj.resetForm = () => {
    const curPage = getCurrentPage()
    curPage.setData({ form: {} })
    wx.setStorageSync(curPage.route, {})
  }

  // 获取表单
  obj.getForm = (route) => {
    return wx.getStorageSync(route)
  }
  data:{
    form:{}
  }

  // 表单验证
  if (obj.data.form && obj.data.rules) {
    const validate = obj.validate
    const formValidate = new FormValidate(obj.data.rules)
    obj.validate = () => {
      const form = getCurrentPage().data.form
      if (!validate) {
        return formValidate.validateForm(form)
      }
      return formValidate.validateForm(form) && validate.call(getCurrentPage())
    }
  }
}


/**
 * 返回当前页
 */
const getCurrentPage = () => {
  const pages = getCurrentPages()
  return pages[pages.length - 1]
}

