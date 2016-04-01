'use strict';
(function(){

function TestbuildComponent($scope, $http, $magic, Auth) {
    var errorHandler = function(err) {
      if(err) {
        throw err;
      }
    };

    //creates a new deck using the $magic.Deck consructor
    var deck = new $magic.Deck("TestDeck", "standard");
    deck.user = "TestUser";
    deck.userId = 1234;
    $scope.currentDeck = deck;

    $scope.cardSearch = function(name) {
      //uses the search api to find cards by name to get multiverseid
      $magic.cardSearch(name).success(function(data) {
        $scope.searchResults = data.results;
      }).error(errorHandler);
    };
    $scope.getCard = function(multiverseid) {
      $magic.getCard(multiverseid).success(function(data) {
        $scope.currentCard = data;
        return data;
      }).error(errorHandler);
    };
    $scope.addCard = function(multiverseid) {
      $scope.currentDeck.addCard(multiverseid, function(cards) {
        console.log($scope.currentDeck);
      });
    };
    $scope.removeCard = function(multiverseid) {
      $scope.currentDeck.removeCards(multiverseid, function(cards) {
        console.log(cards);
      });
    };

    $('#cardSearch').submit(function(e) {
      e.preventDefault();
      return false;
    });
}

angular.module('magicApp')
  .component('testbuild', {
    templateUrl: 'app/testbuild/testbuild.html',
    controller: TestbuildComponent
  });

})();
