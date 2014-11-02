var Router = require('routes-router')
  , http = require('http')
  , fs = require('fs')
  , Schools = require('./lib/schools')
  , Dat = require('dat')
  , dat = Dat(ready)

function ready () {
  var router = Router()
    , schools = new Schools(dat)

  router.addRoute('/data/philly.geo.json', function (req, res) {
    fs.createReadStream(__dirname + '/data/philly.geo.json').pipe(res)
  })

  router.addRoute('/data/schools.geo.json', function (req, res) {
    schools.all().pipe(res)
  })

  router.addRoute('/style.css', function (req, res) {
    fs.createReadStream(__dirname + '/style.css').pipe(res)
  })

  router.addRoute('/school/:id', function (req, res, opts) {
    schools.get(opts.params.id).pipe(res)
  })

  function index (req, res) {
    fs.createReadStream(__dirname + '/index.html').pipe(res)
  }

  router.addRoute('/index.html', index)
  router.addRoute('/', index)

  http.createServer(router).listen(8080)

}
