module.exports = [
  {
    author: { type: 'ObjectId', ref: 'persons' },
    title: 'string',
    subtitle: 'string',
    content: 'string',
    summary: 'string',
    keywords: [{ type: 'ObjectId', ref: 'keywords' }],
    stars: 'number', //1->3, null=undetermined
    sources: 'string',
    link: 'string', //must be unique (link title)
    expireAt: 'date',
    expired: 'boolean', //checked every day (or: expireAt>now or null)
    //categories: ['ObjectId'], //use article_categories
    status: 'string', //pending,approved,rejected;
    status_history: [{ type: 'Map', of: 'Array' }], //[{'time':[approved,user]}]
    notes: [{ type: 'Map', of: 'Array' }], //{userid:text} ->notes from author,admin,or any person..
    location: { type: 'ObjectId', ref: 'locations' }, //for jobs,checkins,...
    extra: 'Map' //for jobs: {directApply:boolean,contacts:_id}; nx: or {type:map,of:..}
  },
  { author: 1 }
]
