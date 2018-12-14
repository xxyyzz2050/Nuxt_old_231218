"use strict";

module.exports = [{
  num: 'number',
  msg: 'string',
  url: ['string'],
  flw: {
    type: 'ObjectId',
    ref: 'flw'
  },
  post: ['mixed'],
  modifiedAt: {
    type: Date,
    default: Date.now
  }
}, {
  num: 1
}];