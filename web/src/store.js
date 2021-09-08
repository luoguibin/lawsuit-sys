import { reactive } from "vue";

export const user = reactive({
  createTime: "",
  deptId: "",
  id: "",
  mobile: "",
  postId: "",
  token: "",
  updateTime: "",
  username: "",
})

export const commit = {
  setUser(info = {}) {
    localStorage.setItem("ls_user", encodeURIComponent(JSON.stringify(info)))
    for (const key in user) {
      if (Object.hasOwnProperty.call(user, key)) {
        user[key] = info[key];
      }
    }
  }
}

commit.setUser(JSON.parse(decodeURIComponent(localStorage.getItem("ls_user") || "") || "{}"))

export default {
  install: function (app) {
    app.config.globalProperties.$commit = commit
    app.config.globalProperties.$user = user
  }
}