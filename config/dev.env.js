var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER_URL: {
    EXPERIMENT: '"http://localhost:3000/experiment"'
  }
})
