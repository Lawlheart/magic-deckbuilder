'use strict';

angular.module('magicApp')
  .controller('MainCtrl', function ($scope, Auth ) {
  	$scope.username = Auth.getCurrentUser().name;

  });
