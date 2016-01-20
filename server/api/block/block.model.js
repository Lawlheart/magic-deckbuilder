'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

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

export default mongoose.model('Block', BlockSchema);
