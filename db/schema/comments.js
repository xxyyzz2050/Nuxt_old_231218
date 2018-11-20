module.exports = [
  {
    article: { type: 'ObjectId', ref: 'articles' },
    person: { type: 'ObjectId', ref: 'persons' }, //user or visitor
    text: 'string',
    replyTo: { type: 'ObjectId', ref: 'comments' },
    modifiedAt: { type: Date, default: Date.now }
  },
  { article: 1, replyTo: 1 },
  { person: 1, article: 1, replyTo: 1 }
]
