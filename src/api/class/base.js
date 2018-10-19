import fetch from '@/utils/fetch'
import { getBaseURLBySN } from '@/utils/index'
/**
 * 所有API的最上层接口
 * 其它API可以继承此接口得到接口中定义的通用接口：
 * 用法粟子：
 * class ModuleName extends Base{
 * 		// 本模块其它特有的接口
 * }
 *
 * export default new ModuleName('api-module')
 */
class Base {
  constructor(prefix) {
    this.prefix = prefix
  }
  // 添加
  add(payload) {
    return fetch({
      // baseURL: getBaseURLBySN(`${this.prefix}`),
      // url: `/${this.prefix}/add`,
      baseURL: getBaseURLBySN('falcon'),
      url: `/${this.prefix}/add`,
      method: 'post',
      data: payload
    })
  }

  // 删除或禁用
  deleteById(payload) {
    return fetch({
      baseURL: getBaseURLBySN('falcon'),
      url: `/${this.prefix}/delete`,
      method: 'post',
      data: payload
    })
  }

  // 修改
  updateById(payload) {
    return fetch({
      baseURL: getBaseURLBySN('falcon'),
      url: `/${this.prefix}/update`,
      method: 'post',
      data: payload
    })
  }

  // 不分页获取所有数据
  getList(payload) {
    return fetch({
      baseURL: getBaseURLBySN(`${this.prefix}`),
      url: `/${this.prefix}/query`,
      method: 'post',
      data: payload
    })
  }

  // 分页获取当前页数据
  getPageList(payload) {
    return fetch({
      baseURL: getBaseURLBySN(`${this.prefix}`),
      url: `/${this.prefix}/pageQuery`,
      method: 'post',
      data: payload
    })
  }

  // 根据id获取信息
  getInfoById(payload) {
    return fetch({
      baseURL: getBaseURLBySN(`${this.prefix}`),
      url: `/${this.prefix}/info`,
      method: 'post',
      data: payload
    })
  }

  // 根据id禁用
  disableById(payload) {
    return fetch({
      baseURL: getBaseURLBySN(`${this.prefix}`),
      url: `/${this.prefix}/disable`,
      method: 'post',
      data: payload
    })
  }

  // 根据id启用
  enableById(payload) {
    return fetch({
      baseURL: getBaseURLBySN(`${this.prefix}`),
      url: `/${this.prefix}/enable`,
      method: 'post',
      data: payload
    })
  }

  //orglist修改
  orgUpdateById(payload) {
    return fetch({
      baseURL: getBaseURLBySN('falcon'),
      url: `/${this.prefix}/updateOrganization`,
      method: 'post',
      data: payload
    })
  }

  //资源管理新增、编辑修改、禁用、启用
  resourceAdd(payload){
    return fetch({
      baseURL:getBaseURLBySN('falcon'),
      url:`/${this.prefix}/saveResource`, 
      method:'post',
      data:payload
    })
  }
   resourceUpdate(payload){
    return fetch({
      baseURL:getBaseURLBySN('falcon'),
      url:`/${this.prefix}/updateResource`,  
      method:'post',
      data:payload
    })
  }
  resourceForbidden(payload){
    return fetch({
      baseURL:getBaseURLBySN('falcon'),
      url:`/${this.prefix}/forbiddenResource`,  
      method:'post',
      data:payload
    })
  }
  resourceStart(payload){
    return fetch({
      baseURL:getBaseURLBySN('falcon'),
      url:`/${this.prefix}/startResource`,  
      method:'post',
      data:payload
    })
  }


  //角色新增、修改和角色权限
  roleAdd(payload) {
    return fetch({
      baseURL: getBaseURLBySN('falcon'),
      url: `/${this.prefix}/saveRole`,  
      method: 'post',
      data: payload
    })
  }
  roleUpdateById(payload) {
    return fetch({
      baseURL: getBaseURLBySN('falcon'),
      url: `/${this.prefix}/update`,
      method: 'post',
      data: payload
    })
  }
  roleAuthById(payload) {
    return fetch({
      baseURL: getBaseURLBySN('falcon'),
      url: `/${this.prefix}/findRoleAuth`,
      method: 'post',
      data: payload
    })
  }

}




export default Base
