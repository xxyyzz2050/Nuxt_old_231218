module.exports = [
  {
    url: ['string'], //or ObjectId->{host,path,query}
    reason: 'string',
    person: { type: 'ObjectId', ref: 'persons' },
    vst: { type: 'ObjectId', ref: 'vst' },
    type: 'string', //ex: adult content,poor quality,scram,...
    modifiedAt: { type: Date, default: Date.now }
  },
  { type: 1 }
]
