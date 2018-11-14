module.exports = [
  {
    name: 'string',
    type: 'string', //store,country,city,...
    coords: ['number'],
    country: 'string', //nx: _id for translations
    city: 'string',
    area: 'string',
    street: 'string',
    contacts: { type: 'ObjectId', ref: 'contacts' } //nx: contacts object {mobiles,emails,social accounts  & available times}
  },
  { country: 1, city: 1 /*,coords:1*/ }
]
