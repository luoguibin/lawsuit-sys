const CONST_NUM = {
  MAINTENANCE: 999,
  SUCCESS: 1000,
  ERROR: 1001,
  ERROR_TOKEN: 1002,
  ERROR404: 1004,
  API_NOT_LOADED: 2000,
  API_REPEAT: 2001,
  API_PARAMS_ERROR: 2002,
  API_AUTH_LOW: 2003,
  DATA_NOT_OWN: 3004
}

const CONST_MSG = {
  999: '服务器维护中',
  1000: '请求成功',
  1001: '参数不合法',
  1002: 'TOKEN认证失败',
  1004: '接口路径不合法',
  2000: '接口未加载或未定义',
  2001: '接口重复定义',
  2002: '接口参数错误',
  2003: '用户权限不足',
  3004: '无法操作非自己创建的数据'
}

const GetResponseData = function (e, msg, error) {
  const data = {}
  if (typeof e === 'object') {
    data.code = CONST_NUM.SUCCESS
    data.data = e
  } else {
    data.code = e || CONST_NUM.SUCCESS
  }
  data.msg = msg || CONST_MSG[data.code]
  if (error) {
    data.error = error
  }
  return data
}

module.exports = {
  CONST_NUM,
  CONST_MSG,
  GetResponseData
}
