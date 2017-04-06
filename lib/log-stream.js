'use strict'

// writes JSON lines as program output

exports.create = create

const fs = require('fs')
const path = require('path')

// create a new log stream
function create (dir, name) {
  if (name == null) name = getDefaultName()

  const logFile = path.join(dir, name)

  return new LogStream(logFile)
}

// class that models the stream
class LogStream {
  constructor (fileName) {
    this.fileName = fileName
    this.stream = fs.createWriteStream(fileName)
    this.nameMap = new Map()
  }

  getFileName () {
    return this.fileName
  }

  writeJSON (object) {
    this.stream.write(`${JSON.stringify(object)}\n`)
  }

  getFunctionIndex (name) {
    return this.getIndex(name, 'fi', 'fn')
  }

  getSourceIndex (name) {
    return this.getIndex(name, 'si', 'sn')
  }

  // get the index of a cached name, creating if new
  getIndex (name, propIndex, propName) {
    const key = `${propName}-${name}`
    let index = this.nameMap.get(key)
    if (index != null) return index

    index = this.nameMap.size
    this.nameMap.set(key, index)

    const record = {}
    record[propIndex] = index
    record[propName] = name
    this.writeJSON(record)

    return index
  }
}

// get a default name for a log stream
function getDefaultName () {
  const date = new Date()
    .toISOString()
    .substr(0, 19)
    .replace('T', '_')
    .replace(/:/g, '-')
  return `${date}.json`
}
