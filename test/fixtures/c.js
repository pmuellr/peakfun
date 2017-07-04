'use strict'

module.exports = c

const b = require('./b').b

function c (n) {
  if (n == null) n = 0
  if (n < 0) return

  b(n - 1)
}

c.x = foo

fun ction foo () {
}

if (require.main === module) c(3)
