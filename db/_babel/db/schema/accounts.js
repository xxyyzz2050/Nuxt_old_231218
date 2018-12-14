"use strict";

module.exports = [{
  network: 'string',
  //ex: email,mobile,facebook,adsense,...
  type: 'string',
  //ex: page,group,..
  entry: 'mixed',
  //email,link,id,array or map or any type
  available: {
    type: 'map',
    of: 'mixed'
  },
  //ex: {sat:{[7am,12pm],[3pm,9pm]}, sun:{..}}
  modifiedAt: {
    type: Date,
    default: Date.now
  }
}]; //for adsense: entry:{id,channel,slot,auto?}