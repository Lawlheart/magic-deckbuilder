var debugging = true;
function debug(thing) {
	if(debugging) { console.log(thing) }
}
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
.factory('$magic', ['$http', function($http) {
	var $magic = {
		getLegality: function() {
			return $http.get('js/data/legality.json')
			.success(function(data) {
				return data;
			})
			.error(function(err) {
				return err
			});
		},
		getDecks: function() {
			debug("getting decks")
			return $http.get('http://198.199.95.142:6244/')
			.success(function(data) {
				return data
			})
			.error(function(err) {
				return err
			});
		},
		renderDeck: function(deck) {
			var deckObj;
			if(deck.type === "commander") {
				deckObj = new $magic.Deck(deck.name, deck.type, deck.commander);
			} else {
				deckObj = new $magic.Deck(deck.name, deck.type);
			}
			if(deck.cards === undefined) {deck.cards = [];}
			if(deck.commander === undefined) { delete deck.commander}
			var cards = deck.cards;
			for(var i=0;i<cards.length;i++) {
				var mv_id = cards[i];
				deckObj.addCardsByMvid(mv_id);
			}
			return deckObj;
		},
		getData:function() {
			debug("getting data");
			return $http.get('js/data/all-sets.json')
			.success(function(data) {
				database = data;
				return data;
			}).error(function(err) {
				return err;
			});
		}, 
		cardSearch: function(search, set) {
			debug("searching cards");
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
		}, 
		findCardByMvId: function(mv_id) {
			debug("searching by mvid");
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
		},
		convertMana: function(card, mana, remove) {
			debug("converting mana")
			if(card.manaCost !== undefined) {
				var cost = card.manaCost;
				cost = cost.slice(1, -1);
				cost = cost.split("}{");
				for(var i=0;i<cost.length;i++) {
					if(cost[i] === "G") {
						if(!remove) {
							mana.green += 1;
						} else {
							mana.green -= 1;
						}
					}
					if(cost[i] === "R") {
						if(!remove) {
							mana.red += 1;
						} else {
							mana.red -= 1;
						}
					}
					if(cost[i] === "B") {
						if(!remove) {
							mana.black += 1;
						} else {
							mana.black -= 1;
						}
					}
					if(cost[i] === "U") {
						if(!remove) {
							mana.blue += 1;
						} else {
							mana.blue -= 1;
						}
					}
					if(cost[i] === "W") {
						if(!remove) {
							mana.white += 1;
						} else {
							mana.white -= 1;
						}
					}
				}
				return mana;
			}
		},
		Deck: function(name, type, commander) {
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
				debug("Deck: adding cards");
				for(var i=0; i<numbers.length; i++ ) {
					var number = numbers[i];
					if(quantity === undefined) { quantity = 1; }

					//gets card object from JSON database
					var card = $magic.cardSearch(number, set);

					// create card object for this.cards
					this.cards[card.name] = card;
					this.cards[card.name].quantity = quantity;

					//add to this.cardCount
					this.cardCount += card.quantity;

					// add to this.manaCounts
					$magic.convertMana(card, this.manaCounts);

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
				debug("Deck: adding cards by mvid");
				var card = $magic.findCardByMvId(mv_id);
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
				$magic.convertMana(card, this.manaCounts);

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
			this.removeCardsByMvid = function(mv_id) {
				debug("Deck: removing cards by MVID");
				var card = $magic.findCardByMvId(mv_id);
				if(this.cards[card.name] === undefined) {
					return
				}
				if(this.cards[card.name].quantity >= 2) {
					this.cards[card.name].quantity -= 1;
				} else if(this.cards[card.name].quantity === 1) {
					delete this.cards[card.name];
				}
				this.cardCount -= 1;
				$magic.convertMana(card, this.manaCounts, true);
				var types = typeof card.types === "string" ? card.types : card.types.join("_");
				if(types === "Creature" || types === "Land"){
					this.distribution[types] -= 1;
				} else {
					this.distribution.Other -= 1;
				}
				var index = this.deckList.indexOf(card.name);
				this.deckList.splice(index, 1);
			};
			this.draw = function(drawCount) {
				debug("Deck: drawing cards");
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

				debug("Deck: rendering cards");
				var HTML = '<ul class="cards">';
				for(var i=0;i<cards.length;i++) {
					var card = this.cards[cards[i]];
					HTML +="<li><img src='http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + card.multiverseid + "&type=card' alt='" + card.name + "'></li>";
				}
				HTML += "</ul>";
				return HTML;
			};
			this.deckByCmc = function() {

				debug("Deck: calculating CMC");
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

				debug("Deck: calculating mana curve");
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
				debug("Deck: Exporting deck");
				var deck = {};
				deck.name = this.name;
				deck.type = this.deckType;
				if(this.commander !== undefined) {
					deck.commander = this.commander;
				}
				deck.cards = [];
				for(var key in this.cards) {
		      if(this.cards.hasOwnProperty(key)) {
		        deck.cards.push(this.cards[key].multiverseid);
		    	}
				}
				return deck;
			};
		}
	}
	return $magic;
}])
.controller('MainController', ['$scope', function($scope) {
	$('paper-tabs').prop("selected", 0);
}])
.controller('DeckController', ['$scope', '$magic', function ($scope, $magic) {
	$('paper-tabs').prop("selected", 1);
	debug('start deck load');
	$magic.getData().success(function(database) {
		$magic.getDecks().success(function(data) {
			$scope.step = 1;
			$scope.loaded = true;
			console.log(data);
			$scope.decklist = data;	

			$scope.selectDeck = function(deck) {
				$scope.deck = $magic.renderDeck(deck);
				debug($scope.deck)
				$scope.step = 2;
			}
			$scope.draw = function(num) {
				debug($scope.deck.draw(num))
				var HTML = $scope.deck.renderCards($scope.deck.draw(num));
				$('#output').html(HTML);
			}
			$scope.showDeck = function() {
				var HTML = $scope.deck.renderCards($scope.deck.deckList);
				$('#output').html(HTML);
			}
			$scope.showCurve = function() {
				var HTML = $scope.deck.deckByCmc()
				$('#output').html(HTML);
			}

		});
	});
}])
.controller('DeckBuildController', ['$scope', '$magic', function($scope, $magic) {
	$('paper-tabs').prop("selected", 3);
	$scope.debug = false;
	$scope.step = 0;
	$scope.newDeck = {name: "", type: ""};
	$scope.currentDeck = {};
	$scope.currentCard;
	$magic.getData().success(function(data) {
		$scope.step = 1;
		$scope.magic = data;

		$magic.getDecks().success(function(data) {
			$scope.decklist = data;
		});
		//filters by legal cards and cards with multiverseID
		$scope.legalityFilter = function(legality) {
			$magic.getLegality().success(function(data) {
				var legalCards = data[legality];
				for(key in $scope.magic) {
					if($scope.magic.hasOwnProperty(key)) {
						var set = $scope.magic[key];
						set.cards = set.cards.filter(function(card) {
							return legalCards.indexOf(card.name) >= 0 && card.multiverseid !== undefined;
						})
						if(set.cards.length === 0) {
							delete $scope.magic[key]
						}
					}
				}				
				$scope.step = 2;
			})
			.error(function(err) {
				return err
			})
		}
		$scope.selectDeck = function(index) {
			debug($scope.decklist)
			$scope.currentDeck = $magic.renderDeck($scope.decklist[index]);
			debug($scope.currentDeck)
			$scope.step = 0;
			$scope.legalityFilter($scope.currentDeck.deckType);
		}
		$scope.makeDeck = function() {
			if($scope.decklist[$scope.newDeck.name] === undefined) {
				var deck = new $magic.Deck($scope.newDeck.name, $scope.newDeck.type, $scope.newDeck.commander);
				$scope.decklist[$scope.newDeck.name] = deck;
				$scope.currentDeck = deck;
				$scope.step = 0;
				$scope.legalityFilter($scope.currentDeck.deckType);

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
.controller('BlockListController', ['$scope', '$magic', '$routeParams', function ($scope, $magic, $routeParams) {
	$('paper-tabs').prop("selected", 2);
	$magic.getData().success(function(data) {
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
.controller('BlockController', ['$scope', '$magic', '$routeParams', function ($scope, $magic, $routeParams) {
		$('paper-tabs').prop("selected", 2);
		$magic.getData().success(function(data) {
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
				cardFilter(searchParameters());
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

			function cardFilter(searchParameters) {
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
