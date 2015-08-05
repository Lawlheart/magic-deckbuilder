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