"use strict";

module.exports = [{
  //permission roles for all site parts, ex: articles, admin panel, insights, user info,...
  name: 'string',
  //owner,admins,moderators,editors,authors,members,visitors,.. or any custom name
  permissions: {
    type: 'map',
    of: 'string'
  },
  //{modify,create,delete,scope:overrides roles.scope};
  scope: 'mixed',
  // default scope for this role where this role is valid ,ex: some groups, some users,...
  modifiedAt: {
    type: Date,
    default: Date.now
  }
}];