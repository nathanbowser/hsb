var util = require('util')
  , stream = require('stream')

var Arrayify = function () {
  stream.Transform.call(this, { objectMode: true })
  this.first = true
}

util.inherits(Arrayify, stream.Transform)

Arrayify.prototype._transform = function (chunk, encoding, next) {
  if (this.first) {
    this.push('[' + JSON.stringify(chunk))
    this.first = false
  } else {
    this.push(',' + JSON.stringify(chunk))
  }
  next()
}

Arrayify.prototype._flush = function (done) {
  this.push(']')
  done()
}

module.exports = Arrayify
