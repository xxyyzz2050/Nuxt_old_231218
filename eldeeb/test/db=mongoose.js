//Native mongoose (not eldeeb/db_mongoDB)
const mongo = require('mongoose');
dbLogin=["xxyyzz2050","Xx159753@@","cluster-test-shard-00-00-kuwit.gcp.mongodb.net:27017,cluster-test-shard-00-01-kuwit.gcp.mongodb.net:27017,cluster-test-shard-00-02-kuwit.gcp.mongodb.net:27017","test"],
dbLogin="mongodb://"+encodeURIComponent(dbLogin[0])+":"+encodeURIComponent(dbLogin[1])+"@"+dbLogin[2]+"/"+dbLogin[3]
options={ssl:true,replicaSet:"Cluster-test-shard-0",authSource:"admin",retryWrites:true,useNewUrlParser:true},
mongo.set('debug', true);
db=mongo.createConnection(dbLogin,options,function(status,db){
console.log("status: ",status)

mySchema=new mongo.Schema({ name: String, email:String },{collection:"users",autoIndex:false}); console.log(mySchema)
myModel=db.model("users",mySchema)

  //console.log("MyModel",myModel,"\n==========\n",mySchema)


///////nx: mongoose queries not run
  myModel.findOne({name:"test"},function(error, data) {
       console.log("findOne",error,data);
  });

 user=new myModel({name:"test2"})
// user.save(function(x,y){console.log("save",x,y);})



//console.log("DB",db)


});
