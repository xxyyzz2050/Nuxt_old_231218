module.exports = [
  {
    //shortId: { type: string, default: require('shortid').generate },
    title: 'string',
    subtitle: 'string',
    category: { type: 'ObjectId', ref: 'categories' },
    keywords: ['ObjectId'],
    desc: 'string',
    owner: { type: 'ObjectId', ref: 'persons' }, //creator
    fb_pages: ['string'],
    meta: ['string'], //ex: [hidden,series,closed]
    //admins: ['string'], //nx: replace with roles
    roles: [{ type: 'ObjectId', ref: 'roles' }], //roles created by this group owners
    status: 'string', //approved,pending,rejected
    status_history: ['mixed'],
    stars: 'number', //by voting + site admin desision + activities
    link: 'string', //must be unique (same as usernames) /group/link
    notes: ['mixed'],
    target: { type: 'ObjectId', ref: 'targets' },
    modifiedAt: { type: Date, default: Date.now }
  },
  { category: 1, stars: -1 },
  { stars: -1, category: 1 }
]

/*
groups are created by any member, and related to one or more categories
group admins may create roles and assign a role to each user , default: member
*/
