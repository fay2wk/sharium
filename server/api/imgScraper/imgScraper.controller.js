var scrapers = {}

scrapers['imgur'] = require('./scrapers/imgur.js')
scrapers['fishchan'] = require('./scrapers/fishchan.js')

exports.scrape = function (req, res) {
  var url = req.body.url
  var scraperToUse

  if(url.indexOf('imgur') > -1) {
    scraperToUse = 'imgur'
  }
  if(url.indexOf('fishchannel') > -1) {
    scraperToUse = 'fishchan'
  } else {
    console.log('no scraper')
  }

  scrapers[scraperToUse].list(url, function (data) {
    console.log('data from from scraper:', data)
    res.json(data)
  })
}
