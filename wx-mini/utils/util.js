const app = getApp()
/**
 * 登录
 */
const login = function () {
  return new Promise((resolve, reject) =>
    wx.login({
      success: resolve,
      fail: reject
    })
  )
}

/**
 * 获取用户信息
 */
const getUserInfo = function () {
  return new Promise((resolve, reject) =>
    wx.getUserInfo({
      success: resolve,
      fail: reject
    })
  )
}

/**
 * 图片转经过压缩的base64
 * 最大的宽高为1024
 * 调换用页面必须还有canvas 且id为canvas
 */
export function img2Base64(src) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: src,
      success(imgInfo) {
        // 计算高度计算方式，此高度只试用于身份证，其他场景需调节
        let {
          width,
          height
        } = imgInfo
        let scale = 1
        if (width > height) {
          scale = 1024 / width
          height = height * scale
          width = 1024
        } else {
          scale = 1024 / height
          width = width * scale
          height = 1024
        }

        // 获取画布
        const canvas = wx.createCanvasContext('canvas')
        canvas.drawImage(src, 0, 0, width, height)
        canvas.draw(false, () => {
          // 保存图片
          wx.canvasToTempFilePath({
            canvasId: 'canvas',
            width: width,
            height: height,
            destWidth: width,
            destHeight: height,
            fileType: 'jpg',
            quality: 0.5,
            success(file) {
              wx.getFileSystemManager().readFile({
                filePath: file.tempFilePath,
                encoding: 'base64',
                success: res => resolve(res.data),
                fail: reject
              })
            },
            complete: res => {
              getApp().log('canvasToTempFilePath complete', res)
            }
          })
        })
      }
    })
  })
}

// 保存文件
const saveFile = (fileName, data, encoding) => {
  const fm = wx.getFileSystemManager()
  return new Promise((resolve, reject) => {
    fm.writeFile({
      filePath: wx.env.USER_DATA_PATH + '/' + fileName,
      data,
      encoding,
      success: res => {
        res.filePath = wx.env.USER_DATA_PATH + '/' + fileName
        resolve(res)
      },
      fail: reject
    })
  })

}

const log = function (msg, ...objs) {
  if (getApp().loggerEnable) {
    console.info(msg, ...objs)
  }
}

const info = function (msg, ...objs) {
  if (getApp().loggerEnable) {
    console.info(msg, ...objs)
  }
}
const warn = function (msg, ...objs) {
  if (getApp().loggerEnable) {
    console.info(msg, ...objs)
  }
}

const error = function (msg, ...objs) {
  if (getApp().loggerEnable) {
    console.info(msg, ...objs)
  }
}
const goBack = function () {
  let pages = getCurrentPages();
  let beforePage = pages[pages.length - 2];
  wx.navigateBack({
    success: function () {
      // beforePage.onShow({})
    }
  })
}

const bindHouseShowModal = function () {
  wx.showModal({
    content: '您还未绑定房屋信息',
    showCancel: true,
    title: '',
    confirmText: '去绑定',
    confirmColor: '#fd7380',
    cancelColor: '#484848',
    success: (res) => {
      if (res.confirm) {
        wx.navigateTo({
          url: '/pages/house/house',
        })
      } else if (res.cancel) {

      }
    },
    fail: (res) => { },
    complete: (res) => { },
  })
}

const bindCardhowModal = function () {
  wx.showToast({
    title: '未实名认证',
    icon:'success',
    image: '/img/warning.png'
  })
  setTimeout(function () {
    wx.navigateTo({
      url: '/pages/bind/bind',
    })
  }, 1000)
}

const showModalMsg = function (msg) {
  wx.showModal({
    content: msg,
    showCancel: false,
    title: '',
    success: (res) => {
      if (res.confirm) {

      }
    },
    fail: (res) => { },
    complete: (res) => { },
  })
}
const filters = {
  toFix: function (value) {
    return value.toFixed(2) // 此处2为保留两位小数，保留几位小数，这里写几
  },
  name: function (str) {
    if (null != str && str != undefined) {
      if (str.length <= 3) {
        return str.substring(0, 1) + "**";
      } else if (str.length > 3 && str.length <= 6) {
        return str.substring(0, 2) + "**";
      } else if (str.length > 6) {
        return str.substring(0, 2) + "****" + str.substring(6, str.length)
      }
    } else {
      return "";
    }
  },
  idCard: function (str) {
    if (str) {
      return str.replace(/\s/g, '').replace(/(\d{4})\d+(\d{4})$/, "$1 **** **** **** $2")
    }
  },
  cardNo: function (str) {
    if (str) {
      return str.replace(/\s/g, '').replace(/(\d{4})\d+(\d{4})$/, "$1 **** **** **** $2")
    }
  },
  phone: function (str) {
    if (str) {
      return str.replace(/\s/g, '').replace(/(\d{3})\d+(\d{2})$/, "$1 **** **$2")
    }
  }
}


const selectOptionLabel = function(options, value) {
  let label = value 
  options.some((option) => {
    if (option.value == value) {
      label = option.label
      return true
    }
    return false
  })
  return label
}
//监听属性值函数
const watch = function(obj, val, method){
  Object.defineProperty(obj,val,{
    configurable:true,
    enumerable:true,
    set:function(nval){
        val = nval;
        method(nval)
    },
    get:function(){
      return val
    }
  })
}
export default { login, getUserInfo, saveFile, log, info, warn, error, filters, goBack, bindHouseShowModal, showModalMsg ,bindCardhowModal,selectOptionLabel,watch}