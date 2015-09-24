angular.module('MagicApp', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'MainController',
		templateUrl: 'views/home.html'
	})
	.when('/decks', {
		controller: 'DeckController',
		templateUrl: 'views/deck.html'
	})
	.when('/blocks', {
		controller: 'BlockListController',
		templateUrl: 'views/block-list.html'
	})
	.when('/blocks/:blockId', {
		controller: 'BlockController',
		templateUrl: 'views/block.html'
	})
	.when('/build', {
		controller: 'DeckBuildController',
		templateUrl: 'views/deck-builder.html'
	})
	.otherwise({
		redirectTo: '/'
	});
}])
.factory('magic', ['$http', function($http) {
	return $http.get('js/all-sets.json')
			.success(function(data) {
				database = data;
				return data;
			}).error(function(err) {
				return err;
			});
}])
.factory('$deck', ['$http', 'magic', '$rootScope', function($http, magic, $rootScope) {
	var decklist = {};

	var decks =  $http.get('http://198.199.95.142:6244/')
		.success(function(data) {
			magic.success(function(database) {

				for(var j=0;j<data.length;j++) {
					var deck = data[j];
					var deckObj;
					if(deck.type === "commander") {
						deckObj = new Deck(deck.name, deck.type, deck.commander);
					} else {
						deckObj = new Deck(deck.name, deck.type);
					}
					if(deck.cards === undefined) {deck.cards = [];}
					var cards = deck.cards;
					for(var i=0;i<cards.length;i++) {
						var mv_id = cards[i];
						deckObj.addCardsByMvid(mv_id);
					}
					decklist[deck.name] = deckObj;
				}
				$rootScope.$emit("decks-loaded", decklist);
				console.log(decklist);
				return decklist;
			});
		}).error(function(err) {
			return err;
		});

	return {
		get:function(callback) {
			return decklist;
		}
	};
}])
.controller('MainController', ['$scope', function($scope) {
	$('paper-tabs').prop("selected", 0);
}])
.controller('DeckController', ['$scope', '$deck', 'magic', '$rootScope', function ($scope, $deck, magic, $rootScope) {
		$('paper-tabs').prop("selected", 1);
		$scope.decklist = $deck.get();
		var decklist = $scope.decklist;
		var deck;
		function renderList() {
			for(var deck in decklist) {
        if(decklist.hasOwnProperty(deck)){
        	var deckName = decklist[deck].name;
          var $option = $('<option></option>');
          $option.html(deckName);
          $option.val(deck);
          $option.appendTo($('#deck'));
          $('#deck option:first-child').attr('selected', true);
      	}
			}
		}
		function loadDeck() {
			if($('#deck option:selected').val() !== undefined) {
	    	var selectedDeck = $('#deck option:selected').val();	
				deck = decklist[selectedDeck];
				console.log(deck);
				deck.renderManaCurve();
				console.log("Mana Counts:",deck.manaCounts);
				console.log("Card Count:" + deck.cardCount);
			}			
		}
		if(!$scope.loaded) {
			renderList();
			loadDeck();
		}
		$rootScope.$on('decks-loaded', function(){
			renderList();
			loadDeck();
			$scope.loaded = true;
  	});
		$('#deck').change(function() {
				loadDeck();
		});
		$('#draw').click(function() {
			var HTML = deck.renderCards(deck.draw(7));
			$('#output').html(HTML);
		});
		$('#seeDeck').click(function() {
			var HTML = deck.renderCards(deck.deckList);
			$('#output').html(HTML);
		});
		$('#deckByCmc').click(function() {
			var HTML = deck.deckByCmc();
			$('#output').html(HTML);
		});
}])
.controller('DeckBuildController', ['$scope', 'magic', '$deck', function($scope, magic, $deck) {
	$('paper-tabs').prop("selected", 3);
	$scope.debug = false;
	$scope.step = 0;
	$scope.newDeck = {name: "", type: ""};
	$scope.currentDeck = {};
	$scope.currentCard;
	magic.success(function(data) {
		$scope.step = 1;
		$scope.magic = data;
		// filters set by cards legal in standard, modern, and commander
		for(var key in data) {
      	if(data.hasOwnProperty(key)) {
      	var releaseDate = new Date(data[key].releaseDate);
        if( releaseDate > new Date('2003-10-01') && (data[key].type === "expansion"||data[key].type === "core" || data[key].type === "commander" || data[key].type === "duel deck") ) {
          $scope.magic[key] = data[key];
        }
    	}
		}

		$scope.decklist = $deck.get();
		$scope.selectDeck = function(name) {
			console.log(name)
			$scope.currentDeck = $scope.decklist[name];
			console.log($scope.currentDeck)
			$scope.step = 2;
		}
		$scope.makeDeck = function() {
			if($scope.decklist[$scope.newDeck.name] === undefined) {
				var deck = new Deck($scope.newDeck.name, $scope.newDeck.type, $scope.newDeck.commander);
				$scope.decklist[$scope.newDeck.name] = deck;
				$scope.currentDeck = deck;
				$scope.step = 2;
			} else {
				alert($scope.deckName + " already exists");
			}
			console.log($scope.currentDeck);
		};
		$scope.addCard = function(mvid) {
			if($scope.currentDeck !== undefined) {
				$scope.currentDeck.addCardsByMvid(mvid);
			}
		}
		$scope.removeCard = function(mvid) {
			if($scope.currentDeck !== undefined) {
				$scope.currentDeck.removeCardsByMvid(mvid);
			}
		}
		$scope.changeCard = function(card) {
			$scope.currentCard = card;
			console.log("changing to", card);
			$("#cardImage").sticky({topSpacing:0});	
		}
		$scope.saveDeck = function() {
			var deck = $scope.currentDeck;
			var deckObj = deck.exportDeck();
			console.log(deckObj);
			$.ajax({
				method:"POST",
				url: 'http://198.199.95.142:6244/deck',
				data: JSON.stringify(deckObj)
			})
			.done(function(msg) {
				alert("Deck Saved:" + msg);
			});
		};
		$scope.filterBySet = function(name) {
			$scope.setFilter = name;
		}

	});
}])
.controller('BlockListController', ['$scope', 'magic', '$routeParams', function ($scope, magic, $routeParams) {
	$('paper-tabs').prop("selected", 2);
	magic.success(function(data) {
		$scope.blocks = data;
		console.log(data);
		var blocks = $scope.blocks;
		$scope.blockList = [[
				blocks.DTK, 
				blocks.FRF, 
				blocks.KTK
				],[
				blocks.JOU,
				blocks.BNG,
				blocks.THS
				],[
				blocks.DGM,
				blocks.GTC,
				blocks.RTR
				],[
				blocks.AVR,
				blocks.DKA,
				blocks.ISD
				],[
				blocks.NPH,
				blocks.MBS,
				blocks.SOM
				],[
				blocks.ROE,
				blocks.WWK,
				blocks.ZEN
				],[
				blocks.ARB,
				blocks.CON,
				blocks.ALA
		]];
	});
}])
.controller('BlockController', ['$scope', 'magic', '$routeParams', function ($scope, magic, $routeParams) {
		$('paper-tabs').prop("selected", 2);
		magic.success(function(data) {
			$scope.set = data[$routeParams.blockId];
			console.log($scope.set);

			//starting code for deckbuilding
			var cardList = [];
			$('ul.cards').on('click', 'img.cardImage', function() {
				var card_id = $(this).attr('data-mvid');
				cardList.push(card_id);
				console.log(card_id);
				console.log(cardList);
			});

			//event handler for mana type checkboxes
			$('#search input').click(function() {
				console.log(searchParameters());
				cardSearch(searchParameters());
			});

			//retrieves checked boxes and returns an object representing the search parameters
			function searchParameters() {
				var search = {};
				$('#search input').each(function() {
					var color = $(this).prop('id');
					var isChecked = $(this).prop('checked');
					search[color] = isChecked;
				});
				return search;
			}

			function cardSearch(searchParameters) {
				var $cards = $('.card');
				$cards.hide();

				//loop over cards in set
				for(var key in $scope.set.cards) {
					if($scope.set.cards.hasOwnProperty(key)) {
						var card = $scope.set.cards[key];
						if(card.colors !== undefined ) {
							
							//checks card colors vs the search parameters
							for(var color in searchParameters) {
								if(searchParameters[color] && color !== 'multicolored') {
									if(card.colors.length === 1 && card.colors[0] === color) {
										//finds search results on the page and shows them
										$cards.each(function(){
											if(parseInt($(this).attr('data-mvid')) === card.multiverseid) {
												$(this).show();
											}
										});
									}
								} else if(searchParameters[color] && color === 'multicolored') {
									var showCard = true;
									//loop over colors on the card (already looping each card)
									if(card.colors.length > 1) {
										for(var i=0;i<card.colors.length;i++) {
											var manaColor = card.colors[i];
											if(searchParameters[manaColor] === false) {
												showCard = false;
											}
										}
										if(showCard) {
											$cards.each(function(){
												if(parseInt($(this).attr('data-mvid')) === card.multiverseid) {
													$(this).show();
												}
											});
										}
									}
								}
							}		
						}
					}
				}
			}
		});
}])
