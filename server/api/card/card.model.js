'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var searchPlugin = require('mongoose-search-plugin');

var CardSchema = new mongoose.Schema({
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

CardSchema.plugin(searchPlugin, {
  fields: ['name']
});

export default mongoose.model('Card', CardSchema);
