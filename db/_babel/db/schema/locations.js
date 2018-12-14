"use strict";

module.exports = [{
  //shortId: { type: string, default: require('shortid').generate },
  name: 'string',
  type: 'string',
  //store,country,city,...
  coords: ['number'],
  country: 'string',
  //nx: _id for translations
  city: 'string',
  area: 'string',
  street: 'string',
  accounts: {
    type: 'ObjectId',
    ref: 'accounts'
  },
  //nx: related accounts & contacts {mobiles,emails,social accounts  & available times}
  modifiedAt: {
    type: Date,
    default: Date.now
  }
}, {
  country: 1,
  city: 1
  /*,coords:1*/

}];