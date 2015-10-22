/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Set = require('./set.model');

exports.register = function(socket) {
  Set.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Set.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('set:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('set:remove', doc);
}