import request from './http'

/**
 * @description 通用get请求
 * @param {String} url
 * @param {Object} params
 */
export const apiGetData = (url, params) =>
  request({
    url,
    method: 'get',
    params
  })

/**
 * @description 通用post请求
 * @param {String} url
 * @param {Object} params
 */
export const apiPostData = (url, data) =>
  request({
    url,
    method: 'post',
    data
  })

/**
 * @description 通用上传请求
 * @param {String} url
 * @param {Object} params
 */
export const apiPostUpload = (url, data, params, call) =>
  request({
    url,
    method: 'post',
    params,
    data,
    timeout: 60 * 1000,
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: e => {
      call && call(e)
    }
  })

const preffix = '/sapi'
const noauth = '/noauth'
const auth = '/auth'

/**
 * @description 接口地址列表
 */
export const apiURL = {
  // 用户注册
  register: `${preffix + noauth}/user/register`,
  // 用户登陆
  login: `${preffix + noauth}/user/login`,
  // 用户列表
  userList: `${preffix + auth}/user/list`
}
