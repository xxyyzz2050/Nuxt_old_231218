"use strict";

//test: eldeeb.db_mongoDB.Schema != NATIVE mongoose.Schema
var mongoDB = require('../lib/db-mongoDB.js'),
    mongoose = require('mongoose'),
    mongo = new mongoDB({});

console.log("==eldeeb==", mongo.Schema); //WRONG

console.log("==mongoose==", mongoose.Schema);
console.log("=====SchemaType====", mongo.SchemaType); //OK