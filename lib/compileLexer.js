const buildLexerCode = require('./buildLexerCode')

/**
 * Compiler lexer to use it dynamically
 *
 * @param {object[]} definitions
 * @returns {function(string)|function(string, function)}
 */
function compileLexer (definitions) {
  // eslint-disable-next-line
  return new Function(`return ${buildLexerCode(definitions)}`)()
}

module.exports = compileLexer
