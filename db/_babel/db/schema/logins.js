"use strict";

module.exports = [{
  entry: 'string',
  //nx: case insestive; unique
  pass: 'string',
  type: 'string',
  //email,mobile,..
  user: {
    type: 'ObjectId',
    ref: 'persons'
  },
  confirmed: 'Date',
  //last confirmed timeout (every 3 months)
  code: 'string',
  //confirmation code
  codeSent: 'Date',
  //time of sending the confirmation code
  modifiedAt: {
    type: Date,
    default: Date.now
  }
}]; //code & codeSend will be removed after confirmation