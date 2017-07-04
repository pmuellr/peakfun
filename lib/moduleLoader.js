'use strict'

const EventEmitter = require('events')

exports.shim = shim
exports.events = new EventEmitter()

// replace original require('module').prototype.load with shim

// example:
// const moduleLoader = require('./lib/moduleLoader')
// moduleLoader.events.on('loaded', (event) { console.log('loaded ${event.fileName}') })
// moduleLoader.shim()

// the 'loaded' event sends an event with the following property:
// - module: the module that was loaded

const path = require('path')
const modjewel = require('module')

const Program = path.basename(__filename)
const Emitter = exports.events
let LoadFn
let Shimmed = false

// shims require('module').prototype.load(), firing an event
function shim () {
  if (Shimmed) return
  Shimmed = true

  LoadFn = modjewel.prototype.load
  if (typeof LoadFn !== 'function') {
    LoadFn = undefined
    console.log(`${Program}: require("module").load() not found`)
    return
  }

  modjewel.prototype.load = moduleLoadShim
}

// the shim for require('module').prototype.load()
function moduleLoadShim (fileName) {
  // call original function
  const result = LoadFn.call(this, fileName)

  // fire event
  Emitter.emit('loaded', { module: this })

  // return expected result
  return result
}
