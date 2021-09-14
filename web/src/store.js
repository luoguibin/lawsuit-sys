import { reactive } from "vue";

const definedUser = {
  id: "",
  token: "",
  username: "",
  mobile: "",
  realName: "",
  level: "",
  deptId: "",
  postId: "",
  createTime: "",
  updateTime: "",
}
export const user = reactive({ ...definedUser })

export const commit = {
  _storeUser() {
    const info = {}
    for (const key in definedUser) {
      if (Object.hasOwnProperty.call(user, key)) {
        info[key] = user[key]
      }
    }
    localStorage.setItem("ls_user", encodeURIComponent(JSON.stringify(info)))
  },
  setUser(info = {}, isStore = true) {
    for (const key in user) {
      if (Object.hasOwnProperty.call(user, key)) {
        user[key] = info[key];
      }
    }

    isStore && this._storeUser()

    user.deptName = ""
    user.postName = ""
  },
  updateUser(info = {}) {
    for (const key in info) {
      if (Object.hasOwnProperty.call(definedUser, key)) {
        user[key] = info[key];
      }
    }
    this._storeUser()
  }
}

const cacheValue = '20210914'
if (localStorage.getItem('ls_cache') !== cacheValue) {
  localStorage.clear()
  localStorage.setItem('ls_cache', cacheValue)
} else {
  commit.setUser(JSON.parse(decodeURIComponent(localStorage.getItem("ls_user") || "") || "{}"), false)
}

export default {
  install: function (app) {
    app.config.globalProperties.$commit = commit
    app.config.globalProperties.$user = user
  }
}