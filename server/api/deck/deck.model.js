'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var DeckSchema = new mongoose.Schema({
  name: String,
  type: String,
  user: String,
  user_id: String,
  cards: []
}, {strict: false});

export default mongoose.model('Deck', DeckSchema);
