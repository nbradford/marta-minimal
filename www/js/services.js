'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('martaMin.services', [])
    .service('marta', ['$http', '$rootScope', 'stations',
        function($http, $rootScope, stations) {
            
            var baseUrl = 'http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals?apikey=';
            var apikey = 'apikey';

            var errorRate = 0;

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
                                })
                                .error(function() {
                                    errorRate += 1;
                                    if (errorRate > 3) {
                                        $rootScope.autoRefresh = false;
                                        errorRate = 0;
                                        alert('Connection to Marta could not be established!');
                                    }
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

                            station.newDirections = new DirectionList();

                        } else if (!updatedList[stationName]) {
                            continue;
                        }

                        station.newDirections[train.DIRECTION].trains.push(train);
                    }

                    for (stationName in scope.stations) {
                        station = scope.stations[stationName];

                        if (!station.directions) {
                            if (!station.newDirections) {
                                station.newDirections = new DirectionList();
                            }

                            station.directions = station.newDirections;
                            continue;
                        }

                        var oldTrain, newTrain, found;

                        for (var direction in station.directions) {
                            for (var i = 0; i < station.directions[direction].trains.length; i++) {
                                oldTrain = station.directions[direction].trains[i];
                                if ((!oldTrain.failures || oldTrain.failures < 10) && oldTrain.WAITING_SECONDS > -30) {
                                    found = false;
                                    for (var j = 0; j < station.newDirections[direction].trains.length; j++) {
                                        newTrain = station.newDirections[direction].trains[j];
                                        if (newTrain.DESTINATION == oldTrain.DESTINATION && 
                                            newTrain.LINE == oldTrain.LINE &&
                                            Math.abs(newTrain.WAITING_SECONDS - oldTrain.WAITING_SECONDS) < 20) {
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        if (!oldTrain.failures) {
                                            oldTrain.failures = 1;
                                        } else {
                                            oldTrain.failures += 1;
                                        }

                                        var i = 0;
                                        for (; i < station.newDirections[direction].trains.length; i++) {
                                            newTrain = station.newDirections[direction].trains[i];
                                            if (oldTrain.WAITING_SECONDS - newTrain.WAITING_SECONDS < 0) {
                                                station.newDirections[direction].trains.splice(i, 0, oldTrain);
                                                i = station.newDirections[direction].trains.length + 1;
                                            } 
                                        }
                                        if (i == station.newDirections[direction].trains.length) {
                                            station.newDirections[direction].trains.push(oldTrain);
                                        }
                                    }
                                }
                            }
                        }

                        station.directions = station.newDirections;
                    }
                }
            };
        }])
    .service('position', [
        function() {

            var position = {
                isNew: true,
                location: false,
                updateLocation: function(location) {
                    this.location = location;
                    this.isNew = true;  
                }
            };

            function getPosition(position) {
                if (navigator.geolocation) {
                    navigator.geolocation.watchPosition(function(location) {
                        position.updateLocation.apply(position, [location]);
                    });
                } else {
                    console.log("geolocation not supported");
                }
            }

            function calculateDistance(station, position) {
                var latDif = position.location.coords.latitude - station.location.latitude;
                var lngDif = position.location.coords.longitude - station.location.longitude;
                return Math.sqrt(Math.pow(latDif, 2) + Math.pow(lngDif, 2));
            }

            $phonegap.doWhenReady(getPosition, [position]);

            return {
                updateDistances: function(scope) {
                    if (position.location && position.isNew) {
                        position.isNew = false;
                        for (var stationName in scope.stations) {
                            var station = scope.stations[stationName];
                            station.distance = calculateDistance(station, position);
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
                        .replace(/ /g,'-');
                },
                retrieve: function(slug) {
                    return slug
                        .replace(/-/g,' ')
                        .toUpperCase();
                }
            };
        }]);

