"use strict";

module.exports = [{
  article: {
    type: 'ObjectId',
    ref: 'articles'
  },
  //even if the reaction in other object inside the article ex: comment,reply,..
  person: {
    type: 'ObjectId',
    ref: 'persons'
  },
  entry: 'ObjectId',
  type: 'string',
  //comment,topic,..
  reaction: 'string' //like,love,angry,...

}, {
  article: 1,
  entry: 1
}];