function cardSearch(search, set) {
	var cardset = database[set.toUpperCase()].cards;
	for(key in cardset) {
		var card = cardset[key];
		if(typeof search === "string") {
			if(search === card.name) {
				return card;
			}
		} else if(typeof search === "number") {
			if(search == card.number) {
				return card
			}
		}
	}
}
function convertMana(card, mana) {
	if(card.manaCost !== undefined) {
		var cost = card.manaCost;
		cost = cost.slice(1, -1);
		cost = cost.split("}{")
		for(var i=0;i<cost.length;i++) {
			if(cost[i] === "G") {
				mana["Green"] += 1
			};
			if(cost[i] === "R") {
				mana["Red"] += 1
			};
			if(cost[i] === "B") {
				mana["Black"] += 1
			};
			if(cost[i] === "U") {
				mana["Blue"] += 1
			};
			if(cost[i] === "W") {
				mana["White"] += 1
			}
		}
		return mana
	}
}
function Deck(type, commander) {
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
		Green: 0,
		Red: 0,
		Black: 0,
		Blue: 0,
		White: 0
	}
	this.addCards = function(numbers, set, quantity) {
		//iterate over each card number
		for(var i=0; i<numbers.length; i++ ) {
			number = numbers[i];
			if(quantity === undefined) { quantity = 1 }

			//gets card object from JSON database
			var card = cardSearch(number, set);

			// create card object for this.cards
			this.cards[card.name] = card;
			this.cards[card.name].quantity = quantity;
			this.cards[card.name].inDeck = true;

			//add to this.cardCount
			this.cardCount += card.quantity;

			// add to this.manaCounts
			convertMana(card, this.manaCounts);

			//add to this.distribution
			var types = typeof card.types === "string" ? card.types : card.types.join("_");
			if(types === "Creature" || types === "Land"){
				this.distribution[types] += card.quantity;
			} else {
				this.distribution["Other"] += card.quantity;
			}

			//add to this.deckList
			for(var j=0;j<quantity;j++) {
				this.deckList.push(card.name);
			}
		}
	}
	this.draw = function(drawCount) {
		var deck = this.deckList

		//removes the commander from the deck
		if(this.deckType === "commander") {
			var index = deck.indexOf(this.commander);
			deck = deck.slice(0,index).concat(deck.slice(index+1))
		}
		//randomizes the deck
		var shuffledDeck = []
		var deckSize = deck.length
		for(var i=0;i<deckSize;i++) {
			var random = Math.floor(Math.random()*deck.length)
			shuffledDeck.push(deck[random])
			deck = deck.slice(0,random).concat(deck.slice(random+1))
		}
		//draws cards
		var cardDraw = shuffledDeck.slice(0,drawCount)
		return cardDraw
	}
	this.renderCards = function(cards) {
		var HTML = '<ul class="cards">'
		for(var i=0;i<cards.length;i++) {
			var card = this.cards[cards[i]]
			HTML += "<li><img src='"
			if(card.name !== this.commander) {
				HTML += "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid="
				HTML += card.multiverseid
				HTML += "&type=card' "
			} else {
				HTML += "img/" + card.multiverseid + ".png'"
			}
			HTML +=" alt='" + card.name + "'></li>"
		}
		HTML += "</ul>"
		return HTML
	}
	this.deckByCmc = function() {
		var deck = this.deckList;
		var HTML = ""
		for(var mana = 1;mana<9;mana++) {
			HTML += '<h1 class="manaTitle">Mana Cost: ' + mana + '</h1>'
			var sorted = []
			for(var i=0;i<deck.length;i++) {
				var card = this.cards[deck[i]];
				if(card.cmc === mana) {
					sorted.push(deck[i]);
				}
			}
			HTML += this.renderCards(sorted);
		}
		return HTML
	}
	this.renderManaCurve = function() {
		var curve = {};
		var totalMana = 0;
		var totalCards = 0;
		for(key in this.cards) {
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
		var average = totalMana/totalCards;
		console.log(curve)
		console.log("Average CMC: " + average)
		return curve
	}
}