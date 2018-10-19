import Base from '@/api/class/base'
import fetch from '@/utils/fetch'
import { getBaseURLBySN } from '@/utils/index'

class resouceManage extends Base{
        getResouceManage (payload){
                return fetch({
                        baseURL: getBaseURLBySN('falcon'),
                        url: '/resource/findResourceSortedTree',
                        method: 'post',
                        data: payload
                })
        }
        getAllResTreeByAuthId(payload){
                return fetch({
                        baseURL: getBaseURLBySN('falcon'),
                        url: '/resource/findAuthResource?authId='+payload,
                        method: 'get',
                        data: payload
                })
        }
}

export default new resouceManage('resource')