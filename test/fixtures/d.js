'use strict'

const c = require('./c').c

class D {
  constructor () {
    this._d = null
  }

  d (n) {
    c(n - 1)
  }
}

module.exports = D

if (require.main === module) new D(3).d()
