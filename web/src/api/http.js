import axios from 'axios'
import Qs from 'qs'
import { user } from '../store'
import router from '../router/index'
import { ElMessage } from "element-plus"

let msgTarget
const showMessage = function (message) {
  if (msgTarget) {
    return
  }
  msgTarget = ElMessage({
    type: 'warning',
    message, onClose: () => {
      msgTarget = null
    }
  })
}

axios.defaults.timeout = 100000

axios.interceptors.request.use(
  config => {
    const token = user.token
    if (token) {
      config.headers['Authorization'] = token
    }
    if (config.data && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      config.data = Qs.stringify(config.data)
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  res => {
    const status = Number(res.status) || 0
    const data = res.data || {}
    if (status !== 200 || data.code !== 1000) {
      showMessage(data.msg || '操作失败')
      if (data.code === 1002) {
        router.push({ name: 'login', query: { redirect: router.currentRoute.fullPath } })
      } else if (data.code === 999) {
        router.push({ name: 'page-invalid', params: { invalidType: 'updating' } })
        return
      }
      return Promise.reject(res)
    }

    return data
  },
  error => {
    showMessage(error || '操作失败')
    return Promise.reject(new Error(error))
  }
)

export default axios
