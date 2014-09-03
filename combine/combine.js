var request = require('request'),
  _ = require('lodash'),
  Q = require('q'),
  JSONStream = require('JSONStream'),
  es = require('event-stream');

function getDatasetCount(baseURL) {
  var deferred = Q.defer();
  request({url: baseURL + '/datasets.json', json: true}, function (error, response, body) {
    if (error) {
      deferred.reject(new Error(error));
    } else {
      deferred.resolve(body.metadata.stats.total_count);
    }
  });

  return deferred.promise;
}

function numberOfPages(datasetCount, resultsPerPage) {
  return Math.ceil(datasetCount / resultsPerPage);
}

function combineCatalogStreams(baseURL, pages, page, stream) {
  if (pages == page) {
    return es.merge(
      stream,
      request({url: baseURL + '/data.json?page=' + page})
      .pipe(JSONStream.parse('*')));
  } else {
    return combineCatalogStreams(
      baseURL,
      pages,
      page + 1,
      es.merge(
        stream,
        request({url: baseURL + '/data.json?page=' + page})
        .pipe(JSONStream.parse('*')))
      );
  }
}

function getCatalogStream(baseURL, pages) {
  if (pages == 1) {
    return request({url: baseURL + '/data.json?page=1'})
      .pipe(JSONStream.parse('*'))
  } else {
    return combineCatalogStreams(
      baseURL,
      pages,
      2,
      request({url: baseURL + '/data.json?page=1'})
      .pipe(JSONStream.parse('*')));
  }
}

function combineJSONCatalog(baseURL, resultsPerPage) {
  var deferred = Q.defer();
  getDatasetCount(baseURL).then(function (count) {
    deferred.resolve(getCatalogStream(baseURL, numberOfPages(count, resultsPerPage)));
  });

  return deferred.promise;
}

exports.combineJSONCatalog = combineJSONCatalog;
