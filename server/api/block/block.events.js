/**
 * Block model events
 */

'use strict';

import {EventEmitter} from 'events';
var Block = require('./block.model');
var BlockEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BlockEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Block.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    BlockEvents.emit(event + ':' + doc._id, doc);
    BlockEvents.emit(event, doc);
  }
}

export default BlockEvents;
