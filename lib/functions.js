'use strict'

exports.addFromModuleExports = addFromModuleExports
exports.getRecord = getRecord
exports.hasRecord = hasRecord
exports.getRecords = getRecords

const tracer = require('./tracer')

const Store = new Map()

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

// Recursively add functions found in object.
// Designed to be initially called as ...(module, module.exports)
function addFromModuleExports (mod, object, path, seen) {
  if (object == null) return
  if (typeof object === 'string') return
  if (typeof object === 'number') return
  if (typeof object === 'boolean') return

  if (path == null) path = []
  if (seen == null) seen = new Map()

  if (seen.has(object)) return
  seen.set(object, true)

  if (isNotYetSeenFunction(object)) {
    Store.set(object, new FnRecord(mod, path, object))
  }

  if (Array.isArray(object)) {
    for (let i = 0; i < object.length; i++) {
      addFromModuleExports(mod, object[i], path.concat(i), seen)
    }
  }

  for (let key in object) {
    addFromModuleExports(mod, object[key], path.concat(key), seen)
  }
}

function isFunction (object) {
  return typeof object === 'function'
}

function isNotYetSeenFunction (object) {
  if (!isFunction(object)) return false
  return !Store.has(object)
}

class FnRecord {
  constructor (mod, path, fn) {
    // console.log(`creating record for ${mod} ${JSON.stringify(path)}`, fn)
    this.module = mod
    this.path = path
    this.function = fn
    this.calls = 0
    this.breakpoint = tracer.setFunctionBreakpoint(fn)
  }
}
