module.exports = {
  name: ['string'],
  contacts: 'ObjectId',
  locations: 'ObjectId', //{type:home/visit/residence,travel ,location:__id}
  gender: 'string',
  birth: ['number'],
  languages: ['array'], //[ [lang,percentage%,native?],.. ]
  education: ['map'], //$stage: { department,start,end,grade,uni,colledge/school,topic 'for master & phD stages'}; starge=pre/secondary/colledge/master/phD/...
  job_history: ['map'], //{startTime,endTime:current,company:_id,position,location,salary:[ammount,currency],type[training,course,part time,online,..]},  //type:_id
  job_title: 'string',
  national_ids: ['map'], //{country:EG, id:xxx ,type:nation/residence},
  associations: ['map'], //{name:Eng syndicate,type:syndicate/club,..,id:XX ,start,end},
  skills: ['map'], //{name:,persentage,notes}
  activites: ['map'] //{name,start,end,position,details,type:charity/social work,...}
}
