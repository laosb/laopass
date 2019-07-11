const { send } = require('micro')
const { router, get, post, put, del } = require('microrouter')

const { login, register, resetPwd, confirmPwdReset, refreshToken } = require('./user')
const { getAllPwd, getPwd, createPwd, updatePwd, delPwd } = require('./password')


module.exports = router(
  // User
  post('/api/tokens/auth/', login),
  post('/api/auth/register/', register),
  post('/api/auth/password/reset/', resetPwd),
  post('/api/auth/password/reset/confirm/', confirmPwdReset),
  post('/api/tokens/refresh/', refreshToken),

  // Password
  get('/api/passwords/', getAllPwd),
  get('/api/passwords/:id/', getPwd),
  post('/api/passwords/', createPwd),
  put('/api/passwords/:id/', updatePwd),
  del('/api/passwords/:id/', delPwd)
)