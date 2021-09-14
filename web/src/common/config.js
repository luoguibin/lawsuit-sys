import Dictionary from "../common/dictionary";
import { reactive } from "vue";

const configData = reactive({
  sysTitle: "",
  divisionId: "",
  canRegister: "",
})

export default {
  install: function (app) {
    app.config.globalProperties.$config = configData
  },

  async ready() {
    // window.testConfig = this
    // window.testDict = Dictionary
    const cacheValue = '20210914'
    if (localStorage.getItem('ls_cache') !== cacheValue) {
      localStorage.clear()
      localStorage.setItem('ls_cache', cacheValue)
    }

    const cConfig = JSON.parse(localStorage.getItem('ls_default_config') || '{}')
    if (!cConfig.sysTitle) {
      await Dictionary.load(["default_config"]);
    } else {
      Dictionary.setDictList("default_config", [
        Dictionary.buildDict("sys_title", configData.sysTitle, ""),
        Dictionary.buildDict("division_id", configData.divisionId, ""),
        Dictionary.buildDict("can_register", configData.canRegister, ""),
      ]);
    }
    configData.sysTitle = Dictionary.getDictValue("default_config", "sys_title");
    configData.divisionId = Dictionary.getDictValue("default_config", "division_id");
    configData.canRegister = Dictionary.getDictValue("default_config", "can_register") === 'true'

    if (!cConfig.sysTitle) {
      localStorage.setItem('ls_default_config', JSON.stringify({
        "sys_title": configData.sysTitle,
        "division_id": configData.divisionId,
        "can_register": configData.canRegister
      }))
    }

    if (configData.divisionId) {
      await Dictionary.load(["dept" + configData.divisionId, "post" + configData.divisionId,]);
    } else {
      console.log("config: get default_division_id fail");
    }

    return configData;
  },

  getDepts() {
    return Dictionary.getDictList("dept" + configData.divisionId);
  },
  getPosts() {
    return Dictionary.getDictList("post" + configData.divisionId);
  },
  getDeptName(id) {
    const list = this.getDepts();
    const item = list.find((o) => o.id === id) || {};
    return item.dictLabel || item.dictKey;
  },
  getPostName(id) {
    const list = this.getPosts();
    const item = list.find((o) => o.id === id) || {};
    return item.dictLabel || item.dictKey;
  }
}