// @ts-nocheck
const { json, send } = require('micro')
const { validate: validateEmail } = require('email-validator')
const { hash, compare } = require('bcrypt')
const { generateHash } = require('random-hash')
const { passwordSaltRound, openRegister } = require('./config')
const { User, Session } = require('./db')

module.exports = {
  async register (req, res) {
    const { email, password } = await json(req)
    if (!openRegister) return send(res, 403, { non_field_errors: ['registration is closed'] })
    if (!validateEmail(email)) return send(res, 400, { email: ['Enter a valid email address.'] })
    if (User.find({ email }).value()) {
      return send(res, 400, {
        email: ['less pass user with this email address already exists.']
      })
    }
    const passwordHash = await hash(password, passwordSaltRound)
    User.push({ email, passwordHash }).write()
    // The original implementation has an id field but we don't have one at all.
    send(res, 200, { email })
  },

  async login (req, res) {
    const { email, password } = await json(req)
    const user = User.find({ email }).value()
    if (!user) return send(res, 400, { non_field_errors: ['Unable to log in with provided credentials.'] })
    const { passwordHash } = User.find({ email }).value()
    const match = await compare(password, passwordHash)
    if (!match) return send(res, 400, { non_field_errors: ['Unable to log in with provided credentials.'] })
    const token = generateHash({ length: 43 })
    Session.push({ email, token }).write()
    send(res, 200, { token })
  },

  async refreshToken (req, res) {
    const { token } = await json(req)
    const session = Session.find({ token }).value()
    if (!session) return send(res, 404, { non_field_errors: ['Token is invalid.'] })
    // Don't actually refresh token - just prevent it from being erased from local storage.
    return send(res, 200, { token })
  },

  requiresLogin (func) {
    return async (req, res) => {
      let token = ''
      try {
        token = req.headers['authorization'].split(' ')[1]
      } catch (e) {
        if (e) return send(res, 401, { detail: 'Error decoding signature.' })
      }
      const session = Session.find({ token }).value()
      // Just imitatation. We're not using JWT actually.
      if (!session) return send(res, 401, { detail: 'Error decoding signature.' })
      // Pass email to actual handler.
      await func(req, res, session.email)
    }
  }
}
