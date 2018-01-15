const Lexer = require('./lib/Lexer')
const buildLexerFromDefinitions = require('./lib/buildLexerFromDefinitions')
const buildLexerFromFile = require('./lib/buildLexerFromFile')
const HTML = require('./lib/HTML')

exports.Lexer = Lexer
exports.fromFile = buildLexerFromFile
exports.fromDefinitions = buildLexerFromDefinitions
exports.HTML = HTML
