import { reactive } from "vue";

export const user = reactive({
  id: "",
  token: "",
  username: "",
  mobile: "",
  level: "",
  deptId: "",
  postId: "",
  createTime: "",
  updateTime: "",
})

export const commit = {
  setUser(info = {}, isStore = true) {
    isStore && localStorage.setItem("ls_user", encodeURIComponent(JSON.stringify(info)))
    for (const key in user) {
      if (Object.hasOwnProperty.call(user, key)) {
        user[key] = info[key];
      }
    }

    user.deptName = ""
    user.postName = ""
  }
}

commit.setUser(JSON.parse(decodeURIComponent(localStorage.getItem("ls_user") || "") || "{}"), false)

export default {
  install: function (app) {
    app.config.globalProperties.$commit = commit
    app.config.globalProperties.$user = user
  }
}