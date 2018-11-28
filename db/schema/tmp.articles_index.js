//for index page ; only approved && !expired articles
module.exports = {
  _id: { type: 'ObjectId', ref: 'articles' },
  shortId: { type: 'string' },
  author: ['string'], //[id,name]
  title: 'string',
  subtitle: 'string',
  summary: 'string',
  stars: 'number',
  link: 'string',
  location: { type: 'ObjectId', ref: 'locations' }
}
