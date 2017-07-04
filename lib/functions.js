'use strict'

exports.getRecord = getRecord
exports.hasRecord = hasRecord
exports.getRecords = getRecords
exports.setLogStream = setLogStream
exports.addFromModuleExports = addFromModuleExports

// const tracer = require('./tracer')

// let LogStream
const Store = new Map()
// const Logger = require('./logger').getLogger()

// Get the record for a function.
function getRecord (fn) {
  return Store.get(fn)
}

// Return whether there is a record for a function.
function hasRecord (fn) {
  return Store.has(fn)
}

// Get the records for all functions.
function getRecords () {
  return Array.from(Store.values())
}

// set the log stream
function setLogStream (logStream) {
//    LogStream = logStream
}

// Recursively add functions found in object.
// Designed to be initially called as ...(module, module.exports)
function addFromModuleExports (mod, object, path, seen) {
  if (object == null) return
  if (path == null) path = []
  if (seen == null) seen = new Map()

  const type = typeof object

  // skip objects we've already processed
  if (seen.has(object)) return
  seen.set(object, true)

  // process functions
  if (type === 'function') {
    console.log(`fnSpec: ${mod.filename} :: /${path.join('/')}`)
  }

  // recurse through properties
  for (let key in object) {
    addFromModuleExports(mod, object[key], path.concat(key), seen)
  }
}

// function isNotYetSeenFunction (object) {
//   if (!isFunction(object)) return false
//   return !Store.has(object)
// }

// class FnRecord {
//   constructor (fn) {
//     this.function = fn
//     this.locations = []
//
//     // this.breakpoint = tracer.setFunctionBreakpoint(fn)
//     // Logger.debug(`setting breakpoint on ${mod.id} ${path.join('.')}`)
//
//     // const si = LogStream.getSourceIndex(mod.id)
//     // const record = {
//     //   sb: si,
//     //   pa: path
//     // }
//     // LogStream.writeJSON(record)
//   }
//
//   addLocation (mod, path) {
//     this.locations.push(new FnLocation(mod, path))
//   }
//
//   get locations () {
//     return this.locations.slice()
//   }
// }
//
// class FnLocation {
//   constructor (mod, path) {
//     this._module = mod
//     this._path = path
//   }
//
//   get module () { return this._module}
//
//   get path () { return this._path}
// }
