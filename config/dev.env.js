var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
  // BASE_API: '"http://172.16.12.45/"',
 // BASE_API: '"http://172.16.12.46/"',
  BASE_API: '"http://192.168.80.74:8080"',
})
