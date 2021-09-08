const JWT = require('jsonwebtoken')
const { auth: authConfig } = require('../config')

const newToken = function ({ id: userId, level }, options = {}) {
  if (!userId || !level) {
    return ''
  }
  const time = Math.floor(Date.now() / 1000)
  return JWT.sign({
    exp: time + (options.duration || authConfig.expDuration),
    iat: time,
    userId,
  }, authConfig.SECRET_KEY)
}

const verify = function (token, call) {
  JWT.verify(token, authConfig.SECRET_KEY, function (err, decoded) {
    call && call(err ? null : decoded)
  })
}

const auth = {
  newToken,
  verify
}

module.exports = auth
