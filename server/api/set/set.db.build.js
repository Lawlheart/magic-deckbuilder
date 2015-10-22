var fs = require('fs');;
var sets = require('../../common/allSets.json');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Set = require('../../models/sets');
// mongoose.connect('mongodb://localhost/magic');

function create(set) {
	Set.create(set, function(err, set) {
		if(err) {
			console.log(err)
		}
		console.log(set)
	})
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
build(sets)