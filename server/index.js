const express = require('express')
const cors = require("cors")
const bodyParser = require("body-parser")
const { server: configServer } = require("./config/index")
const { GetResponseData, CONST_NUM } = require('./route/base')
const timeUtil = require("./util/time")
const router = require("./route/index")
const auth = require('./core/auth')

const app = express()
app.use(cors({
  origin: ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  alloweHeaders: ['Origin', 'Authorization', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers', 'Content-Type']
}))

app.use('/public', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

  // 接口鉴权
  if ((req.method === 'POST' && !req.url.startsWith('/noauth/')) || req.path.startsWith('/auth/')) {
    const token = req.get('Authorization') || req.query.token
    if (!token) {
      res.send(GetResponseData(CONST_NUM.ERROR_TOKEN))
      return
    }
    auth.verify(token, data => {
      if (!data) {
        res.send(GetResponseData(CONST_NUM.ERROR_TOKEN))
        return
      }
      req.auth = {
        id: data.userId,
        level: +data.level || 1
      }
      next()
    })
  } else {
    next()
  }
})

// 基础测试路由
app.get('/', function (req, res) {
  res.send(GetResponseData({ currentTime: timeUtil.getTime() }))
}).post('/', function (req, res) {
  res.send(GetResponseData({ currentTime: timeUtil.getTime() }))
})

router.install(app);

const server = app.listen(configServer.port, function () {
  const object = server.address()
  const { address, port } = object
  console.log('Sghen-Server is running: https://%s:%s', address, port)
})