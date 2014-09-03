var express = require('express'),
  combine = require('../combine/combine'),
  es = require('event-stream'),
  JSONStream = require('JSONStream'),
  router = express.Router();

router.get('/:baseScheme/:baseDomain/data.json', function(req, res) {
  combine.combineJSONCatalog(req.params.baseScheme + '://' + req.params.baseDomain, 100).then(function(result) {
    res.setHeader("content-type", "application/json");
    es.readArray(result)
      .pipe(JSONStream.stringify())
      .pipe(res);
  });
});

router.get('/', function(req,res) {
  res.render('index', {title: 'combine-data-json-aodp'});
})

module.exports = router;
