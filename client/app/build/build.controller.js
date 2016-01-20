'use strict';

angular.module('magicApp')
  .controller('BuildCtrl', function ($scope, $http, $magic, Auth) {
    $scope.message = 'Hello';
    var errorHandler = function(err) {
      if(err) {
        throw err;
      }
    };

		$scope.step = 2;
    $scope.username = Auth.getCurrentUser().name;
		$scope.selectDeck = function() {
			//chooses a deck from the list and loads it
		};
		$scope.newDeck = function() {
			//creates a new deck using the $magic.Deck consructor
      var deck = new $magic.Deck($scope.newDeckName, $scope.newDeckType);
      deck.user = $scope.username;
      deck._id = deck.user + '-' + deck.name;
      console.log(deck)
      $magic.newDeck(deck).success(function(data) {
        $scope.currentDeck = deck;
        console.log(data);
      }).error(errorHandler);
		};
		$scope.saveDeck = function() {
			//saves the currentDeck to the mongo database 
      var deck = $scope.currentDeck;
      deck.user = $scope.username;
      deck._id = deck.user + '-' + deck.name;
      console.log(deck)
      $magic.saveDeck(deck).success(function(data) {
        console.log(data);
      }).error(errorHandler);

		};
    $scope.deckList = function() {
      //shows a list of the current user's decks and loads the selected one.
      $magic.getDecks().success(function(data) {
        console.log(data);
        $scope.decklist = data.filter(function(deck) {
          return deck.user === $scope.username;
        })
      }).error(errorHandler);
    };
    $scope.loadDeck = function(deck) {
      $scope.currentDeck = deck;
      $scope.addProtos();
    }
		$scope.cardSearch = function(name) {
			//uses the search api to find cards by name to get multiverseid
			$magic.cardSearch(name).success(function(data) {
				$scope.searchResults = data.results;
			}).error(errorHandler);
		};
		$scope.getCard = function(multiverseid) {
			$magic.getCard(multiverseid).success(function(data) {
				console.log(data);
				$scope.currentCard = data;
				return data;
			}).error(errorHandler);
		};
		$scope.addCard = function(multiverseid) {
			$scope.currentDeck.addCards(multiverseid, function(cards) {
        console.log('cards: ', cards);
      });
      console.log($scope.currentDeck)
		};
    $scope.addProtos = function() {
      //Deck methods: addCards, removeCards, draw, renderCards, analysis, export
      $scope.currentDeck.addCards = $magic.Deck.prototype.addCards;
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
