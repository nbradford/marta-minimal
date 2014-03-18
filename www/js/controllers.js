'use strict';

/* Controllers */

angular.module('martaMin.controllers', [])
    .controller('HeaderCtrl', ['$scope', '$location',
        function($scope, $location) {
            $scope.isRoot = $location.path().split('/')[1] == "";
        }])
    .controller('ListCtrl', ['$scope', 'marta',
        function($scope, marta) {
            $scope.stations = {};
            marta.initialize(function(data) {
                $scope.stations = data;
            });
            $scope.data;
            marta.getTrains(function(data) {
                console.log("shit is happening");
            });
        }]);