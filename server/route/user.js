const { GetResponseData } = require('./base')
const timeUtil = require("../util/time")

const USER_PATH = '/user'

const install = function(app) {
  app.get(USER_PATH, function (req, res) {
    res.send(GetResponseData({ currentTime: timeUtil.getTime() }))
  })
  app.post(USER_PATH + '/login', function (req, res) {
    res.send(GetResponseData({ currentTime: timeUtil.getTime() }))
  })
}

module.exports = {
  install
}