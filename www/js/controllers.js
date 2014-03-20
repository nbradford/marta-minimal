'use strict';

/* Controllers */

angular.module('martaMin.controllers', [])
    .controller('HeaderCtrl', ['$scope', '$rootScope', '$location',
        function($scope, $rootScope, $location) {

            $scope.pathBase = '';
            $scope.$on('$routeChangeSuccess', function() {
                $scope.pathBase = $location.path().split('/')[1];
            });

            $rootScope.autoRefresh = false;

            $scope.toggleRefresh = function() {
                $rootScope.autoRefresh = !$rootScope.autoRefresh;
            };
        }])
    .controller('ListCtrl', ['$scope', '$rootScope', 'marta', 'position', 'stations', 'slug',
        function($scope, $rootScope, marta, position, stations, slug) {
            $scope.stations = stations.list;
            $scope.stationList = [];

            $scope.convertStationsToList = function() {
                var found, oldSlug;
                for (var station in $scope.stations) {
                    found = false;
                    for (var i = 0; i < $scope.stationList.length; i++) {
                        if ($scope.stationList[i].name == station) {
                            oldSlug = $scope.stationList[i].slug;
                            $scope.stationList[i] = $scope.stations[station];
                            $scope.stationList[i].name = station;
                            $scope.stationList[i].slug = oldSlug;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        $scope.stationList.push($scope.stations[station]);
                        $scope.stationList[$scope.stationList.length - 1].name = station;
                        $scope.stationList[$scope.stationList.length - 1].slug = slug.create(station);
                    }
                }
            };

            $scope.updateTrains = function() {
                marta.getTrains(function(trains) {
                    marta.updateTrains($scope, trains);
                    position.updateDistances($scope);
                    $scope.convertStationsToList();
                });
            };

            $scope.checkRefresh = function() {
                if ($rootScope.autoRefresh) {
                    $scope.updateRefresh = window.setInterval($scope.updateTrains, 2500);
                } else {
                    if ($scope.updateRefresh) {
                        clearInterval($scope.updateRefresh);
                    }
                    $scope.updateRefresh = false;
                }
            };

            $rootScope.$watch('autoRefresh', function() {
                $scope.checkRefresh();
            });

            $scope.updateTrains();
        }])
    .controller('StationCtrl', ['$scope', '$rootScope', '$routeParams', 'marta', 'stations', 'slug',
        function($scope, $rootScope, $routeParams, marta, stations, slug) {
            $scope.stations = stations.list;
            $scope.stationName = slug.retrieve($routeParams.station);
            $scope.station = $scope.stations[$scope.stationName];
            $scope.directions = stations.directions;

            $scope.updateTrains = function() {
                marta.getTrains(function(trains) {
                    marta.updateTrains($scope, trains);
                });
            };

            $scope.checkRefresh = function() {
                if ($rootScope.autoRefresh) {
                    $scope.updateRefresh = window.setInterval($scope.updateTrains, 2500);
                } else {
                    if ($scope.updateRefresh) {
                        clearInterval($scope.updateRefresh);
                    }
                    $scope.updateRefresh = false;
                }
            };

            $rootScope.$watch('autoRefresh', function() {
                $scope.checkRefresh();
            });

            $scope.updateTrains();
        }])
    .controller('MapCtrl', ['$scope', 'position',
        function($scope, position) {

        }]);