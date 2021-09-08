const userDao = require("../entity/user")
const { GetResponseData, CONST_NUM } = require('./base')
const timeUtil = require("../util/time")
const auth = require("../core/auth")

const NO_AUTH_PATH = '/noauth'
const AUTH_PATH = '/auth'
const USER_PATH = '/user'

const VALIDATOR = {
  username: function (v) {
    if (!v) {
      return '用户名不能为空'
    }
    if (v.length > 255) {
      return '用户名长度不能超过255'
    }
  },
  mobile: function (v) {
    if (!v) {
      return '手机号码不能为空'
    }
    if (v.length !== 11) {
      return '手机号码格式错误'
    }
  },
  password: function (v) {
    if (!v) {
      return '密码不能为空'
    }
  },
}

const install = function (app) {
  /**
   * 用户注册
   */
  app.post(NO_AUTH_PATH + USER_PATH + '/register', function (req, res) {
    const { username, mobile, password, deptId = 0, postId = 0 } = req.body || {}
    const errMsg = VALIDATOR.username(username) || VALIDATOR.mobile(mobile) || VALIDATOR.password(password)
    if (errMsg) {
      return res.send(GetResponseData(CONST_NUM.ERROR, errMsg))
    }

    userDao.create(username, password, mobile, deptId, postId).then(() => {
      res.send(GetResponseData({ currentTime: timeUtil.getTime() }))
    }).catch((err) => {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.send(GetResponseData(CONST_NUM.ERROR, "手机号码已被注册"))
      }
      res.send(GetResponseData(CONST_NUM.ERROR))
    })
  })

  /**
   * 用户登录
   */
  app.post(NO_AUTH_PATH + USER_PATH + '/login', function (req, res) {
    const { mobile, password } = req.body || {}
    const errMsg = VALIDATOR.mobile(mobile) || VALIDATOR.username(password)
    if (errMsg) {
      return res.send(GetResponseData(CONST_NUM.ERROR, errMsg))
    }

    userDao.login(mobile, password).then((resp) => {
      const user = resp[0]
      if (!user) {
        return res.send(GetResponseData(CONST_NUM.ERROR, "手机号码未注册或密码错误"))
      }
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
    const list = await userDao.list(page, size).catch((err) => {
      console.log(err);
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