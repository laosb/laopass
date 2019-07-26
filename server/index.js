const { router, get, post, options/*, put, del */ } = require('microrouter')
const cors = require('micro-cors')()

const { login, register, /* resetPwd, confirmPwdReset */ refreshToken } = require('./user')
const { getAllPwd, createPwd/*, getPwd, updatePwd, delPwd */ } = require('./password')

module.exports = cors(router(
  // User
  post('/api/tokens/auth/', login),
  post('/api/auth/register/', register),
  // TODO: Implement those.
  // post('/api/auth/password/reset/', resetPwd),
  // post('/api/auth/password/reset/confirm/', confirmPwdReset),
  post('/api/tokens/refresh/', refreshToken),

  // Password
  get('/api/passwords/', getAllPwd),
  // get('/api/passwords/:id/', getPwd),
  post('/api/passwords/', createPwd),
  // put('/api/passwords/:id/', updatePwd),
  // del('/api/passwords/:id/', delPwd)

  options('/*', () => 'OK')
))
