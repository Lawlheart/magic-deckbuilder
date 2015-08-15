	app.controller('SearchController', ['$scope', 'magic', 'deckManager', function($scope, magic, deckManager) {
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
			deckManager.success(function(data) {
				$scope.decks = data;
				console.log($scope.decks.animar)
			});
			$('body').on('click', '#newDeck', function() {
				
				if($scope.decks[$scope.deckName] === undefined) {
					$scope.decks[$scope.deckName] = new Deck($scope.deckType, $scope.commanderName);
				} else {
					alert($scope.deckName + " already exists")
				}
				console.log($scope.decks)
			});
			$('body').on('click', '.addCard', function(e) {
				var setcode = e.target.getAttribute('data-setcode');
				var cardnumber = e.target.getAttribute('data-cardnumber')
				cardnumber = parseInt(cardnumber)
				var deck = $scope.decks[$scope.deckName];
				deck.addCards([cardnumber], setcode);
				console.log(deck)
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