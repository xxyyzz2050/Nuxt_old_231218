module.exports = {
  author: 'ObjectId', //person
  title: 'string',
  subtitle: 'string',
  content: 'string',
  summary: 'string',
  keywords: ['ObjectId'],
  stars: 'number', //1->3, null=undetermined
  sources: 'string',
  link: 'string', //must be unique (link title)
  expireAt: 'date',
  expired: 'boolean', //checked every day (or: expireAt>now or null)
  //groups: ['ObjectId'], //use article_groups
  status: 'string', //pending,approved,rejected;
  status_history: ['map'], //{time:[approved,user]}
  notes: ['map'], //{userid:text} ->notes from author,admin,or any person..
  location: 'ObjectId', //for jobs,checkins,...
  extra: 'map' //for jobs: {directApply:boolean,contacts:_id}
}
