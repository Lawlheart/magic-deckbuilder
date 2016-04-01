/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/blocks              ->  index
 * POST    /api/blocks              ->  create
 * GET     /api/blocks/:id          ->  show
 * PUT     /api/blocks/:id          ->  update
 * DELETE  /api/blocks/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Block from './block.model';

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
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
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

// Gets a list of Blocks
export function index(req, res) {
  Block.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Block from the DB
export function show(req, res) {
  Block.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Block in the DB
export function create(req, res) {
  Block.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Block in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Block.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Block from the DB
export function destroy(req, res) {
  Block.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
