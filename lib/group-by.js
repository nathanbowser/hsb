var util = require('util')
  , stream = require('stream')

var GroupBy = function () {
  stream.Transform.call(this, { objectMode: true })
}

util.inherits(GroupBy, stream.Transform)

GroupBy.prototype._transform = function (chunk, encoding, next) {
  if (this.current && this.current['ULCS No.'] === chunk['ULCS No.']) {
    this.current.deficiencies++
  } else {
    if (this.current) { this.push(this.current) }
    this.current = chunk
    this.current.deficiencies = 1
  }
  next()
}

GroupBy.prototype._flush = function (done) {
  this.push(this.current)
  this.current  = null
  done()
}

module.exports = GroupBy
