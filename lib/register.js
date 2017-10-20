const { warn, caller, getFnParamNames, isPlugin } = require('./utils')
const ext = require('./ext')

function wrapPlugin (originalPlugin, config) {
  const plugin = Object.assign({}, originalPlugin)

  // Support for attributes
  if (plugin.register.attributes && !plugin.pkg) {
    plugin.pkg = plugin.register.attributes.pkg || plugin.register.attributes
    delete plugin.register.attributes

    warn('PLUGIN_ATTRS', 'plugins should export { register, pkg } instead of { register.attributes }', 'plugin: ' + plugin.pkg.name)
  }

  // Wrap register function
  const originalRegister = originalPlugin.register
  const hasNext = getFnParamNames(originalRegister).length > 2
  const name = plugin.name || (plugin.pkg && plugin.pkg.name) || plugin.register.name

  if (hasNext) {
    warn('ASYNC_PLUGINS', 'plugins should return a promise instead of accepting next/callback argument', 'plugin: ' + name)
  }

  plugin.register = function (server, options) {
    return new Promise((resolve, reject) => {
      // Recursively add compat support as each plugin has it's own server realm
      register(server, config)
      ext.register(server, config)

      const result = originalRegister.call(this, server, options, err => {
        if (err) {
          return reject(err)
        }
        resolve()
      })

      if (!hasNext) {
        return resolve(result)
      }
    })
  }

  return plugin
}

function wrapServerRegister (originalServerRegister, config) {
  const serverRegister = function (registration, options) {
    if (Array.isArray(registration)) {
      return Promise.all(registration.map(r => serverRegister.call(this, r, options)))
    }

    // Clone to avoid mutating keys of original registration
    registration = Object.assign({}, registration)

    // Support for old { register } syntax
    if (isPlugin(registration.register)) {
      warn('SERVER_REGISTER', 'server registrations are now { plugin, options } instead of { register, options }', caller())
      registration.plugin = registration.register
      delete registration.register
    }

    // Wrap plugin
    if (isPlugin(registration)) {
      registration = wrapPlugin(registration, config)
    } else {
      registration.plugin = wrapPlugin(registration.plugin, config)
    }

    // Call to original register
    return originalServerRegister.call(this, registration, options)
  }
  return serverRegister
}

function register (server, config) {
  server.register = wrapServerRegister(server.register, config)
}

exports.register = register
exports.name = 'hapi-compat-register'
