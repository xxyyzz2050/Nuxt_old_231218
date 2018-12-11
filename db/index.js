/*
connects to db and returns a promise
usgae  require('index').then(db=>{==queries goes here==})
*/

//nx: in production mode convert theese files to .json (no comments)
import eldeeb from '../eldeeb/'
import { generate as shortId } from 'shortId'
import config from '../eldeeb.config.js'
import schema from './schema/objects.js'
//or function(options){options=eldeeb.merge(require('../eldeeb.config.js').db,options)}

export default {
  db: null,
  connect(options) {
    options = options || {}
    options = eldeeb.merge(config.db, options)
    options.debug = false
    return eldeeb.db('mongoDB', options).done(db => {
      //if (!db) Promise.reject('db=null!')
      this.db = db
      return db
    })
  },
  model(coll, obj) {
    let options,
      { model: objectsModel, schema: objectsSchema } = this.db.model(
        'objects',
        schema[0],
        { modifiedAt: true }
      )
    if (obj)
      options = {
        //adjust options for models that needs to be saved in the Objects collection
        fields: { modifiedAt: true },
        adjust: {
          statics: {
            insertObj: function(doc, object) {
              //  console.log('this:', this)
              doc.shortId = shortId() //also it will be auto generated
              return this.create(doc).then(
                data => {
                  objectsModel.create({
                    shortId: data.shortId,
                    _id: data._id,
                    link: data.link,
                    object: object
                  })
                  return data
                },
                err => err
              )
            }
          }
        }
      }
    else
      options = {
        fields: { modifiedAt: true }
      }
    return this.db.model(
      coll,
      require(`./schema/${coll}.js`)[0], //or .json
      options
    )
  }
}

//.fail(err => console.log(err), true) //nx: save errors ->gives error
