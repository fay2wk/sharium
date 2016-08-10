var scrapers = {}

scrapers['imgur'] = require('./scrapers/imgur.js')

exports.scrape = function (req, res) {
  var url = req.body.url
  var scraperToUse

  if(url.indexOf('imgur') > -1) {
    scraperToUse = 'imgur'
  } else {
    console.log('no scraper')
  }

  scrapers[scraperToUse].list(url, function (data) {
    console.log('data from from scraper:', data)
    res.json(data)
  })
}
