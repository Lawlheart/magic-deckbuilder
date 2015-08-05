var database = require('./all-sets.json')

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
			HTML +="<li><img src='http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + card.multiverseid + "&type=card' alt='" + card.name + "'></li>"
		}
		HTML += "</ul>"
		return HTML
	}
	this.deckByCmc = function() {
		var deck = this.deckList;
		var HTML = ""
		for(var mana = 1;mana<10;mana++) {
			HTML += '<h1>Mana Cost: ' + mana + '</h1>'
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

var animar = new Deck("commander", "Animar, Soul of Elements")
	animar.addCards([181], "CMD");
	animar.addCards([182], "M12");
	animar.addCards([173,284], "M15");
	animar.addCards([131], "ALA");
	animar.addCards([136,241], "ISD");
	animar.addCards([47,171,176,195], "AVR");
	animar.addCards([33,50,101,116,120,123,133,147,162,167,170,180,181,188,191,193,194,196,203,204,209,214, 216,224,240,243,246,247], "GTC");
	animar.addCards([41,47,59,91,100,115,119,151], "DGM");
	animar.addCards([199], "THS")
	animar.addCards([149,150], "BNG");
	animar.addCards([124,126,149], "JOU")
	animar.addCards([39,42,140,201,208,240,244], "KTK");
	animar.addCards([43,105,116,131,140,144,148,172], "FRF");
	animar.addCards([175,177,191,199,208,216], "DTK");
	animar.addCards([246], "ZEN", 12);
	animar.addCards([236], "ZEN", 7);
	animar.addCards([243], "ZEN", 7);
var output = {}
var search = "rarity"
for(key in animar.cards) {
	var card = animar.cards[key];
	if(output[card[search]] !== undefined && card[search] !== undefined) {
		output[card[search]] += card.quantity;
	} else if(card[search] !== undefined) {
		output[card[search]] = card.quantity;
	}
}
console.log(output)
console.log(animar.distribution);
console.log(animar.manaCounts);
console.log(animar.cardCount);

var test = { layout: 'normal',
  supertypes: [ 'Legendary' ],
  type: 'Legendary Creature — Elemental',
  types: [ 'Creature' ],
  colors: [ 'Blue', 'Red', 'Green' ],
  multiverseid: 236504,
  name: 'Animar, Soul of Elements',
  subtypes: [ 'Elemental' ],
  cmc: 3,
  rarity: 'Mythic Rare',
  artist: 'Peter Mohrbacher',
  power: '1',
  toughness: '1',
  manaCost: '{U}{R}{G}',
  text: 'Protection from white and from black\nWhenever you cast a creature spell, put a +1/+1 counter on Animar, Soul of Elements.\nCreature spells you cast cost {1} less to cast for each +1/+1 counter on Animar.',
  number: '181',
  imageName: 'animar, soul of elements',
  quantity: 1,
  inDeck: true }