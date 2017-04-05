'use strict'

const LOTS = false

const vm = require('vm')

const functions = require('./functions')

const SourceFiles = new Map()
const FunctionNames = new Map()
let DebugContext
let LogStream

exports.init = init
exports.setLogStream = setLogStream
exports.setFunctionBreakpoint = setFunctionBreakpoint

// initialize
function init () {
  if (vm.runInDebugContext == null) {
    throw new Error('vm.runInDebugContext() is not available')
  }

  DebugContext = vm.runInDebugContext('Debug')
  if (DebugContext == null) {
    throw new Error('vm.runInDebugContext("Debug") returned null')
  }

  DebugContext.setListener(handleDebugEvents)
}

// set the log stream
function setLogStream (logStream) {
  LogStream = logStream
}

// set a breakpoint on a function
function setFunctionBreakpoint (fn) {
  if (fn == null) return
  if (typeof fn !== 'function') {
    console.log('found a non-function: ', fn)
    return
  }

  try {
    return DebugContext.setBreakPoint(fn)
  } catch (err) {
  }
}

// debug event handler
function handleDebugEvents (event, execState, eventData) {
  try {
    handleDebugEvents_(event, execState, eventData)
  } catch (err) {
    console.log('error handling debug event:', err)
  }
}

// debug event handler
function handleDebugEvents_ (event, execState, eventData) {
  if (eventData == null) return
  if (typeof eventData.eventType !== 'function') return
  if (eventData.eventType() !== DebugContext.DebugEvent.Break) return

  const breakInfo = JSON.stringify(getBreakRecord(execState, eventData))
  LogStream.write(`${breakInfo}\n`)
}

// write out the breakpoint information
function getBreakRecord (execState, eventData) {
  const frameRecords = []
  const breakRecord = {
    fr: frameRecords
  }

  const frameCount = execState.frameCount()
  for (let i = 0; i < frameCount; i++) {
    const frame = execState.frame(i)
    const fn = frame.func().value()
    const id = frame.details().frameId()

    // for top frame, update the calls count of the function

    // get the frame record, set call count if appropriate
    const frameRecord = getFrameRecord(frame)
    if (i === 0) {
      const record = functions.getRecord(fn)
      if (record != null) record.calls++

      frameRecord.id = id
    }

    frameRecords.push(frameRecord)

    // if we've already recorded this function, stop now
    if (i !== 0) {
      if (functions.hasRecord(fn)) {
        frameRecord.id = id
        break
      }
    }
  }

  return breakRecord
}

// get a frame record
function getFrameRecord (frame) {
  // const id = frame.details().frameId()
  const func = frame.func() || { debugName () { return '-unkn-' } }
  const funcName = func.debugName() || '-anon-'
  let funcIndex = FunctionNames.get(funcName)
  if (funcIndex == null) {
    funcIndex = FunctionNames.size
    FunctionNames.set(funcName, funcIndex)
    const record = {
      fn: funcName,
      fi: funcIndex
    }
    LogStream.write(`${JSON.stringify(record)}\n`)
  }

  const sourceLocation = frame.sourceLocation()
  const sourceName = sourceLocation.script.name || '-unkn-'
  let sourceIndex = SourceFiles.get(sourceName)
  if (sourceIndex == null) {
    sourceIndex = SourceFiles.size
    SourceFiles.set(sourceName, sourceIndex)
    const record = {
      sn: sourceName,
      si: sourceIndex
    }
    LogStream.write(`${JSON.stringify(record)}\n`)
  }

  const sl = `${sourceIndex}:${sourceLocation.line}:${sourceLocation.column}`

  const frameRecord = {
    // id: id,
    ti: Date.now(),
    fi: funcIndex,
    sl: sl
  }

  if (LOTS) {
    const args = getFrameValues(frame, 'argument')
    const locs = getFrameValues(frame, 'local')

    if (args) frameRecord.ar = args
    if (locs) frameRecord.lo = locs

    if (frame.isConstructCall()) frameRecord.cc = true
    if (frame.isDebuggerFrame()) frameRecord.df = true
    if (frame.isOptimizedFrame()) frameRecord.of = true
    if (frame.isInlinedFrame()) frameRecord.if = true
    if (frame.isInlinedFrame()) frameRecord.if = true
  }

  return frameRecord
}

// get arguments or locals from frame
function getFrameValues (frame, type) {
  const count = frame[`${type}Count`]()
  if (count === 0) return null

  const result = {}

  for (let i = 0; i < count; i++) {
    const name = frame[`${type}Name`](i)
    const valu = frame[`${type}Value`](i)

    result[name] = coerceValue(valu)
  }

  return result
}

// coerce a value to a JSON primitive
function coerceValue (valueMirror) {
  const value = valueMirror.value()

  if (value == null) return null
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    if (value.length < 20) return value
    return `${value.substr(0, 20)}...`
  }
  if (typeof value === 'number') {
    if (isNaN(value)) return '[NaN]'
    return value
  }

  const className = valueMirror.className() || '-unkn-'
  return `[${className} object]`
}
