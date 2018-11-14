module.exports = [
  {
    name: ['string'],
    contacts: [{ type: 'ObjectId', ref: 'contacts' }],
    locations: [{ type: 'ObjectId', ref: 'locations' }], //{type:home/visit/residence,travel ,location:__id}
    country: 'string', //locations for specific areas or streets, not countries & cities
    city: 'string',
    gender: 'string',
    birth: ['number'],
    languages: ['array'], //[ [lang,percentage%,native?],.. ]
    education: ['Map'], //$stage: { department,start,end,grade,uni,colledge/school,topic 'for master & phD stages'}; starge=pre/secondary/colledge/master/phD/...
    education_degree: 'string', //education->$stage
    job_history: ['Map'], //{startTime,endTime:current,company:_id,position,location,salary:[ammount,currency],type[training,course,part time,online,..]},  //type:_id
    job_title: 'string',
    national_ids: ['Map'], //{country:EG, id:xxx ,type:nation/residence},
    associations: ['Map'], //{name:Eng syndicate,type:syndicate/club,..,id:XX ,start,end},
    skills: ['Map'], //{name:,persentage,notes}
    activites: ['Map'] //{name,start,end,position,details,type:charity/social work,...}
  },
  { gender: 1 } //,birth,location
]
