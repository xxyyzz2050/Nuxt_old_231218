module.exports = {
  locations: 'ObjectId ',
  name: 'string',
  type: 'string', //store,country,city,...
  coords: ['number'],
  country: 'string', //nx: _id for translations
  city: 'string',
  area: 'string',
  street: 'string',
  contacts: 'ObjectId' //nx: contacts object {mobiles,emails,social accounts  & available times}
}
