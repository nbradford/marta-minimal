'use strict';

/* Directives */


angular.module('martaMin.directives', [])
    .directive('stationItem', [
        function() {
            return {
                restrict: 'E',
                templateUrl: 'partials/station-item.html',
                scope: {
                    name: '=',
                    data: '='
                },
            };
        }]);
