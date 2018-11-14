module.exports = [
  {
    title: 'string',
    subtitle: 'string',
    category: { type: 'ObjectId', ref: 'categories' },
    keywords: ['ObjectId'],
    desc: 'string',
    owner: { type: 'ObjectId', ref: 'persons' }, //creator
    fb_pages: ['string'],
    meta: ['string'], //ex: [hidden,series,closed]
    //admins: ['string'], //nx: replace with rules
    rules: [{ type: 'ObjectId', ref: 'rules' }], //rules created by this group owners
    status: 'string', //approved,pending,rejected
    status_history: ['Map'],
    stars: 'number', //by voting + site admin desision + activities
    link: 'string', //must be unique (same as usernames) /group/link
    notes: ['Map'],
    target: { type: 'ObjectId', ref: 'targets' }
  },
  { category: 1, stars: -1 }
]

/*
group admins may create rules and assign a rule to each user , default: member
*/
