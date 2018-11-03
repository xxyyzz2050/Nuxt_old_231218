module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: ['plugin:vue/recommended', 'plugin:prettier/recommended'],
  // required to lint *.vue files
  plugins: ['vue', 'prettier', 'eslint-plugin-html'],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
  /*processors: { //https://github.com/eslint/eslint/issues/5121; gives: Unexpected top-level property "processors".
    ".js": {
        preprocess: function (text, filename) {
            return [text];
        },
        postprocess: function (messages, filename) {
            return messages[0];
        },
        allowFixes: true
    }
}*/
}
