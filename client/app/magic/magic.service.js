'use strict';

angular.module('magicApp')
  .service('$magic', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
		var errorHandler = function(err) {
			if(err) {
				throw err;
			}
		};


		var magic = {
			Deck: function(name, type) {
				this.name = name;
				this.type = type;
				this.cards = [];
			}, 
			getLegality: function() {

			},
			getDecks: function() {
				return $http.get('/api/decks/').success(function(data) {
					return data;
				}).error(function(err) {
					return err;
				})
			},
			cardSearch: function(name) {
				return $http.get('/api/cards/search?search=' + encodeURI(name)).success(function(data) {
					return data;
				}).error(function(err) {
					return err;
				});
			},
			getCard: function(multiverseid) {
				return $http.get('/api/cards/' + multiverseid).success(function(data) {
					return data;
				}).error(function(err) {
					return err;
				});
			},
			saveDeck: function(deck) {
				return $http.put('/api/decks/' + deck._id, deck).success(function(data) {
					return data;
				}).error(function(err) {
					return err;
				})
			},
			newDeck: function(deck) {
				return $http.post('/api/decks/', deck).success(function(data) {
					return data;
				}).error(function(err) {
					return err;
				})
			},
			loadDeck: function(deck) {

			}


	};

	magic.Deck.prototype.addCards = function(cards, callback) {
		if(!cards) {
			return;
		}
		var startNum = this.cards.length;
		if(typeof cards === 'string' || typeof cards === 'number') {
			cards = [cards];
		}

		//iterates over cards and calls api on each. last card triggers callback with this.cards
		for(var i=0;i<cards.length;i++) {
			var deck = this;
			$http.get('/api/cards/' + cards[i]).success(function(card) {
				deck.cards.push(card);
				if(deck.cards.length - startNum === cards.length) {
					console.log('final card')
					callback(deck.cards);
				}
			}).error(errorHandler);
		}	
	};

	magic.Deck.prototype.removeCards = function() {
		//removes cards from deck
		var MVIDs = this.cards.map(function(card) {
			console.log(card.multiverseid);
			return card.multiverseid;
		});
		console.log(MVIDs);
	};
	magic.Deck.prototype.draw = function() {
		// randomize and draw cards
	};
	magic.Deck.prototype.renderCards = function() {
		//function for rendering cards on the page... maybe extraneous
	};
	magic.Deck.prototype.analysis = function() {
		//returns cmc, type distribution, mana counts ...
	};
	magic.Deck.prototype.export = function() {
		//generates a decklist of the form:
		// 1x mountain
		// 2x plains ...
	};

	return magic;

});
