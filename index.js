const buildLexerCode = require('./lib/buildLexerCode')
const buildLexerCodeFromFile = require('./lib/buildLexerCodeFromFile')

const compileLexer = require('./lib/compileLexer')
const compileLexerFromFile = require('./lib/compileLexerFromFile')

exports.build = buildLexerCode
exports.buildFromFile = buildLexerCodeFromFile
exports.compile = compileLexer
exports.compileFromFile = compileLexerFromFile
