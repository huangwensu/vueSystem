import Base from '@/api/class/base'
import fetch from '@/utils/fetch'
import { getBaseURLBySN } from '@/utils/index'

class userManage extends Base{
        getUserManage (payload){
                return fetch({
                        baseURL: getBaseURLBySN('falcon'), 
                        url: '/user/findUserTree',
                        method: 'post',
                        data: payload
                })
        }
        getUserListManage(payload){
            return fetch({
                baseURL: getBaseURLBySN('falcon'), 
                url: '/user/findPage',
                method: 'post',
                data: payload
            })
        }
}

export default new userManage('user')