"use strict";

module.exports = [{
  article: {
    type: 'ObjectId',
    ref: 'articles'
  },
  category: {
    type: 'ObjectId',
    ref: 'categories'
  },
  modifiedAt: {
    type: Date,
    default: Date.now
  }
}, {
  article: 1
}, {
  category: 1
}];