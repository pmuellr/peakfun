'use strict'

exports.a = a

const b = require('./b').b

function a (n) {
  if (n == null) n = 0
  if (n < 0) return

  b(n - 1)
}

if (require.main === module) a(3)
