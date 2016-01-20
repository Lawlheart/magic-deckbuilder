'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var DeckSchema = new mongoose.Schema({
	_id: String,
  name: String,
  type: String,
  user: String,
  cards: []
}, {strict: false});

export default mongoose.model('Deck', DeckSchema);
