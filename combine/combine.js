var request = require('request'),
  _ = require('lodash'),
  Q = require('q'); 

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

function combineRequest(baseURL, page) {
  var deferred = Q.defer();
  request({url: baseURL + '/data.json?page=' + page, json: true}, function (error, response, body) {
    if (error) {
      deferred.reject(new Error(error));
    } else {
      deferred.resolve(body);
    }
  });

  return deferred.promise;
}

function combineRequests(baseURL, pages) {
  return Q.all(_.map(_.range(1, pages + 1), function(i) {
    return combineRequest(baseURL, i);
  })).then(function(j) {
    return _.flatten(j, true);
  });
}

function combineJSONCatalog(baseURL, resultsPerPage) {
  var deferred = Q.defer();
  getDatasetCount(baseURL).then(function (count) {
    deferred.resolve(combineRequests(baseURL, numberOfPages(count, resultsPerPage)));
  });

  return deferred.promise;
}

exports.combineJSONCatalog = combineJSONCatalog;
