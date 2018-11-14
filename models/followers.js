module.exports = [
  {
    entry: 'ObjectId', //based on type
    user: { type: 'ObjectId', ref: 'person' },
    type: 'string' //group,topic,user,...
  },
  { entry: 1 }
]
