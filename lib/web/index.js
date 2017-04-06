'use strict'

const FileReader = window.FileReader

const logger = require('../logger').getLogger(__filename)

setTimeout(renderSample, 100)

window.ct2cgOnDragEnter = onDragEnter
window.ct2cgOnDragOver = onDragOver
window.ct2cgOnDrop = onDrop

// when drag entered
function onDragEnter () {
  const event = window.event
  logger.log('drag entered')
  event.stopPropagation()
  event.preventDefault()
}

// when dragged over
function onDragOver () {
  const event = window.event
  logger.log('drag overred')
  event.stopPropagation()
  event.preventDefault()
}

// when dropped
function onDrop () {
  const event = window.event
  event.stopPropagation()
  event.preventDefault()

  const dt = event.dataTransfer
  const file = dt.files[0]
  logger.log(`drag dropped file: ${file.name}`)

  const fileReader = new FileReader()
  fileReader.onabort = (e) => cb(new Error('interrupted'))
  fileReader.onerror = (e) => cb(new Error('some error'))
  fileReader.onload = (e) => cb(null, e)
  fileReader.readAsText(file)

  function cb (err, event) {
    if (err) return logger(`error loading ${file.name}: ${err}`)

    const data = event.target.result
    render(file.name, data)
  }
}

// render the sample call graph
function renderSample () {
  logger.log('generating sample graph')

  const data = '' // need to XHR it
  render('peakfun-sample.json', data)
}

// render gorgeous results
function render (fileName, data) {
  logger.log('render: start')
}
