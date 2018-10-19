import Base from '@/api/class/base'
import fetch from '@/utils/fetch'
import { getBaseURLBySN } from '@/utils/index'

class resouceManage extends Base{
        getAuthorityManage (payload){
                return fetch({
                        baseURL: getBaseURLBySN('falcon'),
                        url: '/auth/findAuth',
                        method: 'post',
                        data: payload
                })
        }
}

export default new resouceManage('auth')