//convert data (called by _install.js)
//use rowid temporary to join data, replace it with objectID
/* ObjectID = require('mongodb').ObjectID; _id=ObjectID() */
//nx: create shortId for each entry
const eldeeb = require('../eldeeb/'),
  ObjectID = require('mongodb').ObjectID,
  fs = require('fs'),
  shortId = require('shortid').generate

module.exports = eldeeb.promise((resolve, reject) => {
  for (let i = 1; i < 5; i++) {
    dir = `./__db/step${i}`
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  }

  function write(file, data, step) {
    if (!step) step = 1
    try {
      fs.writeFileSync(`./__db/step${step}/${file}.json`, JSON.stringify(data))
      console.log(`write: ${file}: OK`)
    } catch (err) {
      if (!write) throw { msg: `step ${step}: write: ${file} err`, error: err }
    }
  }

  //var locations = {}
  //first insert all countries & cities (type=country/city) +translations
  /*for (let i = 0; i < users.length; i++) {
    item = table[i]
    if (!item['country']) continue
    locations[item['country']] = item['city']
  }*/
  var step = 0
  //-----------step 1: put every table in a separate file ($db_$table)
  console.log(`===========step: ${++step}==============`)
  files = fs.readdirSync(`./__db/step${step - 1}`)
  if (!files) throw { msg: `step ${step}: no files`, error: null }
  for (let f in files) {
    file = files[f]
    if (file.indexOf('-data.json') > -1) {
      let fileName = file.replace('-data.json', ''),
        data = require(`./__db/step${step - 1}/${file}`)
      for (let table in data) {
        write(`${fileName}_${table}`, data[table], step)
      }
    }
  }

  let roles = [
    {
      _id: ObjectID(),
      name: 'owner',
      permissions: { all: true }, //all permissions granted in all scopes
      scope: 'all' //some roles give all permissions in a limited scope
    },
    {
      _id: ObjectID(),
      name: 'new member',
      permissions: {
        articles: 'all',
        comment: true,
        message: 10 //daily sending limit; 0=unlimited, false=banned
      }, //=article:['write', 'modify', 'delete']; comment includes: replies and reactions
      scope: { articles: 'own', comment: 'any', message: 'any' } //modify own article, comment on any article; can send message to anyone, message=[friends of friends,admins,targets=[_id]]; message may be limited by targets (locations,age,...)
    }
  ]
  write('roles', roles, 4)
  write('keywords', [], 4)

  //-----------step 2: add mongoDB fields (_id,shortId,modifiedAt,..)
  console.log(`===========step: ${++step}==============`)
  files = fs.readdirSync(`./__db/step${step - 1}`)
  if (!files) throw { msg: `step ${step}: no files`, error: null }
  var item,
    rel = {},
    keywords = require(`./__db/step4/keywords.json`)
  for (let f in files) {
    file = files[f]
    if (file.indexOf('.json') == -1) continue
    let fileName = file.replace('.json', '')
    rel[fileName] = {}
    console.log('file:', fileName)
    let data = require(`./__db/step${step - 1}/${file}`)
    for (let i = 0; i < data.length; i++) {
      item = data[i]
      if (!item['time']) item['time'] = Math.ceil(Date.now() / 1000)
      if (!item['modified']) item['modified'] = item['time']
      item['_id'] = ObjectID(item['time'])
      item['modifiedAt'] = new Date(item['modified'] * 1000)
      if (
        fileName == 'articles_groups' ||
        fileName == 'articles_topics' ||
        fileName == 'u_users'
      ) {
        item['shortId'] = shortId()
      }
      if (item['expire'] && item['expire'] > 0) {
        item['expireAt'] = new Date(
          (item['time'] + item['expire'] * 24 * 60 * 60) * 1000
        )
      }
      item['extra'] =
        item['extra'] && item['extra'].trim() != ''
          ? { contacts: item['extra'] }
          : {}
      if (item['keywords'] && item['keywords'].length > 0) {
        if (item['approved'] == 1 || !('approved' in item)) {
          //articles & categories
          var tmp = item['keywords'].split(',')
          item['keywords'] = []
          for (let i = 0; i < tmp.length; i++) {
            console.log('keyword:', tmp[i])
            var done = false
            for (let ii = 0; ii < keywords.length; ii++) {
              if (keywords[ii]['text'] == tmp[i]) {
                item['keywords'].push(keywords[ii]['_id'])
                done = true
                break
              }
            }
            if (!done) {
              if (tmp[i].trim() == '') continue
              let id = ObjectID()
              keywords.push({ text: tmp[i].trim(), _id: id })
              item['keywords'].push(id)
            }
          }
        } else {
          item['extra']['keywords'] = item['keywords']
          delete item['keywords']
        }
      }

      delete item['time']
      delete item['modified']
      delete item['day']
      delete item['expire']

      for (var key in item) {
        if (item[key] == null) delete item[key]
      }

      rel[fileName][item['rowid']] = item['_id']
    }

    write(fileName, data, step)
  }
  write('_rel', rel, 1)
  write('keywords', keywords, 4)
  //write('object_keywords', object_keywords, 4) deprecated!

  //-------------------- /mongo fields
  //------ step 3: convert table structures ------//
  console.log(`===========step: ${++step}==============`)
  var rel = require(`./__db/step${step - 2}/_rel.json`)

  function adjust(file, output, fn, del) {
    var data = require(`./__db/step${step - 1}/${file}.json`)
    data = fn(data)
    if (del && del.length > 0) {
      for (let item = 0; item < data.length; item++) {
        for (let i = 0; i < del.length; i++) {
          delete data[item][del[i]]
        }
      }
    }
    write(output, data, step)
  }

  adjust(
    'u_users',
    'persons',
    data => {
      var roles = require(`./__db/step4/roles.json`),
        users = []
      for (let i = 0; i < data.length; i++) {
        item = data[i]
        item['name'] = [item['f_name'], item['m_name'], item['l_name']]
        item['birth'] = [item['birth_d'], item['birth_m'], item['birth_y']]
        if (item['email']) item['emails'] = [item['email']]
        if (item['mobiles'] && item['mobiles'] != '') {
          let mob = JSON.parse(item['mobiles'])
          item['mobiles'] = []
          if (mob) {
            for (let i = 0; i < mob.length; i++) {
              if (mob[i] != '') item.mobiles.push(mob[i])
            }
          }
        } else delete item['mobiles']

        if (item['job_company'])
          item['jobs_history'] = [{ company: item['job_company'] }]
        if (item['gender'] == 'm') item['gender'] = 'male'
        else if (item['gender'] == 'f') item['gender'] = 'female'
        if (item['rowid'] < 11) item['flags'] = ['fk'] //nx: add to rules:admin
        if (item['type'] == 'a') item['role'] = roles[0]['_id']
        else item['role'] = roles[1]['_id']

        users.push({ person: item['_id'], credit: 0 })
      }
      return data
    },
    [
      'uid',
      'f_name',
      'm_name',
      'l_name',
      'birth_d',
      'birth_m',
      'birth_y',
      'job_company',
      'username',
      'fk',
      'type'
    ]
  )

  //---------

  adjust(
    'articles_topics',
    'articles',
    data => {
      var articles_content = [],
        articles_pending = []
      for (let i = 0; i < data.length; i++) {
        item = data[i]
        item['author'] = rel['u_users'][item['user']]
        if (item['stars'] < 1) delete item['stars']
        item['sources'] = item['source']
        if (item['link_title'] && item['link_title'].trim() != '')
          item['link'] = item['link_title']

        articles_content.push({
          article: item['_id'],
          original: item['original_content']
        })
      }

      item['status'] = item['approved'] == 1 ? 'approved' : 'pending'
      write('articles_content', articles_content, step)
      return data
    },
    [
      'user',
      'approved',
      'source',
      'link_title',
      'original_content',
      'amp',
      'instantArticles'
    ]
  )

  //---------

  adjust(
    'articles_groups',
    'categories',
    data => {
      for (let i = 0; i < data.length; i++) {
        item = data[i]
        item['name'] = item['title']
        item['link'] = item['link_title']
        item['desc'] = item['description']
        item['fb_pages'] = item['fb_pages'].split(',')
        item['flags'] = []
        if (item['series'] == 1) item['flags'].push('series')
        if (item['hidden'] == 1) item['flags'].push('hidden')
        if (item['flags'].length == 0) delete item['flags']
        item['parent'] = rel['articles_groups'][item['parent']]
      }

      return data
    },
    ['title', 'link_title', 'description', 'series', 'hidden', 'owner']
  )

  //---------

  adjust(
    'articles_topic_groups',
    'article_categories',
    data => {
      for (let i = 0; i < data.length; i++) {
        item = data[i]
        item['article'] = rel['articles_topics'][item['topic']]
        item['category'] = rel['articles_groups'][item['group_id']]

        //if (!item['article'] || !item['category']) delete data[i]
      }
      return data
    },
    ['topic', 'group_id', 'approved', 'modifiedAt', 'shortId']
  )

  //---------

  adjust(
    'u_logins',
    'logins',
    data => {
      for (let i = 0; i < data.length; i++) {
        item = data[i]
        item['user'] = rel['u_users'][item['user']]
        if (item['confirmed'] == 1)
          item['confirmed'] = ObjectID(item['_id']).getTimestamp()
        else delete item['confirmed']
      }
      return data
    },
    []
  )

  //---------

  adjust(
    'u_adsense',
    'accounts',
    data => {
      var persons = require(`./__db/step${step}/persons.json`)
      for (let i = 0; i < data.length; i++) {
        item = data[i]
        item['entry'] = {
          id: item['adsense_id'],
          channel: item['channel'],
          slot: item['slot'],
          auto: false
        }
        item['type'] = 'adsense'
        //nx: person[_id].accounts=item['_id']

        for (let i = 0; i < persons.length; i++) {
          if (persons[i]['rowid'] == item['rowid']) {
            persons[i]['accounts'] = [item['_id']]
            break
          }
        }
      }
      write('persons', persons, step)
      return data
    },
    ['adsense_id', 'channel', 'slot']
  )

  let countries = [],
    countriesText = JSON.parse(
      '{"EG":"Egypt","AF":"Afghanistan","AL":"Albania","DZ":"Algeria","AO":"Angola","AR":"Argentina","AM":"Armenia","AU":"Australia","BH":"Bahrain","BD":"Bangladesh","BE":"Belgium","BA":"Bosnia , Herzegovina","BR":"Brazil","BG":"Bulgaria","BI":"Burundi","CM":"Cameroon","CA":"Canada","TD":"Chad","CL":"Chile","CN":"China","CO":"Columbia","KM":"Comoros","CG":"Congo","CR":"Costa Rica","CI":"Cote D Ivorie","CU":"Cuba","CY":"Cyprus","CZ":"Czech","DK":"Denmark","DJ":"Djibouti","EC":"Ecuador","SV":"El Salvador","GQ":"Equatorial-Guinea","ER":"Eritrea","ET":"Ethiopia","FI":"Finland","FR":"France","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GT":"Guatemala","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HM":"Heard , McDonald","HN":"Honduras","HK":"Hong Kong","HU":"Hungary","IS":"Iceland","IN":"India","ID":"Indonesia","IR":"Iran","IQ":"Iraq","IE":"Ireland","IL":"Israel","IT":"Italy","JM":"Jamaica","JP":"Japan","JO":"Jordan","KZ":"Kazakhstan","KE":"Kenya","KI":"Kiribati","KW":"Kuwait","KG":"Kyrgyzstan","LA":"Laos","LV":"Latvia","LB":"Lebanon","LS":"Lesotho","LR":"Liberia","LY":"Libya","LI":"Liechtenstein","LT":"Lithuania","LU":"Luxembourg","MO":"Macau","MK":"Macedonia","MG":"Madagascar","MW":"Malawi","MY":"Malaysia","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","MX":"Mexico","FM":"Micronesia","MD":"Moldova","MC":"Monaco","MN":"Mongolia","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","MM":"Myanmar (Burma)","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","AN":"Netherlands Antilles","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","NF":"Norfolk","KP":"North Korea","MP":"Northern Mariana","NO":"Norway","OM":"Oman","PK":"Pakistan","PW":"Palau","PA":"Panama","PG":"Papua New-Guinea","PY":"Paraguay","PE":"Peru","PH":"Philippines","PN":"Pitcairn","PL":"Poland","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","RE":"Reunion","RO":"Romania","RU":"Russia","RW":"Rwanda","SH":"Saint-Helena","KN":"Saint-Kitts , Nevis","LC":"Saint-Lucia","PM":"Saint-Pierre , Miquelon","VC":"Saint-Vincent , The Grenadines","SM":"San Marino","ST":"Sao Tome , Principe","SA":"Saudi Arabia","SN":"Senegal","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SK":"Slovak","SI":"Slovenia","SB":"Solomon","SO":"Somalia","ZA":"South-Africa","GS":"South-Georgia , South-Sandwich ","KR":"South-Korea","ES":"Spain","LK":"Sri Lanka","SD":"Sudan","SR":"Suriname","SJ":"Svalbard , Jan Mayen","SZ":"Swaziland","SE":"Sweden","CH":"Switzerland","SY":"Syria","TW":"Taiwan","TJ":"Tajikistan","TZ":"Tanzania","TH":"Thailand","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad , Tobago","TN":"Tunisia","TR":"Turkey","TM":"Turkmenistan","TC":"Turks , Caicos","TV":"Tuvalu","UG":"Uganda","UA":"Ukraine","AE":"United-Arab Emirates","UK":"United-Kingdom","US":"United-States","UM":"United-States Minor Outlying","UY":"Uruguay","UZ":"Uzbekistan","VU":"Vanuatu","VA":"Vatican City (Holy See)","VE":"Venezuela","VN":"Vietnam","VG":"Virgin (British)","VI":"Virgin (US)","WF":"Wallis , Futuna","EH":"Western Sahara","WS":"Western Samoa","YE":"Yemen","YU":"Yugoslavia","ZM":"Zambia","ZW":"Zimbabwe"}'
    ),
    languages = [
      { code: 'en', name: 'English', en: 'English' },
      { code: 'ar', name: 'عربي', en: 'Arabic' }
    ]

  for (let co in countriesText) {
    countries.push({
      _id: ObjectID(),
      code: co,
      name: countriesText[co],
      lang: 'en'
    })
  }
  write('countries', countries, 4)
  write('countries', languages, 4)

  //---------

  //------------------------ /convert table structures------------------------------

  //-------------------step 4 : remove null fields ---------------------------------
  console.log(`===========step: ${++step}==============`)
  files = fs.readdirSync(`./__db/step${step - 1}`)
  for (let f in files) {
    file = files[f]
    data = require(`./__db/step${step - 1}/${file}`)
    for (let i = 0; i < data.length; i++) {
      item = data[i]
      for (let key in item) {
        if (item[key] == null || item[key] == '') delete item[key]
      }
      delete item['rowid']
    }
    write(file.replace('.json', ''), data, step)
  }

  resolve()

  //-------------------/remove null fields ----------------------------------------
})
