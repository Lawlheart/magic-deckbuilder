'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SetSchema = new Schema({
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

module.exports = mongoose.model('Set', SetSchema);