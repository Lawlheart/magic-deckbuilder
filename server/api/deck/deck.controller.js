/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/decks              ->  index
 * POST    /api/decks              ->  create
 * GET     /api/decks/:id          ->  show
 * PUT     /api/decks/:id          ->  update
 * DELETE  /api/decks/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Deck from './deck.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.extend(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Decks
export function index(req, res) {
  Deck.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Deck from the DB
export function show(req, res) {
  Deck.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Deck in the DB
export function create(req, res) {
  Deck.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Deck in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Deck.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Deck from the DB
export function destroy(req, res) {
  Deck.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
