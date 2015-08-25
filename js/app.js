var app = angular.module('MagicApp', ['ngRoute']);
app.factory('magic', ['$http', function($http) {
	return $http.get('js/all-sets.json')
			.success(function(data) {
				return data;
			}).error(function(err) {
				return err;
			});
}]);
app.factory('decks', ['$http', 'magic', '$rootScope', function($http, magic, $rootScope) {
	var decklist = {};

	var decks =  $http.get('http://localhost:6244/')
		.success(function(data) {
			magic.success(function(database) {

				for(var j=0;j<data.length;j++) {
					var deck = data[j]
					console.log(deck)
					var deckObj;
					if(deck.type === "commander") {
						deckObj = new Deck(deck.name, deck.type, deck.commander);
					} else {
						deckObj = new Deck(deck.name, deck.type);
					}
					if(deck.cards === undefined) {deck.cards = []}
					var cards = deck.cards;
					for(var i=0;i<cards.length;i++) {
						// console.log(cards[i]);
						var mv_id = cards[i];
						deckObj.addCardsByMvid(mv_id);
					}
					
					decklist[deck.name] = deckObj
				}
				$rootScope.$emit("decks-loaded", decklist);
				return decklist
			});
		}).error(function(err) {
			return err
		});

	return {
		get:function(callback) {
			return decklist
		}
	}
}]);
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
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
	})
}]);
app.controller('DeckController', ['$scope', '$routeParams', 'decks', 'magic', '$rootScope', function ($scope, $routeParams, decks, magic, $rootScope) {
		$scope.decklist = decks.get();
		var decklist = $scope.decklist
		function renderList() {
			for(var deck in decklist) {
				var deckName = decklist[deck].commander;
				var $option = $('<option></option>');
				$option.html(deckName);
				$option.val(deck);
				$option.appendTo($('#deck'));
				$('#deck option:first-child').attr('selected', true);
			}
		}
		function loadDeck() {
			if($('#deck option:selected').val() !== undefined) {
	    	var selectedDeck = $('#deck option:selected').val();	
				deck = decklist[selectedDeck];
				console.log(deck)
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
}]);
app.controller('DeckBuildController', ['$scope', 'magic', 'decks', function($scope, magic, decks) {
		magic.success(function(data) {
			$scope.magic = {};
			console.log(data)
			for(key in data) {
				var releaseDate = new Date(data[key].releaseDate);
				if( releaseDate > new Date('2003-10-01') && (data[key].type === "expansion"||data[key].type === "core" || data[key].type === "commander" || data[key].type === "duel deck") ) {
					$scope.magic[key] = data[key];
				}
			}
			$('body').on('click', 'li.card', function(e) {
				var mv_id = e.target.getAttribute('data-mvid');
				var setcode = e.target.getAttribute('data-setcode');
				var cardnumber = e.target.getAttribute('data-cardnumber')
				var $image = $('<img src="http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=' + mv_id +'&amp;type=card" alt=""><button class="addCard" data-mvid="' + mv_id +'" data-setcode="' + setcode +'" data-cardnumber="' + cardnumber + '">Add</button><button class="removeCard"  data-mvid="' + mv_id +'" data-setcode="' + setcode +'" data-cardnumber="' + cardnumber + '">Remove</button>')
				$('#cardImage').html($image)
			});
			console.log($scope.magic)
			$("#cardImage").sticky({topSpacing:0});
		});
		$scope.decklist = decks.get();
		$('body').on('click', '#newDeck', function() {
			if($scope.decklist[$scope.deckName] === undefined) {
				$scope.decklist[$scope.deckName] = new Deck($scope.deckName, $scope.deckType, $scope.commanderName);
			} else {
				alert($scope.deckName + " already exists")
			}
			console.log($scope.decklist)
		});
		$('body').on('click', '.addCard', function(e) {
			var setcode = e.target.getAttribute('data-setcode');
			var cardnumber = e.target.getAttribute('data-cardnumber')
			cardnumber = parseInt(cardnumber)
			var deck = $scope.decklist[$scope.deckName];
			deck.addCards([cardnumber], setcode);
			console.log(deck)
		});
		$('body').on('click', '#saveDeck', function(e) {
			var deck = $scope.decklist[$scope.deckName];
			var deckObj = deck.exportDeck();
			console.log(deckObj)
			$.ajax({
				method:"POST",
				url: 'http://localhost:6244/deck',
				data: JSON.stringify(deckObj)
			})
			.done(function(msg) {
				alert("Deck Saved:" + msg)
			})
		});
		$('body').on('click', '.removeCard', function(e) {

		});
		function findCardByMvId(mv_id) {
			for(var key in $scope.magic) {
				var set = $scope.magic[key]
				for(var key in set.cards) {
					var card = set.cards[key];
					if(card.multiverseid === mv_id) {
						return card;
					}
				}
			}
		}
}]);
app.controller('BlockListController', ['$scope', 'magic', '$routeParams', function ($scope, magic, $routeParams) {
	magic.success(function(data) {
		$scope.blocks = data;
		console.log(data)
		var blocks = $scope.blocks
		$scope.blockList = [[
				blocks["DTK"], 
				blocks["FRF"], 
				blocks["KTK"]
				],[
				blocks["JOU"],
				blocks["BNG"],
				blocks["THS"]
				],[
				blocks["DGM"],
				blocks["GTC"],
				blocks["RTR"]
				],[
				blocks["AVR"],
				blocks["DKA"],
				blocks["ISD"]
				],[
				blocks["NPH"],
				blocks["MBS"],
				blocks["SOM"]
				],[
				blocks["ROE"],
				blocks["WWK"],
				blocks["ZEN"]
				],[
				blocks["ARB"],
				blocks["CON"],
				blocks["ALA"]
		]];
		console.log($scope.blockList[0])

	});
}]);
app.controller('BlockController', ['$scope', 'magic', '$routeParams', function ($scope, magic, $routeParams) {
		magic.success(function(data) {
			$scope.set = data[$routeParams.blockId];
			console.log($scope.set);

			//starting code for deckbuilding
			var cardList = []
			$('ul.cards').on('click', 'img.cardImage', function() {
				var card_id = $(this).attr('data-mvid');
				cardList.push(card_id);
				console.log(card_id)
				console.log(cardList)
			});

			//event handler for mana type checkboxes
			$('#search input').click(function() {
				console.log(searchParameters())
				cardSearch(searchParameters())
			})

			//retrieves checked boxes and returns an object representing the search parameters
			function searchParameters() {
				var searchParameters = {}
				$('#search input').each(function() {
					var color = $(this).prop('id');
					var isChecked = $(this).prop('checked');
					searchParameters[color] = isChecked;
				});
				return searchParameters;
			};

			function cardSearch(searchParameters) {
				var $cards = $('.card');
				$cards.hide();

				//loop over cards in set
				for(var key in $scope.set.cards) {
					var card = $scope.set.cards[key];
					if(card.colors !== undefined ) {
						
						//checks card colors vs the search parameters
						for(color in searchParameters) {
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



		});
}]);
app.directive('navBar', function() {
	return {
		restrict: 'E',
		templateUrl: 'js/directives/navBar.html',
		link: function($scope, $element, $attrs) {
			
			$scope.blink = function(navNum) {
				console.log("BLINK!")
				$('.nav1').addClass('blink')
			}
		}
	}
});