'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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

module.exports = mongoose.model('Card', CardSchema);