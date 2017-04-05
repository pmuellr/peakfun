'use strict'

exports.b = b

const a = require('./a').a

function b (n) {
  if (n == null) n = 0
  if (n < 0) return

  a(n - 1)
}

if (require.main === module) b(3)
