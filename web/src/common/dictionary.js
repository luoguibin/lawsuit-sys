import { apiGetData, apiURL } from "../api";

const dataCache = {}
const promiseMap = {}
// window.testDictData = dataCache

export default {
  async load(codes = [], isDetail) {
    const promises = codes.map(v => {
      if (dataCache[v]) {
        return Promise.resolve(dataCache[v])
      }

      if (promiseMap[v]) {
        return promiseMap[v]
      }

      const url = isDetail ? apiURL.dictDetailByKey : apiURL.dictListByKey
      promiseMap[v] = apiGetData(url, { dictKey: v }).then(resp => {
        this.setDictList(v, resp.data || [])
      }).catch(() => {
        console.log(`dictionary: get ${v} fail`);
        this.setDictList(v, [])
      }).finally(() => {
        delete promiseMap[v]
      })

      return promiseMap[v]
    })

    await Promise.all(promises)
  },
  buildDict(dictKey, dictValue, dictLabel) {
    return {
      dictKey, dictValue, dictLabel
    }
  },
  setDictList(code, list) {
    dataCache[code] = list
  },
  getDictList(code) {
    return dataCache[code] || []
  },
  getDictValue(code, dictKey = code) {
    const list = this.getDictList(code)
    const item = list.find(o => o.dictKey === dictKey)
    return item && item.dictValue
  },
}