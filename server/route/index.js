const user = require("./user")
const division = require("./division")

const install = function (app) {
  user.install(app)
  division.install(app)
}

module.exports = {
  install
}