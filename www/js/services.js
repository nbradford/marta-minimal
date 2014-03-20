'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('martaMin.services', [])
    .service('marta', ['$http', 'stations',
        function($http, stations) {
            var baseUrl = 'http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals?apikey=';
            var apikey = 'api-key';

            function DirectionList() {
                for (var direction in stations.directions) {
                    this[direction] = {
                        display: stations.directions[direction],
                        trains: []
                    };
                }
            }

            return {
                getTrains: function(callback) {
                    return $http.get(baseUrl + apikey)
                                .success(function(data) {
                                    callback(data);
                                });
                },
                updateTrains: function(scope, trains) {
                    var station, train, stationName;
                    var updatedList = {};

                    for (var i = 0; i < trains.length; i++) {
                        train = trains[i];
                        stationName = train.STATION;
                        station = scope.stations[stationName];

                        if (typeof updatedList[stationName] == 'undefined') {
                            updatedList[stationName] = true;

                            if (typeof stations.list[stationName] == 'undefined') {
                                updatedList[stationName] = false;
                                console.log(stationName + ' is not in stations list');
                                continue;
                            }

                            station.directions = new DirectionList();

                        } else if (!updatedList[stationName]) {
                            continue;
                        }

                        station.directions[train.DIRECTION].trains.push(train);
                    }
                }
            };
        }])
    .service('position', [
        function() {
            var position = false;

            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(function(pos) {
                    position = pos;
                    position.isNew = true;
                });
            } else {
                console.log("geolocation not supported");
            }

            function calculateDistance(station) {
                var latDif = position.coords.latitude - station.location.latitude;
                var lngDif = position.coords.longitude - station.location.longitude;
                return Math.sqrt(Math.pow(latDif, 2) + Math.pow(lngDif, 2));
            }

            return {
                updateDistances: function(scope) {
                    if (position && position.isNew) {
                        for (var stationName in scope.stations) {
                            var station = scope.stations[stationName];
                            station.distance = calculateDistance(station);
                        }
                    }
                }
            };
        }])
    .service('slug', [
        function() {
            return {
                create: function(text) {
                    return text
                        .toLowerCase()
                        .replace(/ /g,'-')
                        .replace(/[^\w-]+/g,'');
                }
            };
        }]);

