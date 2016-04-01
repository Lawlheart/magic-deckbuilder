'use strict';

angular.module('magicApp')
  .controller('BuildCtrl', function ($scope, $http, $magic, Auth) {
    $scope.message = 'Hello';
    var errorHandler = function(err) {
      if(err) {
        throw err;
      }
    };
    var debugging = false;
    var debug = function(message) {
    	if(debugging) {
    		console.log(message);
    	}
    };

		$scope.step = 2;
		$scope.user = Auth.getCurrentUser();
		$scope.selectDeck = function() {
			//chooses a deck from the list and loads it
		};
		$scope.newDeck = function() {
			//creates a new deck using the $magic.Deck consructor
      var deck = new $magic.Deck($scope.newDeckName, $scope.newDeckType);
      deck.user = $scope.user.name;
      deck.userId = $scope.user._id;
      $magic.newDeck(deck).success(function(data) {
        $scope.currentDeck = deck;
      }).error(errorHandler);
		};
		$scope.saveDeck = function() {
			//saves the currentDeck to the mongo database 
      $magic.saveDeck($scope.currentDeck).success(function(data) {
        $scope.currentDeck._id = data._id;
        debug(data);
        alert("Deck Saved Successfully");
      }).error(errorHandler);
		};
    $scope.deckList = function() {
      //shows a list of the current user's decks and loads the selected one.
      $magic.getDecks().success(function(data) {
        debug(data);
        $scope.decklist = data.filter(function(deck) {
          return deck.userId === $scope.user._id;
        });
      }).error(errorHandler);
    };
    $scope.loadDeck = function(deck) {
      $scope.currentDeck = deck;
      $scope.addProtos();
    };
		$scope.cardSearch = function(name) {
			//uses the search api to find cards by name to get multiverseid
			$magic.cardSearch(name).success(function(data) {
				$scope.searchResults = data.results;
			}).error(errorHandler);
		};
		$scope.getCard = function(multiverseid) {
			$magic.getCard(multiverseid).success(function(data) {
				debug(data);
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
				debug(cards);
			});
		};
    $scope.addProtos = function() {
      //Deck methods: addCards, removeCards, draw, renderCards, analysis, export
      $scope.currentDeck.addCards = $magic.Deck.prototype.addCards;
      $scope.currentDeck.addCard = $magic.Deck.prototype.addCard;
      $scope.currentDeck.removeCards = $magic.Deck.prototype.removeCards;
      $scope.currentDeck.draw = $magic.Deck.prototype.draw;
      $scope.currentDeck.renderCards = $magic.Deck.prototype.renderCards;
      $scope.currentDeck.analysis = $magic.Deck.prototype.analysis;
      $scope.currentDeck.export = $magic.Deck.prototype.export;
    };

    $('#cardSearch').submit(function(e) {
      e.preventDefault();
      return false;
    });
  });
