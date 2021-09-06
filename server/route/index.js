const user = require("./user")

const install = function(app) {
  user.install(app)
}

module.exports = {
  install
}