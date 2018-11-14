//convert data
users = require('../__db/data-u.json')

var locations = {}
//first insert all countries & cities (type=country/city) +translations
for (let i = 0; i < users['users'].length; i++) {
  u = users['users'][i]
  if (!u['country']) continue
  locations[u['country']] = u['city']
}

for (let i = 0; i < users['users'].length; i++) {
  u = users['users'][i]
  //nx: u['uid'] ->timeStamp
  //nx: insert country,city to locations ; type,fk=>rules
  //nx: time=>createdAt ->Date object

  u['name'] = [u['f_name'], u['m_name'], u['l_name']]
  u['birth'] = [u['birth_d'], u['birth_m'], u['birth_y']]
  u['emails'] = [u['email']]
  if (u['mobiles']) u['mobiles'] = JSON.parse(u['mobiles'])
  else delete u['mobiles']

  if (u['job_company']) u['jobs_history'] = [{ company: u['job_company'] }]

  delete u['f_name']
  delete u['m_name']
  delete u['l_name']
  delete u['birth_d']
  delete u['birth_m']
  delete u['birth_y']
  delete u['job_company']
  delete u['username']
  //break
}

console.log('u', typeof users['users'][0])
