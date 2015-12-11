'use strict';

angular.module('magicApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/build', {
        templateUrl: 'app/build/build.html',
        controller: 'BuildCtrl',
        authenticate: true
      });
  });
