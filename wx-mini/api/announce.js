import BaseEntity from './base'
import wxMiniUser from 'wx_mini_user'

class Announce extends BaseEntity {
  constructor(fields) {
    super('', fields)
    const request = getApp().request
  }
}

const announce = new Announce()

export default announce