const { send, json } = require('micro')
const uuid = require('uuid/v4')
const { pick, omit } = require('lodash')
const Joi = require('@hapi/joi')
const { requiresLogin } = require('./user')
const { Password } = require('./db')

const rawPwdSchema = {
  // No id here. Id is checked independently.
  // No email here. Email is checked independently.
  login: Joi.string().max(255).default(''),
  site: Joi.string().max(255).default(''),

  lowercase: Joi.boolean().default(true),
  uppercase: Joi.boolean().default(true),
  symbols: Joi.boolean().default(true),
  numbers: Joi.boolean().default(true),

  length: Joi.number().integer().default(16),
  counter: Joi.number().integer().default(1),

  version: Joi.number().integer().default(2)
}

const pwdSchema = Joi.object(rawPwdSchema)

module.exports = {
  getAllPwd: requiresLogin((req, res, email) => {
    const results = Password.filter({ _user: email }).value().map(e => omit(e, ['_user']))
    send(res, 200, { count: results.length, next: null, previous: null, results })
  }),
  createPwd: requiresLogin(async (req, res, email) => {
    const pwdObj = pick(await json(req), Object.keys(rawPwdSchema))
    const { error } = Joi.validate(pwdObj, pwdSchema)
    if (error) return send(res, 400, error)
    pwdObj.id = uuid()
    pwdObj._user = email
    pwdObj.created = new Date()
    pwdObj.modified = new Date()
    Password.push(pwdObj).write()
    send(res, 200, pwdObj)
  })
}
