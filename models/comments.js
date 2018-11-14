module.exports = [
  {
    article: { type: 'ObjectId', ref: 'articles' },
    person: { type: 'ObjectId', ref: 'persons' }, //user or visitor
    text: 'string',
    replyTo: { type: 'ObjectId', ref: 'comments' }
  },
  { article: 1 }
]
