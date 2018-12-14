"use strict";

module.exports = [{
  shortId: {
    type: 'string',
    default: require('shortid').generate
  },
  person: {
    type: 'ObjectId',
    ref: 'persons'
  },
  theme: 'string',
  lang: 'string',
  //Cv data language
  modifiedAt: {
    type: Date,
    default: Date.now
  }
}, {
  person: 1 //nx: person._id

}];