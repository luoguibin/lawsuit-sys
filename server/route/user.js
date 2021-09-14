const userDao = require("../entity/user")
const { GetResponseData, CONST_NUM } = require('./base')
const timeUtil = require("../util/time")
const dataUtil = require("../util/data")
const auth = require("../core/auth")

const NO_AUTH_PATH = '/noauth'
const AUTH_PATH = '/auth'
const USER_PATH = '/user'

const VALIDATOR = {
  id: function (v = '') {
    if (!v) {
      return 'ID错误'
    }
  },
  username: function (v = '') {
    if (!v) {
      return '用户名不能为空'
    }
    if (v.length > 255) {
      return '用户名长度不能超过255'
    }
  },
  mobile: function (v = '') {
    if (!v) {
      return '手机号码不能为空'
    }
    if (v.length !== 11) {
      return '手机号码格式错误'
    }
  },
  password: function (v = '') {
    if (!v) {
      return '密码不能为空'
    }
  },
  realName: function (v = '') {
    if (!v) {
      return '真实姓名不能为空'
    }
    if (v.length > 255) {
      return '真实姓名长度不能超过255'
    }
  },
  level: function (v = '', max) {
    if (0 < v && v < 10) {
      if (v >= max) {
        return '账号级别设置值不能超过当前登录用户'
      }
      return
    }
    return '账号级别错误'
  },
  deptId: function (v = '') {
    if (!v) {
      return 'ID错误'
    }
  },
  postId: function (v = '') {
    if (!v) {
      return 'ID错误'
    }
  },
  rand: function (v = '') {
    if (!v) {
      return 'RAND不能为空'
    }
    if (v.length > 10) {
      return 'RAND长度不能超过10'
    }
  }
}

const install = function (app) {
  /**
   * 用户注册
   */
  app.post(NO_AUTH_PATH + USER_PATH + '/register', function (req, res) {
    const { username, mobile, password, realName, deptId = 0, postId = 0 } = req.body || {}
    const errMsg = VALIDATOR.username(username) || VALIDATOR.mobile(mobile) || VALIDATOR.password(password) || VALIDATOR.realName(realName)
    if (errMsg) {
      return res.send(GetResponseData(CONST_NUM.ERROR, errMsg))
    }

    const createTime = timeUtil.getTime(timeUtil.newDate())
    userDao.create(username, password, realName, mobile, deptId, postId, createTime).then(() => {
      res.send(GetResponseData({ currentTime: createTime }))
    }).catch((err) => {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.send(GetResponseData(CONST_NUM.ERROR, "手机号码或用户名已被注册"))
      }
      res.send(GetResponseData(CONST_NUM.ERROR))
    })
  })

  /**
   * 用户信息编辑
   */
  app.post(USER_PATH + '/update', function (req, res) {
    const { level: authLevel } = req.auth || {}
    if (authLevel < 8) {
      return res.send(GetResponseData(CONST_NUM.API_AUTH_LOW))
    }

    const { id, username, mobile, realName, level = 1, deptId, postId } = req.body || {}
    const errMsg = VALIDATOR.id(id) || VALIDATOR.username(username) || VALIDATOR.mobile(mobile) || VALIDATOR.realName(realName) || VALIDATOR.level(level, authLevel) || VALIDATOR.deptId(deptId) || VALIDATOR.postId(postId)
    if (errMsg) {
      return res.send(GetResponseData(CONST_NUM.ERROR, errMsg))
    }

    const updateTime = timeUtil.getTime(timeUtil.newDate())
    userDao.update(id, updateTime, username, mobile, realName, level, deptId, postId).then(() => {
      res.send(GetResponseData({ updateTime }))
    }).catch((err) => {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.send(GetResponseData(CONST_NUM.ERROR, "手机号码已被注册"))
      }
      res.send(GetResponseData(CONST_NUM.ERROR))
    })
  })

  /**
   * 用户自身信息编辑
   */
  app.post(USER_PATH + '/update-self', function (req, res) {
    const { id } = req.auth || {}
    const { realName, password, mobile } = req.body || {}
    if (!realName && !mobile) {
      return res.send(GetResponseData(CONST_NUM.ERROR))
    }
    const errMsg = (realName && VALIDATOR.realName(realName)) || (mobile && VALIDATOR.mobile(mobile)) || (password && VALIDATOR.password(password))
    if (errMsg) {
      return res.send(GetResponseData(CONST_NUM.ERROR, errMsg))
    }

    const updateTime = timeUtil.getTime(timeUtil.newDate())
    userDao.update(id, updateTime, "", mobile, realName, "", "", "", password).then(() => {
      res.send(GetResponseData({ updateTime }))
    }).catch(() => {
      res.send(GetResponseData(CONST_NUM.ERROR))
    })
  })

  /**
   * 用户删除
   */
  app.post(USER_PATH + '/delete', function (req, res) {
    const { level: authLevel } = req.auth || {}
    if (authLevel < 8) {
      return res.send(GetResponseData(CONST_NUM.API_AUTH_LOW))
    }

    const { id, } = req.body || {}
    const errMsg = VALIDATOR.id(id)
    if (errMsg) {
      return res.send(GetResponseData(CONST_NUM.ERROR, errMsg))
    }

    userDao.delete(id).then(() => {
      res.send(GetResponseData())
    }).catch(() => {
      res.send(GetResponseData(CONST_NUM.ERROR))
    })
  })

  /**
   * 用户登录
   */
  app.post(NO_AUTH_PATH + USER_PATH + '/login', function (req, res) {
    const { username, mobile, password, rand } = req.body || {}
    if (username) {
      const errMsg = VALIDATOR.username(username) || VALIDATOR.password(password) || VALIDATOR.rand(rand)
      if (errMsg) {
        return res.send(GetResponseData(CONST_NUM.ERROR, errMsg))
      }
    } else if (mobile) {
      const errMsg = VALIDATOR.mobile(mobile) || VALIDATOR.password(password) || VALIDATOR.rand(rand)
      if (errMsg) {
        return res.send(GetResponseData(CONST_NUM.ERROR, errMsg))
      }
    } else {
      return res.send(GetResponseData(CONST_NUM.ERROR))
    }

    userDao.login(mobile, username).then((resp) => {
      const user = resp[0]
      if (!user || dataUtil.md5(user.password + '_' + rand) !== password) {
        const msg = mobile ? '手机号码未注册或密码错误' : '用户名未注册或密码错误'
        return res.send(GetResponseData(CONST_NUM.ERROR, msg))
      }
      delete user.password
      user.token = auth.newToken(user)
      res.send(GetResponseData(user))
    }).catch(() => {
      res.send(GetResponseData(CONST_NUM.ERROR))
    })
  })

  /**
   * 用户列表
   */
  app.get(AUTH_PATH + USER_PATH + '/list', async function (req, res) {
    const { level } = req.auth || {}
    if (level < 8) {
      return res.send(GetResponseData(CONST_NUM.API_AUTH_LOW))
    }

    const count = await userDao.listCount().then(resp => {
      return +resp[0].count
    }).catch(() => {
      return Promise.resolve(-1)
    })
    if (count < 0) {
      return res.send(GetResponseData(CONST_NUM.ERROR))
    }
    const { page = 1, size = 10 } = req.query || {}
    const list = await userDao.list(+page, +size).catch(() => {
      return Promise.resolve(null)
    })

    if (!list) {
      return res.send(GetResponseData(CONST_NUM.ERROR))
    }
    res.send(GetResponseData({
      count,
      list
    }))
  })
}

module.exports = {
  install
}