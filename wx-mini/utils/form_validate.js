
class FormValidate {
  constructor(rules) {
    this.rules = rules
  }

  validateForm(form) {
    this.form = form
    for (let key in this.rules) {
      let result = this.validate(key)
      getApp().log('validateForm', key, result)
      if (!result) {
        return false
      }
    }
    return true
  }

  validate(key) {
    const param = this.form[key]
    const paramRules = this.rules[key]
    for (let index in paramRules) {
      let rule = paramRules[index]
      getApp().log('validate rule', rule)
      if (rule.required != undefined && rule.required && !param) {
        getApp().log('validate required', param)
        this.show(key, rule.msg)
        return false
      }
      if (rule.min != undefined && param.length < rule.min) {
        getApp().log('validate min', param)
        const msg = rule.msg.replace("{min}", rule.min)
        this.show(key, msg)
        return false
      }
      if (rule.max != undefined && param.length > rule.max) {
        getApp().log('validate max', param)
        const msg = rule.msg.replace("{max}", rule.max)
        this.show(key, msg)
        return false
      }
      if (rule.phone != undefined && rule.phone && param) {
        getApp().log('validate phone', param)
        if (!(/^1[3456789]\d{9}$/.test(param))) {
          this.show(key, rule.msg)
          return false
        }
      }
      if (rule.email != undefined && rule.email && param) {
        getApp().log('validate email', !param)
        const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        if (!filter.test(param)) {
          this.show(key, rule.msg)
          return false
        }
      }

      if (rule.idcard != undefined && rule.idcard && param) {
        getApp().log('validate stuIdcard', !param)
        const filter = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (!filter.test(param)) {
          this.show(key, rule.msg)
          return false
        }
      }

      if (rule.bankcard != undefined && rule.bankcard && param) {
        getApp().log('validate bankcard', !param)
        const filter =  /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/
        if (!filter.test(param)) {
          this.show(key, rule.msg)
          return false
        }
      }
      if(rule.picker != undefined && rule.picker && param){
        getApp().log('validate usedName', !param)
        this.show(key, rule.msg)
        return false
      }
      if (rule.number != undefined && rule.number && param) {
        getApp().log('validate number', !param)
        const filter = /\D/g
        if (!filter.test(param)) {
          this.show(key, rule.msg)
          return false
        }
      }
      if (rule.platecard != undefined && rule.platecard && param) {
        getApp().log('validate platecard', !param)
        const filter = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
        if (!filter.test(param)) {
          this.show(key, rule.msg)
          return false
        }
      }
    }
    return true
  }

  show(key, msg) {
    // getApp().log('show', this.form[key], key, msg)
    const T = this.getCurrentPage().data.T
    wx.showModal({
      showCancel: false,
      content: msg.replace("{}", T[key])
    })
  }

  getCurrentPage = () => {
    const pages = getCurrentPages()
    return pages[pages.length - 1]
  }
}

export default FormValidate