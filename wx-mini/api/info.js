import BaseEntity from './base'

class Info extends BaseEntity {
  constructor(fields) {
    super('这里写url', fields)
    const request = getApp().request

    this.test = parmas => {
      getApp().log("接收参数", parmas)
      return new Promise((resolve, rejects) => {
        resolve("返回的测试结果！")
      })
    }

  }

}

const info = new Info()

export default info