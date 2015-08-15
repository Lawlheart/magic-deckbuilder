var express = require('express');
var swig = require('swig');
var fs = require('fs');
var app = express();

var MongoClient = require('mongodb').MongoClient
	, assert = require('assert');


// Connection URL 
var url = 'mongodb://localhost:27017/magic';
// Use connect method to connect to the Server

var findDocuments = function(searchObj, collectionName, db, callback) {
  // Get the documents collection 
  var collection = db.collection(collectionName);
  // Find some documents 
  collection.find(searchObj).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the " + docs.length + " records");
    // console.dir(docs);
    global_data = docs
    callback(docs);
  });
}
// function renderCards(cardArray) {
// 	var HTMLString = "<ul>"
// 	for(var i=0;i<cardArray.length;i++) {
// 		HTMLString += "<li>" + cardArray[i].name + "</li>"
// 	}
// 	HTMLString += "</ul>"
// 	return HTMLString
// }

function renderCards(cards) {
		var HTML = '<ul class="cards">'
		for(var i=0;i<cards.length;i++) {
			var card = cards[i]
			if(card.multiverseid !== undefined) {
				HTML +="<li><img src='http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=" + card.multiverseid + "&type=card' alt='" + card.name + "'></li>"
			}
		}
		HTML += "</ul>"
		return HTML

}
// Setup Swig renderer
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.use(express.static(__dirname));


app.get('/', function (req, res) {
  fs.readFile('data.txt', function(err, data) {
  	if(err) throw err;
  	console.log(data);
  })
  res.render('index', {});

});

app.get('/search', function(req, res) {
	var search = req.query.search;
	console.log("starting card search for " + search)
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log("Connected correctly to server");

	  findDocuments({name: search}, 'cards', db, function(docs) {
	  	// console.log(docs)
			console.log("rendering cards")
			res.send(docs)
			db.close();
	  });
	});

});

app.get('/mongo', function (req, res) {


  res.render('mongo', {});
});

app.post('/', function(req, res) {
	console.log(req)
});

var server = app.listen(3030, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});