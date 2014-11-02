var hyperspace = require('hyperspace')
  , fs = require('fs')
  , html = fs.readFileSync(__dirname + '/../static/deficiency.html')

module.exports = function () {
  return hyperspace(html, function (doc) {
    return {
      '.deficiency': JSON.stringify(doc)
    }
  })
}
