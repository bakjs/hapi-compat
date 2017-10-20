const { warn, caller, getFnParamNames } = require('./utils')

function wrapEventMethod (originalMethod) {
  // method' params are not always the same when calling server.ext
  // We need to use some tests for *guessing* if next/callback is there
  const fnParamNames = getFnParamNames(originalMethod)
  const lastParamName = fnParamNames.length ? fnParamNames[fnParamNames.length - 1] : ''
  const hasNext = lastParamName === 'next' || lastParamName === 'callback' || lastParamName === 'cb'

  if (!hasNext) {
    return originalMethod
  }

  const wrappedFn = function () {
    warn('ASYNC_SERVER_EXT', 'methods for server.ext should return promise instead of accepting next/callback argument', caller())
    return new Promise((resolve, reject) => {
      const next = err => {
        if (err) {
          return reject(err)
        }
        resolve()
      }
      return originalMethod.call(this, ...[].concat(arguments), next)
    })
  }

  return wrappedFn
}

function wrapServerExt (originalServerExt) {
  const serverExt = function (event, method, options) {
    if (Array.isArray(event)) {
      return Promise.all(event.map(e => serverExt.call(this, e)))
    }

    if (method) {
      method = wrapEventMethod(method)
      return originalServerExt.call(this, event, method, options)
    }

    // Clone to prevent mutation
    event = Object.assign({}, event)

    if (Array.isArray(event.method)) {
      event.method = event.method.map(m => wrapEventMethod(m))
    } else if (event.method) {
      event.method = wrapEventMethod(event.method)
    }

    return originalServerExt.call(this, event)
  }
  return serverExt
}

function register (server, config) {
  server.ext = wrapServerExt(server.ext)
}

exports.register = register
exports.name = 'hapi-compat-ext'
