'use strict';

angular.module('magicApp')
  .service('$magic', function ($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
		var errorHandler = function(err) {
			if(err) {
				throw err;
			}
		};

		var BASIC_LANDS = ["Forest", "Mountain", "Island", "Plains", "Swamp"];

		var magic = {
			Deck: function(name, type) {
				this.name = name;
				this.type = type;
				this.cards = [];
			}, 
			getLegality: function() {

			},
			isLegalDeck: function(deck) {
				console.log("checking legality");
				console.log(deck.type);
			},
			getDecks: function() {
				return $http.get('/api/decks/').success(function(data) {
					return data;
				}).error(function(err) {
					return err;
				});
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
				});
			},
			newDeck: function(deck) {
				return $http.post('/api/decks/', deck).success(function(data) {
					return data;
				}).error(function(err) {
					return err;
				});
			},
			loadDeck: function(deck) {
				console.log(deck);
			}


	};

	magic.Deck.prototype.addCard = function(multiverseid, callback) {
		var deck = this;
		var copyLimit = this.type === "standard" ? 4 : 1;
		$http.get('/api/cards/' + multiverseid).success(function(card) {
			var copies = deck.cards.filter((c) => c.name == card.name).length;
			if(BASIC_LANDS.indexOf(card.name) >= 0 || copies + 1 <= copyLimit) {
				deck.cards.push(card);
			}
				callback(deck.cards);
			}).error(errorHandler);
	}

	magic.Deck.prototype.addCards = function(cards, callback) {
		if(!cards) {
			return;
		}
		if(typeof cards === 'string' || typeof cards === 'number') {
			cards = [cards];
		}
		var startNum = this.cards.length;
		var deck = this;
		var copyLimit = this.type === "standard" ? 4 : 1;
		//iterates over cards and calls api on each. last card triggers callback with this.cards
		for(let i=0;i<cards.length;i++) {
			$http.get('/api/cards/' + cards[i]).success(function(card) {
				var copies = deck.cards.filter((c) => c.name == card.name).length;
				if(BASIC_LANDS.indexOf(card.name) >= 0 || copies + 1 <= copyLimit) {
					deck.cards.push(card);
				}
				if(i === cards.length - 1) {
					callback(deck.cards);
				}
			}).error(errorHandler);
		}	
	};

	magic.Deck.prototype.removeCards = function(mvid) {
		//removes cards from deck
		var MVIDs = this.cards.map(function(card) {
			return card.multiverseid;
		});
		if(MVIDs.indexOf(mvid) >= 0) {
			this.cards.splice(MVIDs.indexOf(mvid), 1);
		}
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
