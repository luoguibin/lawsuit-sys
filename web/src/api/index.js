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

const preffix = '/law-api'
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
  userList: `${preffix + auth}/user/list`,
  // 用户信息更新
  userUpdate: `${preffix}/user/update`,
  // 用户自身信息更新
  userUpdateSelf: `${preffix}/user/update-self`,
  // 用户删除
  userDelete: `${preffix}/user/delete`,

  // 行政区划同级列表
  divisionList: `${preffix}/division/list`,

  // 字典列表
  dictList: `${preffix}/dictionary/list`,
  // 通过dictKey获取字典详情
  dictDetailByKey: `${preffix}/dictionary/detail-by-key`,
  // 通过dictKey获取字典下一级列表
  dictListByKey: `${preffix}/dictionary/list-by-key`,
  // 字典创建
  dictCreate: `${preffix}/dictionary/create`,
  // 字典更新
  dictUpdate: `${preffix}/dictionary/update`,
  // 字典删除
  dictDelete: `${preffix}/dictionary/delete`,
}
