var fs = require('fs')
  , request = require('request')
  , JSONStream = require('JSONStream')
  , reduce = require('stream-reduce')
  , csv = require('fast-csv')

function coords (next) {
  request('https://raw.githubusercontent.com/CityOfPhiladelphia/phl-open-geodata/master/school_facilities/philadelphiaschool_facilities201302.geojson')
    .pipe(JSONStream.parse(['features', true]))
    .pipe(reduce(function (p, c) {
      p[c.properties.facil_id] = c.geometry.coordinates.reverse().join(', ')
      return p
    }, {}))
    .on('data', next)
}

coords(function (locations) {
  var stream = fs.createReadStream(__dirname + '/../data/ieq.csv')
    , unknowns = {}
    , i = 0
  csv.fromStream(stream)
     .transform(function (data){
       if (i++ ===0) {
         data.push('Coordinates')
         return data
       }

       data.push('')
       data.push(locations[data[1]] || '')
       return data
   })
   .validate(function (row) {
      return row[row.length - 1]
   })
   .on('data-invalid', function (r) {
     unknowns[r[0]] = r[1]
   })
   .pipe(csv.createWriteStream({headers: true}))
   .pipe(fs.createWriteStream(__dirname + '/../data/ieq-with-coords.csv'))
   .on('finish', function () {
    console.log('Unable to find locate coords for...')
    console.log(Object.keys(unknowns).join('\n'))
   })
})
