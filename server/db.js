const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ user: [], password: [], session: [] })
  .write()

module.exports = {
  User: db.get('user'),
  Password: db.get('password'),
  Session: db.get('session')
}
