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
    });
    $routeProvider.otherwise({
        redirectTo: '/'
    });
}]);
