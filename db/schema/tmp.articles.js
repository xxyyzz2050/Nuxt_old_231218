module.exports = [
  {
    shortId: { type: 'string' },
    author: ['string'], //[id,name 'first last']
    title: 'string',
    subtitle: 'string',
    content: 'string', //final content
    summary: 'string', //if(empty)get from content
    keywords: ['string'], // link: /keywoard/$text
    stars: 'number', //1->3, null=undetermined
    sources: 'string',
    link: 'string', // mainCategory/link-shortId
    expired: 'boolean', // if(expiredAt && expiredAt > now)
    status: 'string',
    location: { type: 'ObjectId', ref: 'locations' },
    extra: 'Map',
    categories: { type: 'map', of: 'string' }, //{category:shortId}, first=main category (used in article link)
    modifiedAt: { type: Date, default: Date.now }
  }
]
