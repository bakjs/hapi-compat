
const { warn, caller } = require('./utils')

function register (server, config) {
  server.decorate('server', 'on', function (event, listener) {
    warn('SERVER_ON', 'server.on is no longer available, use server.events.on instead!', caller())
    if (event === 'tail') {
      return
    }
    server.events.on(event, listener)
  })
}

exports.register = register
exports.name = 'hapi-compat-events'
