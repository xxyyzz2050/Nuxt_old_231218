module.exports = [
  {
    shortId: { type: 'string', default: require('shortid').generate },
    author: { type: 'ObjectId', ref: 'persons' },
    title: 'string',
    subtitle: 'string',
    content: 'string', //original content -> use tmp.articles collection for the final content
    summary: 'string',
    keywords: [{ type: 'ObjectId', ref: 'keywords' }], //for pending articles: jeywords=['string'], original keywords only
    stars: 'number', //1->3, null=undetermined
    sources: 'string',
    link: 'string', //must be unique (link title)
    expireAt: 'date',
    status: 'string', //pending,approved,rejected;
    status_history: [{ type: 'Map', of: 'Array' }], //[{'time':[approved,user]}]
    notes: [{ type: 'Map', of: 'string' }], //{$personId:text} ->notes from author,admin,or any person..
    location: { type: 'ObjectId', ref: 'locations' }, //for jobs,checkins,...
    extra: 'Map', //for jobs: {directApply:boolean,contacts:_id}; nx: or {type:map,of:..}
    category: { type: 'ObjectId', ref: 'categories' /*,required:true*/ }, //main category -> url: /category/link; if(empty)/article/link
    modifiedAt: { type: Date, default: Date.now }
  },
  { author: 1, status: 1 },
  { stars: 1 }
]

/*
database tmp: (contains the final data)

tmp.articles={
shortId,
author:{id,name},
title
subtitle
content (final)
summary (final)
keywords [string] //add extra keywords (i.e category names,...)
stars
sources
link
expired (boolean)
status (only approved)
location
extra
categories [{id,name}] ->first=main category
}

tmp.articles_amp={}
tmp.articles.instanceArticle={}
*/
