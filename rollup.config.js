const commonjs = require('rollup-plugin-commonjs')
const babelrc = require('babelrc-rollup').default
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const uglify = require('rollup-plugin-uglify')

module.exports = {
  input: 'index.js',
  output: {
    file: 'browser.js',
    name: 'UniversalLexer',
    exports: 'named',
    format: 'umd'
  },
  plugins: [
    resolve(),
    commonjs({
      ignore: [ 'conditional-runtime-dependency' ]
    }),
    babel(babelrc()),
    uglify({
      mangle: {
        reserved: [
          'Token',
          'Lexer',
          'TokenDefinition',
          'SingleCharTokenDefinition',
          'RegexpTokenDefinition',
          'ValueTokenDefinition',
          'LexerProcessor',
          'NamedRegExp'
        ]
      }
    })
  ]
}
