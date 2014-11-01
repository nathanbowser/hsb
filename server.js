var Router = require('routes-router')
  , http = require('http')
  , fs = require('fs')
  , Schools = require('./lib/schools')
  , Dat = require('dat')
  , dat = Dat(ready)

function ready () {
  var router = Router()
    , schools = Schools(dat)

  router.addRoute('/data/philly.geo.json', function (req, res) {
    fs.createReadStream(__dirname + '/data/philly.geo.json').pipe(res)
  })

  router.addRoute('/data/schools.geo.json', schools)

  function index (req, res) {
    fs.createReadStream(__dirname + '/index.html').pipe(res)
  }

  router.addRoute('/index.html', index)
  router.addRoute('/', index)

  http.createServer(router).listen(8080)

}
