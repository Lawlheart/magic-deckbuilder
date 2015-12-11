'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeckSchema = new Schema({
	_id: String,
  name: String,
  type: String,
  user: String,
  cards: []
}, {strict: false});

module.exports = mongoose.model('Deck', DeckSchema);