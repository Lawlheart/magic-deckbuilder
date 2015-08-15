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
function createCardList(deck) {
	var deck = []
	var output  = ""
	for(key in deck.cards) {
		var card = deck.cards[key];
		output += card.quantity + "x " + card.name + "\n"
	}
	return output
}
var animar = new Deck("commander", "Animar, Soul of Elements")
	animar.addCards([181], "CMD");
	animar.addCards([182], "M12");
	animar.addCards([173,284], "M15");
	animar.addCards([182], "ORI");

	animar.addCards([131], "ALA");
	animar.addCards([136,241], "ISD");
	animar.addCards([47,171,176,195], "AVR");
	animar.addCards([50,120,123,133,147,162,167,170,181,188,191,193,194,196,203,204,209,216,224,240,243,246,247], "GTC");
	animar.addCards([47,59,91,100,115,119,151], "DGM");
	animar.addCards([153,170,180,199,209], "THS")
	animar.addCards([149,150], "BNG");
	animar.addCards([124,126,149], "JOU")
	animar.addCards([53],"DDO")
	animar.addCards([39,42,133,144,201,207,208,234,240,244], "KTK");
	animar.addCards([113,131,137,138,144,148,172], "FRF");
	animar.addCards([175,177,191,210,216], "DTK");
	animar.addCards([244,245,249],"MM2")
	animar.addCards([246], "ZEN", 7);
	animar.addCards([236], "ZEN", 7);
	animar.addCards([243], "ZEN", 8);
var shuyun = new Deck("commander", "Shu Yun, the Silent Tempest")
	shuyun.addCards([52],"FRF")
	shuyun.addCards([152], "M12");
	shuyun.addCards([2,36,44,127,217],"AVR");
	shuyun.addCards([13,145,163,172,202,203,237],"RTR");
	shuyun.addCards([148, 239], "GTC");
	shuyun.addCards([40,151],"DGM");
	shuyun.addCards([14,65],"THS");
	shuyun.addCards([12],"JOU");
	shuyun.addCards([5,8,14,22,23,24,26,37,44,61,63,95,101,107,112,124,175,194,222], "KTK");
	shuyun.addCards([10,14,22,23,37,39,107,117,174],"FRF");
	shuyun.addCards([4,7,8,11,12,20,21,26,27,31,39,45,53,85,139,225,228],"DTK");
	shuyun.addCards([233], "ZEN", 14);
	shuyun.addCards([236], "ZEN", 10);
	shuyun.addCards([243], "ZEN", 10);
//LOGS
	// console.log(output)
	// console.log(animar.cardCount)
	// console.log(animar.distribution);
	// console.log(animar.manaCounts);
	// console.log(animar.cardCount);

var cards_db = []
for(var key in database) {
	set = database[key];
	for(var key in set.cards) {
		var card = set.cards[key];
		card["set"] = set.name;
		card["setCode"] = set.code;
		cards_db.push(card);
	}
}
console.log(cards_db.length)



// WITH JUST MONGODB

var MongoClient = require('mongodb').MongoClient
	, assert = require('assert');
 
var insertDocuments = function(object, collectionName, db, callback) {

  // Get the documents collection 
  var collection = db.collection(collectionName);

  // Insert some documents 
  collection.insert(object, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted document into the collection");
    callback(result);
  });
}
// var updateDocument = function(db, callback) {
	//   // Get the documents collection 
	//   var collection = db.collection('documents');
	//   // Update document where a is 2, set b equal to 1 
	//   collection.update({ a : 2 }
	//     , { $set: { b : 1 } }, function(err, result) {
	//     assert.equal(err, null);
	//     console.log("Updated the document with the field a equal to 2");
	//     callback(result);
	//   });  
	// }
var removeDocument = function(searchObj,collectionName, db, callback) {
	  // Get the documents collection 
	  var collection = db.collection(collectionName);
	  // Insert some documents 
	  collection.remove(searchObj, function(err, result) {
	    assert.equal(err, null);
	    callback(result);
	  });
	}
var findDocuments = function(searchObj, collectionName, db, callback) {
  // Get the documents collection 
  var collection = db.collection(collectionName);
  // Find some documents 
  collection.find(searchObj).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    // console.dir(docs);
    callback(docs);
  });
}


// Connection URL 
var url = 'mongodb://localhost:27017/magic';
// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  // findDocuments({name: "Zendikar's Roil"}, 'cards', db, function(data) {
  // 	console.log(data)
  //   db.close();
  // });
	// insertDocuments(cards_db, 'cards', db, function(data) {
	// 	console.log("SUCCESS!!!");
	// 	db.close();
	// })
});








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