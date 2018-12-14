"use strict";

module.exports = [{
  shortId: {
    type: 'string',
    default: require('shortid').generate
  },
  name: 'string',
  slogan: 'string',
  //=subtitle
  link: 'string',
  //must be unique
  keywords: [{
    type: 'ObjectId',
    ref: 'keywords'
  }],
  desc: 'string',
  parent: {
    type: 'ObjectId',
    ref: 'categories'
  },
  fb_pages: ['string'],
  //link the category with fb pages, for instanceArticles, auto publish,...
  flags: ['string'],
  //ex: [hidden,series,closed]
  modifiedAt: {
    type: Date,
    default: Date.now
  }
}];