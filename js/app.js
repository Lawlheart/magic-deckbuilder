var database;
var debug = false;

function test(message) {
	if(debug) {
		console.log(message);
	}
}


function cardSearch(search, set) {
	test(search, set);
	var cardset = database[set.toUpperCase()].cards;
	for(var key in cardset) {
    if(cardset.hasOwnProperty(key)) {
      var card = cardset[key];
      if(typeof search === "string") {
        if(search === card.name) {
          return JSON.parse(JSON.stringify(card));
        }
      } else if(typeof search === "number") {
        if(search == card.number) {
          return JSON.parse(JSON.stringify(card));
        }
      }
    } 
  }
}
function findCardByMvId(mv_id) {
	for(var key in database) {
    if(database.hasOwnProperty(key)) {
      var set = database[key];
      for(var cardkey in set.cards) {
        if(set.cards.hasOwnProperty(cardkey)) {
          var card = set.cards[cardkey];
          if(card.multiverseid === mv_id) {
            return card;
          }
        }
      }
    }
	}
}
function convertMana(card, mana) {
	if(card.manaCost !== undefined) {
		var cost = card.manaCost;
		cost = cost.slice(1, -1);
		cost = cost.split("}{");
		for(var i=0;i<cost.length;i++) {
			if(cost[i] === "G") {
				mana.green += 1;
			}
			if(cost[i] === "R") {
				mana.red += 1;
			}
			if(cost[i] === "B") {
				mana.black += 1;
			}
			if(cost[i] === "U") {
				mana.blue += 1;
			}
			if(cost[i] === "W") {
				mana.white += 1;
			}
		}
		return mana;
	}
}
function Deck(name, type, commander) {
	this.name = name;
	this.deckType = type;
	this.commander = commander;
	this.deckList = [];
	this.cards = {};
	this.cardCount = 0;
	this.distribution = {
		Creature: 0,
		Land: 0,
		Other: 0
	};
	this.manaCounts = {
		green: 0,
		red: 0,
		black: 0,
		blue: 0,
		white: 0
	};
	this.addCards = function(numbers, set, quantity) {
		//iterate over each card number
		for(var i=0; i<numbers.length; i++ ) {
			var number = numbers[i];
			if(quantity === undefined) { quantity = 1; }

			//gets card object from JSON database
			var card = cardSearch(number, set);

			// create card object for this.cards
			this.cards[card.name] = card;
			this.cards[card.name].quantity = quantity;

			//add to this.cardCount
			this.cardCount += card.quantity;

			// add to this.manaCounts
			convertMana(card, this.manaCounts);

			//add to this.distribution
			var types = typeof card.types === "string" ? card.types : card.types.join("_");
			if(types === "Creature" || types === "Land"){
				this.distribution[types] += card.quantity;
			} else {
				this.distribution.Other += card.quantity;
			}

			//add to this.deckList
			for(var j=0;j<quantity;j++) {
				this.deckList.push(card.name);
			}
		}
	};
	this.addCardsByMvid = function(mv_id) {
		var card = findCardByMvId(mv_id);
		// create card object for this.cards
		
		if(this.cards[card.name] === undefined) {
			this.cards[card.name] = card; 
			this.cards[card.name].quantity = 1;
		} else {
			this.cards[card.name].quantity += 1;
		}

		//add to this.cardCount
		this.cardCount += 1;

		// add to this.manaCounts
		convertMana(card, this.manaCounts);

		//add to this.distribution
		var types = typeof card.types === "string" ? card.types : card.types.join("_");
		if(types === "Creature" || types === "Land"){
			this.distribution[types] += 1;
		} else {
			this.distribution.Other += 1;
		}

		//add to this.deckList
		this.deckList.push(card.name);
	};
	this.draw = function(drawCount) {
		var deck = this.deckList;

		//removes the commander from the deck
		if(this.deckType === "commander") {
			var index = deck.indexOf(this.commander);
			deck = deck.slice(0,index).concat(deck.slice(index+1));
		}
		//randomizes the deck
		var shuffledDeck = [];
		var deckSize = deck.length;
		for(var i=0;i<deckSize;i++) {
			var random = Math.floor(Math.random()*deck.length);
			shuffledDeck.push(deck[random]);
			deck = deck.slice(0,random).concat(deck.slice(random+1));
		}
		//draws cards
		var cardDraw = shuffledDeck.slice(0,drawCount);
		return cardDraw;
	};
	this.renderCards = function(cards) {
		var HTML = '<ul class="cards">';
		for(var i=0;i<cards.length;i++) {
			var card = this.cards[cards[i]];
			HTML +="<li><img src='http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + card.multiverseid + "&type=card' alt='" + card.name + "'></li>";
		}
		HTML += "</ul>";
		return HTML;
	};
	this.deckByCmc = function() {
		var deck = this.deckList;
		var HTML = "";
		for(var mana = 1;mana<9;mana++) {
			HTML += "<div class='cmc-sort'>";
			HTML += '<h1 class="manaTitle">Mana Cost: ' + mana + '</h1>';
			var sorted = [];
			for(var i=0;i<deck.length;i++) {
				var card = this.cards[deck[i]];
				if(card.cmc === mana) {
					sorted.push(deck[i]);
				}
			}
			HTML += this.renderCards(sorted);
			HTML += "</div>";
		}
		return HTML;
	};
	this.renderManaCurve = function() {
		var curve = {};
		var totalMana = 0;
		var totalCards = 0;
		for(var key in this.cards) {
      if(this.cards.hasOwnProperty(key)) {
        var card = this.cards[key];
        if(curve[card.cmc] !== undefined && card.cmc !== undefined) {
          curve[card.cmc] += card.quantity;
          totalMana += card.cmc;
          totalCards ++;
        } else if(card.cmc !== undefined) {
          curve[card.cmc] = card.quantity;
          totalMana += card.cmc;
          totalCards ++;
        }
    	}
		}
		var average = totalMana/totalCards;
		console.log("Mana Curve: ", curve);
		console.log("Average CMC: " + average);
		return curve;
	};
	this.exportDeck = function() {
		var deck = {};
		deck.name = this.name;
		deck.type = this.deckType;
		deck.commander = this.commander;
		deck.cards = [];
		for(var key in this.cards) {
      if(this.cards.hasOwnProperty(key)) {
        deck.cards.push(this.cards[key].multiverseid);
    	}
		}
		return deck;
	};
}



var app = angular.module('MagicApp', ['ngRoute']);

app.factory('magic', ['$http', function($http) {
	return $http.get('js/all-sets.json')
			.success(function(data) {
				database = data;
				return data;
			}).error(function(err) {
				return err;
			});
}]);
app.factory('decks', ['$http', 'magic', '$rootScope', function($http, magic, $rootScope) {
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
	});
}]);
app.controller('DeckController', ['$scope', '$routeParams', 'decks', 'magic', '$rootScope', function ($scope, $routeParams, decks, magic, $rootScope) {
		$scope.decklist = decks.get();
		var decklist = $scope.decklist;
		var deck;
		function renderList() {
			for(var deck in decklist) {
        if(decklist.hasOwnProperty(deck)){
        	var deckName = decklist[deck].commander;
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
}]);
app.controller('DeckBuildController', ['$scope', 'magic', 'decks', function($scope, magic, decks) {
		magic.success(function(data) {
			$scope.magic = {};
			test(data);
			for(var key in data) {
        	if(data.hasOwnProperty(key)) {
        	var releaseDate = new Date(data[key].releaseDate);
          if( releaseDate > new Date('2003-10-01') && (data[key].type === "expansion"||data[key].type === "core" || data[key].type === "commander" || data[key].type === "duel deck") ) {
            $scope.magic[key] = data[key];
          }
      	}
			}
			$('body').on('click', 'li.card', function(e) {
				var mv_id = e.target.getAttribute('data-mvid');
				var setcode = e.target.getAttribute('data-setcode');
				var cardnumber = e.target.getAttribute('data-cardnumber');
				var $image = $('<img src="http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=' + mv_id +'&amp;type=card" alt=""><button class="addCard" data-mvid="' + mv_id +'" data-setcode="' + setcode +'" data-cardnumber="' + cardnumber + '">Add</button><button class="removeCard"  data-mvid="' + mv_id +'" data-setcode="' + setcode +'" data-cardnumber="' + cardnumber + '">Remove</button>');
				$('#cardImage').html($image);
			});
			$("#cardImage").sticky({topSpacing:0});
		});
		$scope.decklist = decks.get();
		$('body').on('click', '#newDeck', function() {
			if($scope.decklist[$scope.deckName] === undefined) {
				$scope.decklist[$scope.deckName] = new Deck($scope.deckName, $scope.deckType, $scope.commanderName);
			} else {
				alert($scope.deckName + " already exists");
			}
			console.log($scope.decklist);
		});
		$('body').on('click', '.addCard', function(e) {
			var setcode = e.target.getAttribute('data-setcode');
			var cardnumber = e.target.getAttribute('data-cardnumber');
			cardnumber = parseInt(cardnumber);
			var deck = $scope.decklist[$scope.deckName];
			if(deck !== undefined) {
				deck.addCards([cardnumber], setcode);
			}
			test(deck);
		});
		$('body').on('click', '#saveDeck', function(e) {
			var deck = $scope.decklist[$scope.deckName];
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
		});
		$('body').on('click', '.removeCard', function(e) {

		});
}]);
app.controller('BlockListController', ['$scope', 'magic', '$routeParams', function ($scope, magic, $routeParams) {
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
		test($scope.blockList);
	});
}]);
app.controller('BlockController', ['$scope', 'magic', '$routeParams', function ($scope, magic, $routeParams) {
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
}]);
