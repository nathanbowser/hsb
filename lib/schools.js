var Arrayify = require('./arrayify')
  , es = require('event-stream')
  , GroupBy = require('./group-by')

var Schools = function (dat) {
  this.dat = dat
}

Schools.prototype.all = function () {
  return this.dat.createReadStream()
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
}

Schools.prototype.get = function (id) {
  return this.dat.createReadStream()
                 .pipe(es.map(function (school, done) {
                   if (school['ULCS No.'] == id) {
                      return done(null, school)
                   }
                   done()
                 }))
}

module.exports = Schools
