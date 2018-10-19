import fetch from '@/utils/fetch'
import { getBaseURLBySN } from '@/utils/index'

export function login(username, password) {
  return fetch({
   // baseURL: 'http://172.16.12.47:8893/oauth/token?grant_type=password&username=gjyang0427&password=gjyang0427&scope=all&client_id=CL-1521800858325&client_secret=269c8bb08c6b4d5180f0482f382344df',
    baseURL: getBaseURLBySN('falcon'),
    url: '/index',
    method: 'post',
    data: {
      // grant_type: 'password',
      // scope: 'all',
      // client_id: 'CL-1521800858325',
      // client_secret: '269c8bb08c6b4d5180f0482f382344df',
      username: username,
      password: password
    }
  })
}

export function getInfo(token) {
  return fetch({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return fetch({
    url: '/user/logout',
    method: 'post'
  })
}
