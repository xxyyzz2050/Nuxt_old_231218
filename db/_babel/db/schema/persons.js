"use strict";

module.exports = [{
  shortId: {
    type: 'string',
    default: require('shortid').generate
  },
  name: ['string'],
  locations: [{
    type: 'ObjectId',
    ref: 'locations'
  }],
  //{type:home/visit/residence,travel ,location:__id}
  country: 'string',
  //locations for specific areas or streets, not countries & cities
  city: 'string',
  gender: 'string',
  birth: ['number'],
  //nx: Date
  languages: ['array'],
  //[ [lang,percentage%,native?],.. ]
  education: ['mixed'],
  //$stage: { department,start,end,grade,uni,colledge/school,topic 'for master & phD stages'}; starge=pre/secondary/colledge/master/phD/...
  education_degree: 'string',
  //education->$stage
  job_history: ['mixed'],
  //{startTime,endTime:current,company:_id,position,location,salary:[ammount,currency],type[training,course,part time,online,..]},  //type:_id
  job_title: 'string',
  national_ids: ['mixed'],
  //{country:EG, id:xxx ,type:nation/residence},
  associations: ['mixed'],
  //{name:Eng syndicate,type:syndicate/club,..,id:XX ,start,end},
  skills: ['mixed'],
  //{name:,persentage,notes}
  activites: ['mixed'],
  //{name,start,end,position,details,type:charity/social work,...}
  accounts: [{
    type: 'ObjectId',
    ref: 'accounts'
  }],
  flags: ['string'],
  //ex: fk
  role: {
    type: 'ObjectId',
    ref: 'roles'
  },
  modifiedAt: {
    type: Date,
    default: Date.now
  }
}, {
  gender: 1
}, //,birth,location
{
  country: 1,
  city: 1
}];