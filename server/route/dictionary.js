const dictDao = require("../entity/dictionary")
const { GetResponseData, CONST_NUM } = require('./base')

const DICT_PATH = '/dictionary'

const VALIDATOR = {
  id: function (v = '') {
    if (!v) {
      return 'ID错误'
    }
  },
  parentId: function (v = '') {
    if (!v) {
      return 'PARENT_ID错误'
    }
  },
  key: function (v = '') {
    if (!v) {
      return '字典键不能为空'
    }
    if (v.length > 255) {
      return '字典键长度不能超过255'
    }
  },
  label: function (v = '') {
    if (v.length > 255) {
      return '字典值长度不能超过255'
    }
  },
  value: function (v = '') {
    if (v.length > 255) {
      return '字典值长度不能超过255'
    }
  },
  remark: function (v = '') {
    if (v.length > 255) {
      return '字典值注释不能超过255'
    }
  }
}


const install = function (app) {
  /**
   * 字典创建
   */
  app.post(DICT_PATH + '/create', async function (req, res) {
    const { parentId, dictKey, dictLabel, dictValue, remark } = req.body || {}
    const errMsg = VALIDATOR.parentId(parentId) || VALIDATOR.key(dictKey) || VALIDATOR.label(dictLabel) || VALIDATOR.value(dictValue) || VALIDATOR.remark(remark)
    if (errMsg) {
      return res.send(GetResponseData(CONST_NUM.ERROR, errMsg))
    }
    const e = await dictDao.create(parentId, dictKey, dictLabel, dictValue, remark).catch((err) => {
      console.log(err);
      return Promise.resolve(null)
    })

    if (!e) {
      return res.send(GetResponseData(CONST_NUM.ERROR))
    }
    res.send(GetResponseData())
  })

  /**
   * 字典更改
   */
  app.post(DICT_PATH + '/update', async function (req, res) {
    const { level: authLevel } = req.auth || {}
    if (authLevel < 8) {
      return res.send(GetResponseData(CONST_NUM.API_AUTH_LOW))
    }
    const { id, dictKey, dictLabel, dictValue, remark } = req.body || {}
    const errMsg = VALIDATOR.id(id) || VALIDATOR.key(dictKey) || VALIDATOR.label(dictLabel) || VALIDATOR.value(dictValue) || VALIDATOR.remark(remark)
    if (errMsg) {
      return res.send(GetResponseData(CONST_NUM.ERROR, errMsg))
    }
    const e = await dictDao.update(id, dictKey, dictLabel, dictValue, remark).catch(() => {
      return Promise.resolve(null)
    })

    if (!e) {
      return res.send(GetResponseData(CONST_NUM.ERROR))
    }
    res.send(GetResponseData())
  })

  /**
    * 字典删除
    */
  app.post(DICT_PATH + '/delete', async function (req, res) {
    const { level: authLevel } = req.auth || {}
    if (authLevel < 8) {
      return res.send(GetResponseData(CONST_NUM.API_AUTH_LOW))
    }

    const { id } = req.body || {}
    const errMsg = VALIDATOR.id(id)
    if (errMsg) {
      return res.send(GetResponseData(CONST_NUM.ERROR, errMsg))
    }
    const e = await dictDao.delete(id).catch(() => {
      return Promise.resolve(null)
    })

    if (!e) {
      return res.send(GetResponseData(CONST_NUM.ERROR))
    }
    res.send(GetResponseData())
  })

  /**
   * 字典同级列表
   */
  app.get(DICT_PATH + '/list', async function (req, res) {
    const { parentId } = req.query || {}
    const list = await dictDao.list(parentId).catch((err) => {
      console.log(err);
      return Promise.resolve(null)
    })

    if (!list) {
      return res.send(GetResponseData(CONST_NUM.ERROR))
    }
    res.send(GetResponseData(list))
  })

  /**
   * 通过dictKey获取字典
   */
  app.get(DICT_PATH + '/detail-by-key', async function (req, res) {
    const { dictKey } = req.query || {}
    const list = await dictDao.detailByKey(dictKey).catch(() => {
      return Promise.resolve(null)
    })

    if (!list) {
      return res.send(GetResponseData(CONST_NUM.ERROR))
    }
    res.send(GetResponseData(list))
  })
  /**
   * 通过dictKey获取字典下一级列表
   */
  app.get(DICT_PATH + '/list-by-key', async function (req, res) {
    const { dictKey } = req.query || {}
    const list = await dictDao.listChildrenByKey(dictKey).catch(() => {
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