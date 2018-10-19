import Base from '@/api/class/base'
import fetch from '@/utils/fetch'
import { getBaseURLBySN } from '@/utils/index'

class roleManage extends Base{
        getRoleManage (payload){
                return fetch({
                        baseURL: getBaseURLBySN('falcon'), 
                        url: '/role/findRole',
                        method: 'post',
                        data: payload
                })
        }
        getRoleAuthManage (payload){
                return fetch({
                        baseURL: getBaseURLBySN('falcon'), 
                        url: '/role/findRoleAuth',
                        method: 'post',
                        data: payload
                })
        }
}

export default new roleManage('role')