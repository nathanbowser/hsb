var Router = require('routes-router')
  , http = require('http')
  , fs = require('fs')
  , hyperstream = require('hyperstream')
  , Schools = require('./lib/schools')
  , render = require('./lib/render')
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
    res.setHeader('content-type', 'text/css')
    fs.createReadStream(__dirname + '/static/style.css').pipe(res)
  })

  router.addRoute('/school/:id', function (req, res, opts) {
    res.setHeader('content-type', 'text/html')

    var rs = fs.createReadStream(__dirname + '/static/school.html')
      , hs = hyperstream({
               '.deficiencies': schools.get(opts.params.id).pipe(render())
             })

    rs.pipe(hs).pipe(res)
  })

  function index (req, res) {
    fs.createReadStream(__dirname + '/static/index.html').pipe(res)
  }

  router.addRoute('/index.html', index)
  router.addRoute('/', index)

  http.createServer(router).listen(process.env.PORT || 8080)

}
