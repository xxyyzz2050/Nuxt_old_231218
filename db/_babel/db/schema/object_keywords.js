"use strict";

//depricated: use embeded keywords[] inside each collection
module.exports = [{
  keyword: {
    type: 'ObjectId',
    ref: 'keywords'
  },
  object: 'ObjectId',
  type: 'string',
  //article,category,..
  modifiedAt: {
    type: Date,
    default: Date.now
  }
}];