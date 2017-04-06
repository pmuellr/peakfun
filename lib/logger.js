'use strict'

// writes status messages to the console

exports.getLogger = getLogger

const pkg = require('../package.json')
const chalk = require('chalk')

// force chalk on if stderr is a tty (turns off if stdout isn't a tty)
if (process.stderr) {
  if (process.stderr.isTTY) chalk.enabled = true
}

// return a new logger
function getLogger () {
  return GlobalLogger
}

// logger object
class Logger {
  constructor () {
    this.isQuiet = false
    this.isDebugging = false
  }

  log (message) {
    if (this.isQuiet) return

    console.error(`${chalk.green(pkg.name)} - ${chalk.yellow(message)}`)
  }

  debug (message) {
    if (this.isQuiet) return
    if (!this.isDebugging) return

    console.error(`${chalk.green(pkg.name)} - ${chalk.blue(message)}`)
  }

  quiet (aBoolean) {
    if (aBoolean == null) return this.isQuiet
    this.isQuiet = !!aBoolean
    return this.isQuiet
  }

  debugging (aBoolean) {
    if (aBoolean == null) return this.isDebugging
    this.isDebugging = !!aBoolean
    return this.isDebugging
  }
}

// single global logger
const GlobalLogger = new Logger()

if (process.env.DEBUG != null || process.env.LOGLEVEL === 'debug') {
  GlobalLogger.debugging(true)
}
