"use strict";

module.exports = [{
  entry: 'ObjectId',
  //based on type
  user: {
    type: 'ObjectId',
    ref: 'person'
  },
  type: 'string',
  //group,topic,user,...
  modifiedAt: {
    type: Date,
    default: Date.now
  }
}, {
  entry: 1
}, {
  user: 1
}];