'use strict';

var _ = require('lodash');
var Deck = require('./deck.model');

// Get list of decks
exports.index = function(req, res) {
  Deck.find(function (err, decks) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(decks);
  });
};

// Get a single deck
exports.show = function(req, res) {
  Deck.findById(req.params.id, function (err, deck) {
    if(err) { return handleError(res, err); }
    if(!deck) { return res.status(404).send('Not Found'); }
    return res.json(deck);
  });
};

// Creates a new deck in the DB.
exports.create = function(req, res) {
  Deck.create(req.body, function(err, deck) {
    if(err) { 
      console.log(err);
      return handleError(res, err); 
    }
    return res.status(201).json(deck);
  });
};

// Updates an existing deck in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Deck.findById(req.params.id, function (err, deck) {
    if (err) { return handleError(res, err); }
    if(!deck) { return res.status(404).send('Not Found'); }
    var updated = _.extend(deck, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(deck);
    });
  });
};

// Deletes a deck from the DB.
exports.destroy = function(req, res) {
  Deck.findById(req.params.id, function (err, deck) {
    if(err) { return handleError(res, err); }
    if(!deck) { return res.status(404).send('Not Found'); }
    deck.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}