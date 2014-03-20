'use strict';

// Declare app level module which depends on filters, and services
angular.module('martaMin', [
  'ngRoute',
  'martaMin.constants',
  'martaMin.filters',
  'martaMin.services',
  'martaMin.directives',
  'martaMin.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
        templateUrl: 'partials/list.html',
        controller: 'ListCtrl'
    })
    .when('/s/:station', {
        templateUrl: 'partials/station.html',
        controller: 'StationCtrl'
    })
    .when('/map', {
        templateUrl: 'partials/map.html',
        controller: 'MapCtrl'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);
