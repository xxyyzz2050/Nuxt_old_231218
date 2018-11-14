module.exports = [
  {
    name: 'string',
    link: 'string', //must be unique
    keywords: { type: 'ObjectId', ref: 'keywords' },
    desc: 'string',
    parent: { type: 'ObjectId', ref: 'categories' },
    fb_pages: ['string'],
    meta: ['string'] //ex: [hidden,series,closed]
  }
]
