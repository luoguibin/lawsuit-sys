const divisionDao = require("../entity/division")
const { GetResponseData, CONST_NUM } = require('./base')

const DIVISION_PATH = '/division'

const install = function (app) {

  /**
   * 行政区划同级列表
   */
  app.get(DIVISION_PATH + '/list', async function (req, res) {

    const { parentId } = req.query || {}
    const list = await divisionDao.list(parentId).catch(() => {
      return Promise.resolve(null)
    })

    if (!list) {
      return res.send(GetResponseData(CONST_NUM.ERROR))
    }
    res.send(GetResponseData(list))
  })
}

module.exports = {
  install
}