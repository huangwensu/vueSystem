import Cookies from 'js-cookie'	// good-catch

const TokenKey = '905409B194AA83739CFAA5680A3923A3'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
