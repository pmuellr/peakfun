'use strict'

exports.list = list
exports.byModulePath = byModulePath
exports.byFunction = byFunction
exports.create = create

// global list of FnSpec objects created
const FnSpecs = []

// Map of fn -> [FnSpec], for fn's that are being peeked
const Targets = new Map()

// return list of current fnSpec objects
function list () {
  return FnSpecs.slice()
}

// given a module and path, return matching fnSpec objects
function byModulePath (mod, path) {
  return FnSpecs.filter(fnSpec => fnSpec.match(mod, path))
}

// given a function, return matching fnSpec objects
function byFunction (fn) {
  return Targets.get(fn)
}

// create a new fnSpec object
function create (modSpec, pathSpec) {
  modSpec = `${modSpec}`
  pathSpec = `${pathSpec}`

  if (pathSpec[0] !== '/') return null
  pathSpec = pathSpec.split('/')
  pathSpec.shift()

  const fnSpec = new FnSpec(modSpec, pathSpec)

  FnSpecs.push(fnSpec)
  return fnSpec
}

// FnSpec objects
class FnSpec {
  constructor (modSpec, pathSpec) {
    this.modSpec = modSpec
    this.pathSpec = pathSpec
    this.actions = []
    this.targets = []
  }

  addTarget (fn) {
    this.targets.push(fn)

    let target = Targets.get(fn)
    if (target == null) {
      target = []
      Targets.set(fn, target)
    }

    target.push(this)
  }

  addAction (fn) {
    this.actions.push(fn)
  }

  matches (mod, path) {
    // TODO: match!
  }
}
