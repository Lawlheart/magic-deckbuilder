'use strict';

angular.module('magicApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('build', {
        url: '/build',
        templateUrl: 'app/build/build.html',
        controller: 'BuildCtrl',
        authenticate: true
      });
  });
