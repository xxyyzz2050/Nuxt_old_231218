module.exports = [
  {
    person: { type: 'ObjectId', ref: 'persons' },
    theme: 'string',
    lang: 'string' //Cv data language
  },
  { person: 1 } //nx: person._id
]
