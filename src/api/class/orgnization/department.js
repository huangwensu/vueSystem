import Base from '@/api/class/base'
import fetch from '@/utils/fetch'
import { getBaseURLBySN } from '@/utils/index'

class departmentResource extends Base {
  
  getDepartmentTree(payload) {
    return fetch({
      baseURL: getBaseURLBySN('falcon'),
      url: '/department/list',
      method: 'post',
      data: payload
    })
  }


}

export default new departmentResource('department')
