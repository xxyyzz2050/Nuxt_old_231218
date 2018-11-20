//deprecated! use tmp database to fetch the final data

module.exports = [
  {
    article: { type: 'ObjectId', ref: 'articles' },
    original: 'string',
    amp: 'string',
    instanceArticle: 'string',
    modifiedAt: { type: Date, default: Date.now }
  }
]
