'use strict'

const modModule = require('module')

const mkdirp = require('mkdirp')
const userhome = require('userhome')

const tracer = require('./lib/tracer')
const functions = require('./lib/functions')
const LogStream = require('./lib/log-stream')

// original require('module').prototype.load
let ModuleLoadOriginal
const Logger = require('./lib/logger').getLogger()

// get all the things set up
function main () {
  try {
    tracer.init()
  } catch (err) {
    logNope(err.message)
    return
  }

  // install the module.load shim
  if (typeof modModule.prototype.load !== 'function') {
    logNope('require("module").load not found')
    return
  }

  // create the log stream
  const logsDir = userhome('.peakfun', 'logs')
  try {
    mkdirp.sync(logsDir)
  } catch (err) {
    logNope(`unable to create directory "${logsDir}"`)
    return
  }

  const logStream = LogStream.create(logsDir)

  Logger.log(`writing peakfun log to ${logStream.getFileName()}`)
  tracer.setLogStream(logStream)
  functions.setLogStream(logStream)

  ModuleLoadOriginal = modModule.prototype.load
  modModule.prototype.load = moduleLoadShim
}

// our shim over require('module').prototype.load
function moduleLoadShim (fileName) {
  const result = ModuleLoadOriginal.call(this, fileName)

  Logger.debug(`processing ${this.id}`)
  try {
    functions.addFromModuleExports(this, this.exports)
  } catch (err) {
    Logger.log(`error processing module: ${this.id}:`, err)
  }

  return result
}

// log a message that we can't run
function logNope (message) {
  Logger.log(`${message}, no peeking at your functions`)
}

// call the main function
main()
