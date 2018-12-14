"use strict";

module.exports = [{
  object: 'ObjectId',
  collection: 'string',
  action: 'string',
  history: 'map',
  modifiedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 1
}];
/*
ex:
collection:articles, action:approved, history:{by:person_id}; _id contains time of history entry
collection:comments, action:modified, history:{old:xxxx}

*/