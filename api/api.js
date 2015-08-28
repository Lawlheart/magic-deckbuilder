var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connection URL 
var url = 'mongodb:// (mongodb database location) /magic';

//allows Cross-origin requests
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();      
  });

// functions
var findDocuments = function(searchObj, collectionName, db, callback) {
  // Get the documents collection 
  var collection = db.collection(collectionName);
  // Find some documents 
  collection.find(searchObj).toArray(function(err, docs) {
    console.log("Found the following records");
    // console.dir(docs);
    callback(docs);
  });
}
var insertDocuments = function(object, collectionName, db, callback) {
  var collection = db.collection(collectionName);
  collection.insert(object, function(err, result) {
    console.log("Inserted document into the collection");
    callback(result);
  });
}

// RESTful routing
app.get('/', function(req, res, next) {
	MongoClient.connect(url, function(err, db) {
  	console.log("Connected correctly to server");
  	findDocuments({}, 'decks', db, function(data) {
  		console.log(typeof data)
  		res.json(data)
    	db.close();
  	});
  });
	});
app.get('/deck/:id', function(req, res) {
  var deckName = req.params.id
  MongoClient.connect(url, function(err, db) {
  	console.log("Connected correctly to server");
  	findDocuments({name: deckName}, 'decks', db, function(data) {
  		console.log(data)
  		res.json(data)
    	db.close();
  	});
  });
  });
app.post('/deck', function(req, res) {
  MongoClient.connect(url, function(err, db) {
  	console.log("Connected correctly to server");
    var deck;
    console.log(req.data)
    for(key in req.body) {
      deck = key;
      deck = JSON.parse(deck)
    }
	  if(!deck.hasOwnProperty('name') || !deck.hasOwnProperty('type')) {
	    res.statusCode = 400;
	    return res.send('Error 400: Post syntax incorrect.')
	  }
  	newDeck = {
  		name: deck.name,
  		type: deck.type,
  		}
  	if(newDeck.type === "commander" && deck.hasOwnProperty('commander')) {
  		newDeck.commander = deck.commander;
  		}
  	newDeck['cards'] = deck.cards !==undefined ? deck.cards : []
  	insertDocuments(newDeck, 'decks', db, function(data) {
  		console.log("Successfully added new Deck")
  		res.json(true)
  		db.close();
  	})
  });	
});
app.listen(6244);
console.log('API is running on port localhost:6244')
