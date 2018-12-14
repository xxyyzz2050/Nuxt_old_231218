"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

//convert data (called by _install.js)
//use /_babel.bat to transpile files and then run this file from _babel folder
//use rowid temporary to join data, replace it with objectID

/* ObjectID = require('mongodb').ObjectID; _id=ObjectID() */
//nx: create shortId for each entry
var eldeeb = require('../eldeeb/').default,
    ObjectID = require('mongodb').ObjectID,
    fs = require('fs'),
    shortId = require('shortid').generate;

var _default = eldeeb.promise(function (resolve, reject) {
  for (var i = 1; i < 5; i++) {
    var dir = "./__db/step".concat(i);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  function write(file, data, step) {
    if (!step) step = 1;

    try {
      fs.writeFileSync("./__db/step".concat(step, "/").concat(file, ".json"), JSON.stringify(data));
      console.log("write: ".concat(file, ": OK"));
    } catch (err) {
      if (!write) throw {
        msg: "step ".concat(step, ": write: ").concat(file, " err"),
        error: err
      };
    }
  } //var locations = {}
  //first insert all countries & cities (type=country/city) +translations

  /*for (let i = 0; i < users.length; i++) {
    item = table[i]
    if (!item['country']) continue
    locations[item['country']] = item['city']
  }*/


  var step = 0; //-----------step 1: put every table in a separate file ($db_$table)

  console.log("===========step: ".concat(++step, "=============="));
  var files = fs.readdirSync("./__db/step".concat(step - 1));
  if (!files) throw {
    msg: "step ".concat(step, ": no files"),
    error: null
  };

  for (var f in files) {
    var file = files[f];

    if (file.indexOf('-data.json') > -1) {
      var fileName = file.replace('-data.json', ''),
          data = require("./__db/step".concat(step - 1, "/").concat(file));

      for (var table in data) {
        write("".concat(fileName, "_").concat(table), data[table], step);
      }
    }
  }

  var roles = [{
    _id: ObjectID(),
    name: 'owner',
    permissions: {
      all: true
    },
    //all permissions granted in all scopes
    scope: 'all' //some roles give all permissions in a limited scope

  }, {
    _id: ObjectID(),
    name: 'new member',
    permissions: {
      articles: 'all',
      comment: true,
      message: 10 //daily sending limit; 0=unlimited, false=banned

    },
    //=article:['write', 'modify', 'delete']; comment includes: replies and reactions
    scope: {
      articles: 'own',
      comment: 'any',
      message: 'any' //modify own article, comment on any article; can send message to anyone, message=[friends of friends,admins,targets=[_id]]; message may be limited by targets (locations,age,...)

    }
  }];
  write('roles', roles, 4);
  write('keywords', [], 4); //-----------step 2: add mongoDB fields (_id,shortId,modifiedAt,..)

  console.log("===========step: ".concat(++step, "=============="));
  files = fs.readdirSync("./__db/step".concat(step - 1));
  if (!files) throw {
    msg: "step ".concat(step, ": no files"),
    error: null
  };

  var item,
      rel = {},
      keywords = require("./__db/step4/keywords.json");

  for (var _f in files) {
    var _file = files[_f];
    if (_file.indexOf('.json') == -1) continue;

    var _fileName = _file.replace('.json', '');

    rel[_fileName] = {};
    console.log('file:', _fileName);

    var _data = require("./__db/step".concat(step - 1, "/").concat(_file));

    for (var _i = 0; _i < _data.length; _i++) {
      item = _data[_i];
      if (!item['time']) item['time'] = Math.ceil(Date.now() / 1000);
      if (!item['modified']) item['modified'] = item['time'];
      item['_id'] = ObjectID(item['time']);
      item['modifiedAt'] = new Date(item['modified'] * 1000);

      if (_fileName == 'articles_groups' || _fileName == 'articles_topics' || _fileName == 'u_users') {
        item['shortId'] = shortId();
      }

      if (item['expire'] && item['expire'] > 0) {
        item['expireAt'] = new Date((item['time'] + item['expire'] * 24 * 60 * 60) * 1000);
      }

      item['extra'] = item['extra'] && item['extra'].trim() != '' ? {
        contacts: item['extra']
      } : {};

      if (item['keywords'] && item['keywords'].length > 0) {
        if (item['approved'] == 1 || !('approved' in item)) {
          //articles & categories
          var tmp = item['keywords'].split(',');
          item['keywords'] = [];

          for (var _i2 = 0; _i2 < tmp.length; _i2++) {
            console.log('keyword:', tmp[_i2]);
            var done = false;

            for (var ii = 0; ii < keywords.length; ii++) {
              if (keywords[ii]['text'] == tmp[_i2]) {
                item['keywords'].push(keywords[ii]['_id']);
                done = true;
                break;
              }
            }

            if (!done) {
              if (tmp[_i2].trim() == '') continue;
              var id = ObjectID();
              keywords.push({
                text: tmp[_i2].trim(),
                _id: id
              });
              item['keywords'].push(id);
            }
          }
        } else {
          item['extra']['keywords'] = item['keywords'];
          delete item['keywords'];
        }
      }

      delete item['time'];
      delete item['modified'];
      delete item['day'];
      delete item['expire'];

      for (var key in item) {
        if (item[key] == null) delete item[key];
      }

      rel[_fileName][item['rowid']] = item['_id'];
    }

    write(_fileName, _data, step);
  }

  write('_rel', rel, 1);
  write('keywords', keywords, 4); //write('object_keywords', object_keywords, 4) deprecated!
  //-------------------- /mongo fields
  //------ step 3: convert table structures ------//

  console.log("===========step: ".concat(++step, "=============="));
  rel = require("./__db/step".concat(step - 2, "/_rel.json"));

  function adjust(file, output, fn, del) {
    var data = fn(require("./__db/step".concat(step - 1, "/").concat(file, ".json")));

    if (del && del.length > 0) {
      for (var _item = 0; _item < data.length; _item++) {
        for (var _i3 = 0; _i3 < del.length; _i3++) {
          delete data[_item][del[_i3]];
        }
      }
    }

    write(output, data, step);
  }

  adjust('u_users', 'persons', function (data) {
    var roles = require("./__db/step4/roles.json"),
        users = [];

    for (var _i4 = 0; _i4 < data.length; _i4++) {
      item = data[_i4];
      item['name'] = [item['f_name'], item['m_name'], item['l_name']];
      item['birth'] = [item['birth_d'], item['birth_m'], item['birth_y']];
      if (item['email']) item['emails'] = [item['email']];

      if (item['mobiles'] && item['mobiles'] != '') {
        var mob = JSON.parse(item['mobiles']);
        item['mobiles'] = [];

        if (mob) {
          for (var _i5 = 0; _i5 < mob.length; _i5++) {
            if (mob[_i5] != '') item.mobiles.push(mob[_i5]);
          }
        }
      } else delete item['mobiles'];

      if (item['job_company']) item['jobs_history'] = [{
        company: item['job_company']
      }];
      if (item['gender'] == 'm') item['gender'] = 'male';else if (item['gender'] == 'f') item['gender'] = 'female';
      if (item['rowid'] < 11) item['flags'] = ['fk']; //nx: add to rules:admin

      if (item['type'] == 'a') item['role'] = roles[0]['_id'];else item['role'] = roles[1]['_id'];
      users.push({
        person: item['_id'],
        credit: 0
      });
    }

    return data;
  }, ['uid', 'f_name', 'm_name', 'l_name', 'birth_d', 'birth_m', 'birth_y', 'job_company', 'username', 'fk', 'type']); //---------

  adjust('articles_topics', 'articles', function (data) {
    var articles_content = [],
        articles_pending = [];

    for (var _i6 = 0; _i6 < data.length; _i6++) {
      item = data[_i6];
      item['author'] = rel['u_users'][item['user']];
      if (item['stars'] < 1) delete item['stars'];
      item['sources'] = item['source'];
      if (item['link_title'] && item['link_title'].trim() != '') item['link'] = item['link_title'];
      articles_content.push({
        _id: item['_id'],
        original: item['original_content'] //entities.decodeHTML(item['original_content'])

      });
    }

    item['status'] = item['approved'] == 1 ? 'approved' : 'pending';
    write('articles_content', articles_content, step);
    return data;
  }, ['user', 'approved', 'source', 'link_title', 'original_content', 'content', 'amp', 'instantArticles']); //---------

  adjust('articles_groups', 'categories', function (data) {
    for (var _i7 = 0; _i7 < data.length; _i7++) {
      var _item2 = data[_i7];
      _item2['name'] = _item2['title'];
      _item2['link'] = _item2['link_title'];
      _item2['desc'] = _item2['description'];
      _item2['fb_pages'] = _item2['fb_pages'].split(',');
      _item2['flags'] = [];
      if (_item2['series'] == 1) _item2['flags'].push('series');
      if (_item2['hidden'] == 1) _item2['flags'].push('hidden');
      if (_item2['flags'].length == 0) delete _item2['flags'];
      _item2['parent'] = rel['articles_groups'][_item2['parent']];
    }

    return data;
  }, ['title', 'link_title', 'description', 'series', 'hidden', 'owner']); //---------

  adjust('articles_topic_groups', 'article_categories', function (data) {
    for (var _i8 = 0; _i8 < data.length; _i8++) {
      var _item3 = data[_i8];
      _item3['article'] = rel['articles_topics'][_item3['topic']];
      _item3['category'] = rel['articles_groups'][_item3['group_id']]; //if (!item['article'] || !item['category']) delete data[i]
    }

    return data;
  }, ['topic', 'group_id', 'approved', 'modifiedAt', 'shortId']); //---------

  adjust('u_logins', 'logins', function (data) {
    for (var _i9 = 0; _i9 < data.length; _i9++) {
      var _item4 = data[_i9];
      _item4['user'] = rel['u_users'][_item4['user']];
      if (_item4['confirmed'] == 1) _item4['confirmed'] = ObjectID(_item4['_id']).getTimestamp();else delete _item4['confirmed'];
    }

    return data;
  }, []); //---------

  adjust('u_adsense', 'accounts', function (data) {
    var persons = require("./__db/step".concat(step, "/persons.json"));

    for (var _i10 = 0; _i10 < data.length; _i10++) {
      var _item5 = data[_i10];
      _item5['entry'] = {
        id: _item5['adsense_id'],
        channel: _item5['channel'],
        slot: _item5['slot'],
        auto: false
      };
      _item5['type'] = 'adsense'; //nx: person[_id].accounts=item['_id']

      for (var _i11 = 0; _i11 < persons.length; _i11++) {
        if (persons[_i11]['rowid'] == _item5['rowid']) {
          persons[_i11]['accounts'] = [_item5['_id']];
          break;
        }
      }
    }

    write('persons', persons, step);
    return data;
  }, ['adsense_id', 'channel', 'slot']);
  var countries = [],
      countriesText = JSON.parse('{"EG":"Egypt","AF":"Afghanistan","AL":"Albania","DZ":"Algeria","AO":"Angola","AR":"Argentina","AM":"Armenia","AU":"Australia","BH":"Bahrain","BD":"Bangladesh","BE":"Belgium","BA":"Bosnia , Herzegovina","BR":"Brazil","BG":"Bulgaria","BI":"Burundi","CM":"Cameroon","CA":"Canada","TD":"Chad","CL":"Chile","CN":"China","CO":"Columbia","KM":"Comoros","CG":"Congo","CR":"Costa Rica","CI":"Cote D Ivorie","CU":"Cuba","CY":"Cyprus","CZ":"Czech","DK":"Denmark","DJ":"Djibouti","EC":"Ecuador","SV":"El Salvador","GQ":"Equatorial-Guinea","ER":"Eritrea","ET":"Ethiopia","FI":"Finland","FR":"France","GA":"Gabon","GM":"Gambia","GE":"Georgia","DE":"Germany","GH":"Ghana","GI":"Gibraltar","GR":"Greece","GT":"Guatemala","GN":"Guinea","GW":"Guinea-Bissau","GY":"Guyana","HT":"Haiti","HM":"Heard , McDonald","HN":"Honduras","HK":"Hong Kong","HU":"Hungary","IS":"Iceland","IN":"India","ID":"Indonesia","IR":"Iran","IQ":"Iraq","IE":"Ireland","IL":"Israel","IT":"Italy","JM":"Jamaica","JP":"Japan","JO":"Jordan","KZ":"Kazakhstan","KE":"Kenya","KI":"Kiribati","KW":"Kuwait","KG":"Kyrgyzstan","LA":"Laos","LV":"Latvia","LB":"Lebanon","LS":"Lesotho","LR":"Liberia","LY":"Libya","LI":"Liechtenstein","LT":"Lithuania","LU":"Luxembourg","MO":"Macau","MK":"Macedonia","MG":"Madagascar","MW":"Malawi","MY":"Malaysia","MV":"Maldives","ML":"Mali","MT":"Malta","MH":"Marshall","MQ":"Martinique","MR":"Mauritania","MU":"Mauritius","YT":"Mayotte","MX":"Mexico","FM":"Micronesia","MD":"Moldova","MC":"Monaco","MN":"Mongolia","MS":"Montserrat","MA":"Morocco","MZ":"Mozambique","MM":"Myanmar (Burma)","NA":"Namibia","NR":"Nauru","NP":"Nepal","NL":"Netherlands","AN":"Netherlands Antilles","NC":"New Caledonia","NZ":"New Zealand","NI":"Nicaragua","NE":"Niger","NG":"Nigeria","NU":"Niue","NF":"Norfolk","KP":"North Korea","MP":"Northern Mariana","NO":"Norway","OM":"Oman","PK":"Pakistan","PW":"Palau","PA":"Panama","PG":"Papua New-Guinea","PY":"Paraguay","PE":"Peru","PH":"Philippines","PN":"Pitcairn","PL":"Poland","PT":"Portugal","PR":"Puerto Rico","QA":"Qatar","RE":"Reunion","RO":"Romania","RU":"Russia","RW":"Rwanda","SH":"Saint-Helena","KN":"Saint-Kitts , Nevis","LC":"Saint-Lucia","PM":"Saint-Pierre , Miquelon","VC":"Saint-Vincent , The Grenadines","SM":"San Marino","ST":"Sao Tome , Principe","SA":"Saudi Arabia","SN":"Senegal","SC":"Seychelles","SL":"Sierra Leone","SG":"Singapore","SK":"Slovak","SI":"Slovenia","SB":"Solomon","SO":"Somalia","ZA":"South-Africa","GS":"South-Georgia , South-Sandwich ","KR":"South-Korea","ES":"Spain","LK":"Sri Lanka","SD":"Sudan","SR":"Suriname","SJ":"Svalbard , Jan Mayen","SZ":"Swaziland","SE":"Sweden","CH":"Switzerland","SY":"Syria","TW":"Taiwan","TJ":"Tajikistan","TZ":"Tanzania","TH":"Thailand","TG":"Togo","TK":"Tokelau","TO":"Tonga","TT":"Trinidad , Tobago","TN":"Tunisia","TR":"Turkey","TM":"Turkmenistan","TC":"Turks , Caicos","TV":"Tuvalu","UG":"Uganda","UA":"Ukraine","AE":"United-Arab Emirates","UK":"United-Kingdom","US":"United-States","UM":"United-States Minor Outlying","UY":"Uruguay","UZ":"Uzbekistan","VU":"Vanuatu","VA":"Vatican City (Holy See)","VE":"Venezuela","VN":"Vietnam","VG":"Virgin (British)","VI":"Virgin (US)","WF":"Wallis , Futuna","EH":"Western Sahara","WS":"Western Samoa","YE":"Yemen","YU":"Yugoslavia","ZM":"Zambia","ZW":"Zimbabwe"}'),
      languages = [{
    code: 'en',
    name: 'English',
    en: 'English'
  }, {
    code: 'ar',
    name: 'عربي',
    en: 'Arabic'
  }];

  for (var co in countriesText) {
    countries.push({
      _id: ObjectID(),
      code: co,
      name: countriesText[co],
      lang: 'en'
    });
  }

  write('countries', countries, 4);
  write('countries', languages, 4); //---------
  //------------------------ /convert table structures------------------------------
  //-------------------step 4 : remove null fields ---------------------------------

  console.log("===========step: ".concat(++step, "=============="));
  files = fs.readdirSync("./__db/step".concat(step - 1));

  for (var _f2 in files) {
    var _file2 = files[_f2];

    var _data2 = require("./__db/step".concat(step - 1, "/").concat(_file2));

    for (var _i12 = 0; _i12 < _data2.length; _i12++) {
      item = _data2[_i12];

      for (var _key in item) {
        if (item[_key] == null || item[_key] == '') delete item[_key];
      }

      delete item['rowid'];
    }

    write(_file2.replace('.json', ''), _data2, step);
  }

  resolve(); //-------------------/remove null fields ----------------------------------------
});

exports.default = _default;