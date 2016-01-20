var fs = require('fs');;
var sets = require('../../../allSets.json');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// mongoose.connect('mongodb://lawliet:answeris42@ds039504.mongolab.com:39504/mtg');
// mongoose.connect('mongodb://localhost/magic-dev');

var BlockSchema = new mongoose.Schema({
	_id: String,
	name: String,
	code: String,
	releaseDate: String,
	border: String,
	type: String,
	block: String,
	booster: [],
	cards: []
}, {strict: false});

var Block = mongoose.model('Block', BlockSchema);

function create(set) {
	try {
		Block.create(set, function(err, set) {
			if(err) {
				console.log(err)
			}
			console.log(set.name + "complete")
		})
	} catch(MongoError) {
		Block.update(set, function(err, set) {
			if(err) {
				console.log(err)
			}
			console.log(set.name + "complete")
		})
	}
}

function build(sets) {
	for(var setname in sets) {
		if(sets.hasOwnProperty(setname)) {
		console.log("building " + sets[setname].name)
			var set = sets[setname];
			set._id = set.code;
			// console.log(set)
			create(set)
		}
	}
}
// build(sets)