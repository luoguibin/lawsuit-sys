const user = require("./user")
const division = require("./division")
const dictionary = require("./dictionary")

const install = function (app) {
  user.install(app)
  division.install(app)
  dictionary.install(app)
}

module.exports = {
  install
}