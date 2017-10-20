const Chalk = require('chalk')
const CallerId = require('caller-id')

function warn (type, message, at) {
  if (at) {
    console.warn('   ' + Chalk.red(at))
  }
  console.warn('⚠️ ', Chalk.yellow(`[${type}]`), Chalk.yellow(message), Chalk.grey('(see https://git.io/vd79N)'))
  console.warn('')
}

function caller () {
  const { filePath, lineNumber, functionName } = CallerId.getData(caller.caller)
  return `${filePath}:${lineNumber}@${functionName}`
}

function isPlugin (obj) {
  return obj && Boolean(obj.pkg || typeof obj.register === 'function')
}

function getFnParamNames (fn) {
  const match = fn.toString().match(/\(.*?\)/)
  return match ? match[0].replace(/[()]/gi, '').replace(/\s/gi, '').split(',') : []
}

module.exports = {
  warn,
  caller,
  isPlugin,
  getFnParamNames
}
