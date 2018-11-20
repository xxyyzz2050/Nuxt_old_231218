module.exports = [
  {
    country: 'string', //country code
    code: 'string',
    name: 'string', //local name
    en: 'string', //English name (or use language-> see countries)
    modifiedAt: { type: Date, default: Date.now }
  },
  { country: 1 }
]
