call npx babel ts.js --out-file _babel/db/ts.js --presets=@babel/preset-env
:: call npx babel ../eldeeb/lib/db-mongoDB.js --out-file _babel/eldeeb/lib/db-mongoDB.js --presets=@babel/preset-env
:: call npx babel ../eldeeb/lib/db-mongoDB-schema.js --out-file _babel/eldeeb/lib/db-mongoDB-schema.js --presets=@babel/preset-env
:: call npx babel ../eldeeb/lib/db-mongoDB-model.js --out-file _babel/eldeeb/lib/db-mongoDB-model.js --presets=@babel/preset-env 
call node --inspect _babel/db/ts.js 