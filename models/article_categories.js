module.exports = [
  {
    article: { type: 'ObjectId', ref: 'articles' },
    category: { type: 'ObjectId', ref: 'categories' }
  },
  { article: 1, category: 1 }
]
