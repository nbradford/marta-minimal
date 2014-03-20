'use strict';

/* Filters */

angular.module('martaMin.filters', [])
    .filter('truncate', [function() {
        return function(input) {
            return Math.floor(input);
        };
    }]);
