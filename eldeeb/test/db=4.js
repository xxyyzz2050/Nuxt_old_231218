//test: eldeeb/db-mongoDB with callback(), deprecated! now it uses promises

const insert = false

var eldeeb =  require('../lib/index.js'),

  options = {
    //  uri:"mongodb://xxyyzz2050:Xxyyzz2050%40%40@cluster-test-shard-00-00-kuwit.gcp.mongodb.net:27017,cluster-test-shard-00-01-kuwit.gcp.mongodb.net:27017,cluster-test-shard-00-02-kuwit.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster-test-shard-0&authSource=admin&retryWrites=true",
    user: 'xxyyzz2050', //use uri OR user,pass,host
    pass: 'Xx159753@@',
    host:
      'cluster-test-shard-00-00-kuwit.gcp.mongodb.net:27017,cluster-test-shard-00-01-kuwit.gcp.mongodb.net:27017,cluster-test-shard-00-02-kuwit.gcp.mongodb.net:27017',
    db: 'test',
    debug: false,
    ssl: true,
    replicaSet: 'Cluster-test-shard-0',
    authSource: 'admin',
    retryWrites: true
    //,debug:false,keepAlive: 1, connectTimeoutMS: 30000,
  },


mongo = eldeeb.db("mongoDB",options, function(status, db) { //or: db=eldeeb.db(); mongo=db(options,callback) ; or mongo=(options,callback)
  //also returns the current connection i.e db=mongo.connect()
  console.log('status: ', status)
  if (status == 'open') {
    console.log('==start db queries ==')

    let { model: myModel, schema: mySchema } = /*{ model: myModel, schema: mySchema }*/ = mongo.model('users', {
      name: String,
      email: String
    })
    //console.log("MyModel",myModel,"\n==========\n",mySchema)
    myModel.findOne(function(x, y) {
      console.log('==findOne==', x, y)
    })
    myModel.findOne({ name: 'test' }, function(error, data) {
      console.log('==findOne2==', error, data)
    }) //nx: returns null, why?
    myModel.findOne({ name: 'test2' }, function(error, data) {
      console.log('==findOne3==', error, data)
    })
    myModel.findById('5bc84830d01f7c0bf0aee6a1', function(error, data) {
      console.log('==findById==', error, data)
    })
    myModel.find({}, function(error, data) {
      console.log('==find==', error, data)
    })
    //mongoose only brings the records that saved by it

    user = new myModel({ name: 'test2' })
    if (insert)
      user.save(function(x, y) {
        console.log('save', x, y)
      })
  } else if (status == 'error' || status == 'mongooseError')
    console.error('Error', status, db)

  //console.log("==DB==",db)
})
