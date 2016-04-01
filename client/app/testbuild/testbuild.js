'use strict';

angular.module('magicApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('testbuild', {
        url: '/testbuild',
        template: '<testbuild></testbuild>'
      });
  });
