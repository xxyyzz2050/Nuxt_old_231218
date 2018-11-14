module.exports = {
  title: 'string',
  subtitle: 'string',
  category: 'ObjectId',
  keywords: ['ObjectId'],
  desc: 'string',
  owner: 'ObjectId', //creator
  fb_pages: ['string'],
  meta: ['string'], //ex: [hidden,series,closed]
  //admins: ['string'], //nx: replace with rules
  rules: ['ObjectId'], //rules created by this group owners
  status: 'string', //approved,pending,rejected
  status_history: ['map'],
  stars: 'number', //by voting + site admin desision + activities
  link: 'string', //must be unique (same as usernames) /group/link
  notes: ['map'],
  target: 'ObjectId'
}

/*
group admins may create rules and assign a rule to each user , default: member
*/
