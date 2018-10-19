import Base from '@/api/class/base'
import fetch from '@/utils/fetch'
import { getBaseURLBySN } from '@/utils/index'


class Resource extends Base {
  
  getAllResTree(payload) {
    return fetch({
      baseURL: getBaseURLBySN('falcon'),
      url: '/org/findOrganizationTree',
      method: 'post',
      data: payload
    })
  }

}

export default new Resource('org')
