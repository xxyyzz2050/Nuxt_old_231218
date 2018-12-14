"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var mode = process.env.NODE_ENV || 'development'; //npm dev, check package.json->scripts

var _default = {
  root: 'D:/Downloads/__projects/NodeJs/almogtama3.com/',
  db: {
    user: 'xxyyzz2050',
    pass: process.env.dbPass || 'Xx159753@@',
    host: mode == 'development' ? 'cluster-test-kuwit.gcp.mongodb.net' : 'almogtama3-gbdqa.gcp.mongodb.net',
    srv: true,
    db: mode == 'development' ? 'test' : 'database',
    debug: mode == 'development' ? true : false,
    models: '../../db/schema',
    //related to eldeeb/lib/db-mongoDB
    ext: 'js'
  },

  /* Old connection
    {
      //  uri:"mongodb://xxyyzz2050:Xxyyzz2050%40%40@cluster-test-shard-00-00-kuwit.gcp.mongodb.net:27017,cluster-test-shard-00-01-kuwit.gcp.mongodb.net:27017,cluster-test-shard-00-02-kuwit.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster-test-shard-0&authSource=admin&retryWrites=true",
      user: 'xxyyzz2050', //use uri OR user,pass,host
      pass: 'Xx159753@@',
      host:
        'cluster-test-shard-00-00-kuwit.gcp.mongodb.net:27017,cluster-test-shard-00-01-kuwit.gcp.mongodb.net:27017,cluster-test-shard-00-02-kuwit.gcp.mongodb.net:27017',
      db: mode == 'development' ? 'test' : 'database',
      debug: false,
      ssl: true,
      replicaSet: 'Cluster-test-shard-0',
      authSource: 'admin',
      retryWrites: true,
      models: './models', //related to eldeeb/lib/db-mongoDB
      ext: 'js'
      //,debug:false,keepAlive: 1, connectTimeoutMS: 30000,
    },
    */
  github: ['xxyyzz2050@gmail.com', 'Xx159753@@', '$key'] //_id: 5be92fb487e94116ac606ffe

};
exports.default = _default;
