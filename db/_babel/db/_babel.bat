:: transpile with babel & run in inspect mose

:: transpile js file using babel to support using ES module system (import&export) via cli (ex: running db/_convert.js)
:: you have to change paths (or use absolute paths)
:: https://babeljs.io/docs/en/babel-cli
:: install @babel/core,cli,preset-env
:: import @babel/polifill in the entry file (must be at the first line)
:: --out-dir will create the directory, but --out-file not, so put _babel/eldeeb.config.js after any directory output
 
call npx babel . --out-dir _babel/db  --presets=@babel/preset-env --copy-files
call npx babel ../eldeeb.config.js --out-file _babel/eldeeb.config.js --presets=@babel/preset-env
call npx babel ../eldeeb --out-dir _babel/eldeeb  --presets=@babel/preset-env --copy-files

