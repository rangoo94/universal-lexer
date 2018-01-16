const Lexer = require('./Lexer')
const buildTokenDefinition = require('./buildTokenDefinition')

/**
 * Build lexer from array of definitions
 *
 * @param {object[]} definitions
 * @returns {Lexer}
 */
function buildLexerFromDefinitions (definitions) {
  // Validate definitions
  if (!definitions || !Array.isArray(definitions) || !definitions.length) {
    throw new Error('You have to provide definitions.')
  }

  // Parse all definitions
  const rules = definitions.map(buildTokenDefinition)

  // Build lexer
  return new Lexer(rules)
}

module.exports = buildLexerFromDefinitions
