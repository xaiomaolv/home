const request = getApp().request

// GET /property/bind/user/userRoom 查询用户的房产
export function userRoom() {
  return request({
    url: '/property/bind/user/userRoom',
    method: 'get'
  })
}

// POST /property/community/search 小区查询  
export function community() {
  return request({
    url: '/property/community/audited',
    method: 'post',
    data: { "page": 1, "pageSize": 9999 }
  })
}

// POST /community/floor/list 楼栋查询 
export function floor(id) {
  return request({
    url: '/community/floor/list',
    method: 'get',
    data: {
      "communityId": id,
      "pageNum": 1,
      "pageSize": 9999
    }
  })
}

// POST /community/unit/list 单元查询 
export function buildingUnit(id) {
  return request({
    url: '/community/unit/list',
    method: 'get',
    data: {
      "floorId": id,
      "pageNum": 1,
      "pageSize": 9999
    }
  })
}

// POST /community/room/list 房屋查询
export function buildingRoom(id) {
  return request({
    url: '/community/room/list',
    method: 'get',
    data: {
      "unitId": id,
      "pageNum": 1,
      "pageSize": 9999
    }
  })
}

// POST /relation/user/bind/room 绑定房产(微信端)
export function bindRoom(params) {
  return request({
    url: '/relation/user/bind/room',
    method: 'post',
    data: params
  })
}

// POST /relation/user/userRoom 查询用户绑定的房产
export function allRoom() {
  return request({
    url: '/relation/user/self',
    method: 'get',
    data: {
      "pageNum": 1,
      "pageSize": 9999
    }
  })
}
// /community/room/{id} 根据id查询 
export function roomDeatil(id) {
  return request({
    url: '/community/room/' + id,
    method: 'get',
  })
}

//房屋关系-成员字典表
export const getSysDictionaryDetailList = (data) => {
  return request({
    url: "/sys/dict/data/search",
    method: 'post',
    data
  })
}

// POST /relation/user/tenant 新增
export function addFamily(params) {
  return request({
    url: '/relation/user/tenant',
    method: 'post',
    data: params
  })
}
// /relation/user/oneself 查询户主绑定的人员信息
export function getBindingUserList(data) {
  return request({
    url: '/relation/user/oneself',
    method: 'post',
    data
  })
}

// 消息通知切换 /relation/user/default 设置默认
export function defaultNotice(data) {
  return request({
    url: '/relation/user/default',
    method: 'post',
    data
  })
}

// /property/community/position 定位当前位置
export function communityposition(data) {
  return request({
    url: '/property/community/position',
    method: 'post',
    data: data
  })
}

// /property/community/find 查询全部带搜索（小区编号搜索可要可不要）
export function communityFind(data) {
  return request({
    url: '/community/community/search',
    method: 'get',
    data: data
  })
}
export function communityFindCity(data) {
  return request({
    url: '/community/community/search',
    method: 'get',
    data: data
  })
}

// get /relation/user/untie/{id}  租客及家人解绑
export function bindUserUntie(id) {
  return request({
    url: '/relation/user/untie/' + id,
    method: 'get'
  })
}
// get /property/owner/{id} 查询租客及家人信息
export function getOwnerInfo(id) {
  return request({
    url: '/relation/owner/' + id,
    method: 'get'
  })
}
// post /relation/owner/modify 业主修改租客手机号
export function ownerModify(data) {
  return request({
    url: '/relation/owner/modify',
    method: 'post',
    data: data
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  })
}


// get community/community/dept  获取当前登录用户所属的所有小区
export function getcommunitydept(dictType) {
  return request({
    url: '/community/community/dept',
    method: 'get'
  })
}

// /relation/info/withhold
export function withhold(params) {
  return request({
    url: '/relation/info/withhold',
    method: 'post',
    data:params
  })
}



export function uploadImg(params) {
  return request({
    url: '/relation/info/upload/photo',
    method: 'post',
    data:params
  })
}