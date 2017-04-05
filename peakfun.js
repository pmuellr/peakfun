'use strict'

const fs = require('fs')
const path = require('path')
const modModule = require('module')

const mkdirp = require('mkdirp')
const userhome = require('userhome')

const functions = require('./lib/functions')
const tracer = require('./lib/tracer')

// original require('module').prototype.load
let ModuleLoadOriginal

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

  const date = new Date()
    .toISOString()
    .substr(0, 19)
    .replace('T', '_')
    .replace(/:/g, '-')

  const logFile = path.join(logsDir, `${date}.json`)
  const logStream = fs.createWriteStream(logFile)
  // process.on('exit', (code) => logStream.close())

  console.log(`writing peakfun log to ${logFile}`)
  tracer.setLogStream(logStream)

  ModuleLoadOriginal = modModule.prototype.load
  modModule.prototype.load = moduleLoadShim
}

// our shim over require('module').prototype.load
function moduleLoadShim (fileName) {
  const result = ModuleLoadOriginal.call(this, fileName)

  console.log(`processing module: ${this.id}`)
  try {
    functions.addFromModuleExports(this, this.exports)
  } catch (err) {
    console.log(`error processing module: ${this.id}:`, err)
  }

  return result
}

// log a message that we can't run
function logNope (message) {
  console.log(`${message}, no peeking at your functions`)
}

// call the main function
main()
