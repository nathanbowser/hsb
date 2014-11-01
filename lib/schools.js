var util = require('util')
  , stream = require('stream')
  , es = require('event-stream')

var Arrayify = function () {
  stream.Transform.call(this, { objectMode: true })
  this.first = true
}

util.inherits(Arrayify, stream.Transform)

Arrayify.prototype._transform = function (chunk, encoding, next) {
  if (this.first) {
    this.push('[' + JSON.stringify(chunk))
  } else {
    this.push(',' + JSON.stringify(chunk))
  }
  next()
}

Arrayify.prototype._flush = function (done) {
  this.push(']')
  done()
}

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

module.exports = function (dat) {
  return function (req, res) {
    return dat.createReadStream()
              .pipe(new GroupBy)
              .pipe(es.map(function (school, done) {
                done(null, {
                  type: 'Feature',
                  properties: school,
                  geometry: {
                    type: 'Point',
                    coordinates: school['Geospatial C'].split(', ').reverse().map(Number)
                  }
                })
              }))
              .pipe(new Arrayify)
              .pipe(res)
  }
}
