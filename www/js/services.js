'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('martaMin.services', [])
    .service('marta', ['$http',
        function($http) {
            var baseUrl = 'http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals?json_callback=JSON_CALLBACK&apikey=';
            var apikey = 'api-key';
            return {
                initialize: function(callback) {
                    return $http.get('data/stations.json')
                                .success(function(data) {
                                    callback(data);
                                });
                },
                getTrains: function(callback) {
                    return $http.jsonp(baseUrl + apikey)
                                .success(function(data) {
                                    console.log('hello');
                                    callback(data);
                                })
                                .error(function(data) {
                                    console.log('no');
                                });
                }
            };
        }]);

