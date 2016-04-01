'use strict';

angular.module('magicApp')
  .controller('MainController', function($scope, $http, $magic) {
    $scope.decks = [];
    $magic.getDecks().success(function(data) {
      $scope.decks = data;
    });
    $('main').on('click', '.deck', function(e) {
    	$(e.target).nextAll('.decklist').slideToggle()
    })
  });

