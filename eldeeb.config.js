const mode = process.env.NODE_ENV || 'development' //from packages.json->scripts

module.exports = {
  root: 'D:/Downloads/__projects/NodeJs/almogtama3.com/',
  db: {
    //  uri:"mongodb://xxyyzz2050:Xxyyzz2050%40%40@cluster-test-shard-00-00-kuwit.gcp.mongodb.net:27017,cluster-test-shard-00-01-kuwit.gcp.mongodb.net:27017,cluster-test-shard-00-02-kuwit.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster-test-shard-0&authSource=admin&retryWrites=true",
    user: 'xxyyzz2050', //use uri OR user,pass,host
    pass: 'Xx159753@@',
    host:
      'cluster-test-shard-00-00-kuwit.gcp.mongodb.net:27017,cluster-test-shard-00-01-kuwit.gcp.mongodb.net:27017,cluster-test-shard-00-02-kuwit.gcp.mongodb.net:27017',
    db: mode=="development"?'test':'database',
    debug: false,
    ssl: true,
    replicaSet: 'Cluster-test-shard-0',
    authSource: 'admin',
    retryWrites: true,
    models: './models'
    //,debug:false,keepAlive: 1, connectTimeoutMS: 30000,
  },
  github: ['email', 'pass', 'key']
}
//_id: 5be92fb487e94116ac606ffe
