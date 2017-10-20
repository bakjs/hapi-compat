
const Hoek = require('hoek')
const Joi = require('joi')

const events = require('./events')
const ext = require('./ext')
const register = require('./register')

exports.register = function bakCompat (_server, { server, ...options }) {
  Hoek.assert(server, 'Missing `server` in options')

  Joi.assert(options, schema)
  options = Hoek.applyToDefaults(defaults, options)

  // Manually apply plugins as they are not normal ones!
  events.register(server, options)
  ext.register(server, options)
  register.register(server, options)
}

exports.pkg = require('../package.json')

const defaults = {
}

const schema = {
}
