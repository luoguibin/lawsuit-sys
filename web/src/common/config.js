import Dictionary from "../common/dictionary";
import { reactive } from "vue";

const configData = reactive({
  sysTitle: localStorage.getItem("ls_sys_title") || "",
  divisionId: localStorage.getItem("ls_division_id") || "",
})

export default {
  install: function (app) {
    app.config.globalProperties.$config = configData
  },

  async ready() {
    if (!configData.sysTitle) {
      await Dictionary.load(["default_sys_title", "default_division_id"], true);
      configData.sysTitle = Dictionary.getDictValue("default_sys_title");
      configData.divisionId = Dictionary.getDictValue("default_division_id");

      localStorage.setItem('ls_sys_title', configData.sysTitle)
      localStorage.setItem('ls_division_id', configData.divisionId)
    } else {
      Dictionary.setDictList("default_sys_title", [Dictionary.buildDict("default_sys_title", configData.sysTitle, "")]);
      Dictionary.setDictList("default_division_id", [Dictionary.buildDict("default_division_id", configData.divisionId, "")]);
    }

    if (!configData.divisionId) {
      console.log("config: get default_division_id fail");
      return;
    }
    await Dictionary.load(["dept" + configData.divisionId, "post" + configData.divisionId,]);
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
  },
}