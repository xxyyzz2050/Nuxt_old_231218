module.exports = {
  shortId: { type: 'string' },
  author: ['string'], //id,name[]
  title: 'string',
  subtitle: 'string',
  content: 'string', //final content
  summary: 'string',
  keywords: { type: 'map', of: 'string' }, //{text:id}
  stars: 'number', //1->3, null=undetermined
  sources: 'string',
  link: 'string',
  expired: 'boolean', //basd on expireAt value
  status: 'string',
  location: { type: 'ObjectId', ref: 'locations' },
  extra: 'Map',
  categories: { type: 'map', of: 'string' }, //{category:id}, first=main category (used in article link)
  modifiedAt: { type: Date, default: Date.now }
}
