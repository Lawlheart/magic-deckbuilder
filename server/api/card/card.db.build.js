var fs = require('fs');;
var sets = require('../../common/allSets.json');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongoose.connect('mongodb://lawliet:answeris42@ds039504.mongolab.com:39504/mtg');

var CardSchema = new Schema({
	_id: Number,
	cmc: Number,
	manaCost: String,
	multiverseid: Number,
	name: String,
	number: String,
	subtypes: Array,
	text: String,
	type: String,
	types: Array
}, {strict: false});

var Card = mongoose.model('Card', CardSchema);

function create(card) {
	Card.create(card, function(err, card) {
		if(err) {
			console.log(err)
		}
		console.log(card)
	})
}

function build(sets) {
	for(var setname in sets) {
		if(sets.hasOwnProperty(setname)) {
		console.log("building " + sets[setname].name)
			var cardSet = sets[setname].cards;
			for(var i=0;i<cardSet.length;i++) {
				var card = cardSet[i];
				if(card.hasOwnProperty('multiverseid')) {
					card._id = card.multiverseid;
					create(card);
				}
			}
		}
	}
}
build(sets)