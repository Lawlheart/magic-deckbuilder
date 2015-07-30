var database = require('./AllSets.json');

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
	this.cards = {};
	this.cmc = 0;
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
	this.addCards = function(number, set, quantity) {
		if(quantity === undefined) {
			quantity = 1;
		}
		var card = cardSearch(number, set);
		var types = typeof card.types === "string" ? card.types : card.types.join("_");
		this.cards[card.name] = card;
		this.cards[card.name].quantity = quantity;
		this.cards[card.name].inDeck = true;
		this.cardCount = this.countCards();
		convertMana(card, this.manaCounts);
		if(types === "Creature" || types === "Land"){
			this.distribution[types] += card.quantity;
		} else {
			this.distribution["Other"] += card.quantity;
		}
	}
	this.addSinglesBySet = function(numbers, set) {
		for(var i=0; i<numbers.length; i++ ) {
			number = numbers[i];
			this.addCards(number, set);
		}
	}
	this.checkout = function(cardName) {
		if(this.cards[cardName] !== undefined) {
			if(this.cards[cardName].inDeck === true) {
				this.cards[cardName].inDeck = false;
			} else {
				console.log(cardName + " is already checked out.");
			}
		} else {
			console.log(cardName + " is not in this deck.")
		}
	}
	this.checkin = function(cardName) {
		if(this.cards[cardName] !== undefined) {
			if(this.cards[cardName].inDeck === false) {
				this.cards[cardName].inDeck = true;
			} else {
				console.log(cardName + " is already checked in.");
			}
		} else {
			console.log(cardName + " is not in this deck.")
		}
	}
	this.countCards = function() {
    var size = 0;
    var cards = this.cards;
    for (key in cards) {
      if (cards.hasOwnProperty(key)) {
      	size += cards[key].quantity;
      }
    }
    return size;
	}
	this.countMana = function() {
		for(var key in simic.cards) {
			var card = simic.cards[key]
			convertMana(card, simic.manaCounts)
		}
		console.log(simic.manaCounts)
	}
	this.cardList = function() {
		var list = []
		for(key in this.cards) {
			var card = this.cards[key];
			list.push(card.quantity + "x " +card.name);
		}
		return list
	}
	this.avgMana = function() {
		var totalMana = 0;
		var totalCards = 0;
		for(key in this.cards) {
			var card = this.cards[key];
			if(card.cmc !== undefined) {
				totalMana += card.cmc;
				totalCards ++;
			}
		}
		var average = totalMana/totalCards;
		console.log("Average CMC: " + average)
		return average
	}
	this.searchTypes = function() {

	}
	this.draw = function() {
		var deck = []
		for(key in this.cards) {
			card = this.cards[key];
			for(var i=0;i<card.quantity;i++) {
				deck.push(card.name);
			}
		}
		//removes the commander from the deck
		if(this.deckType === "commander") {
			var index = deck.indexOf(this.commander);
			deck = deck.slice(0,index).concat(deck.slice(index+1))
		}
		var shuffledDeck = []
		var deckSize = deck.length
		for(var i=0;i<deckSize;i++) {
			var random = Math.floor(Math.random()*deck.length)
			shuffledDeck.push(deck[random])
			deck = deck.slice(0,random).concat(deck.slice(random+1))
		}
		return shuffledDeck.slice(0,7)
	}
}


var simic = new Deck("commander", "The Mimeoplasm");
	//Core sets and Commander
	simic.addCards(12, "CM1");
	simic.addSinglesBySet([66, 182], "M12");
	simic.addSinglesBySet([173, 284], "M15");

	//Arara Block
	simic.addSinglesBySet([89, 131], "ALA")
	simic.addCards(144, "CON")

	//Scars of Mirrodin Block
	simic.addCards(81, "MBS");
	simic.addCards(104, "NPH");

	//Innistrad Block
	simic.addSinglesBySet([205, 241], "ISD");
	simic.addSinglesBySet([62, 156], "DKA");
	simic.addSinglesBySet([92, 96, 107, 171, 176, 195, 200], "AVR");


	//Return to Ravinica Block
	simic.addSinglesBySet([208, 239], "RTR");
	simic.addSinglesBySet([50, 116, 120, 123, 128, 162, 180, 188, 193, 195, 203, 204, 207, 209, 214, 240, 246, 248], "GTC");
	simic.addSinglesBySet([41, 59, 85, 115], "DGM");


	//Theros Block
	simic.addSinglesBySet([65, 150, 163], "THS")
	simic.addCards(150, "BNG");
	simic.addSinglesBySet([42, 124, 126, 132, 148, 149], "JOU");


	// Tarkir Block
	simic.addSinglesBySet([39, 140, 159, 235, 238, 239, 244], "KTK");
	simic.addSinglesBySet([43, 121, 131, 132, 133, 144, 168], "FRF");
	simic.addSinglesBySet([175, 177, 191, 226, 229], "DTK");

	// LANDS
	simic.addCards(249, "ZEN", 12)
	simic.addCards(236, "ZEN", 7)
	simic.addCards(241, "ZEN", 7)


console.log(simic.draw())
console.log(simic.cards["Rupture Spire"])
