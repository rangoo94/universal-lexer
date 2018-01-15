const Lexer = require('./Lexer')
const buildRegExp = require('./buildNamedRegularExpression')

/**
 * Parse definition to have correct format
 *
 * @param {{ type: string, regex: string, [regexFlags]: string, [valid]: string, [validFlags]: string }} definition
 */
function parseDefinition (definition) {
  // Validate definition type
  if (!definition.type) {
    throw new Error('Token definition should have a type.')
  }

  // Validate definition regex
  if (!definition.regex) {
    throw new Error('Token definition should have a regular expression.')
  }

  // Build regular expressions
  const regex = buildRegExp('^(' + definition.regex + ')', definition.regexFlags)
  const validation = (definition.valid ? buildRegExp('^(' + definition.valid + ')', definition.validFlags) : regex)

  // Resolve definition
  return {
    type: definition.type,
    regex: regex,
    validation: validation
  }
}

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
  const rules = definitions.map(parseDefinition)

  // Build lexer
  return new Lexer(rules)
}

module.exports = buildLexerFromDefinitions
