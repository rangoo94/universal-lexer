const TokenDefinition = require('./TokenDefinition')
const RegexpTokenDefinition = require('./RegexpTokenDefinition')
const SingleCharTokenDefinition = require('./SingleCharTokenDefinition')
const ValueTokenDefinition = require('./ValueTokenDefinition')

const buildRegExp = require('./buildNamedRegularExpression')

/**
 * Build correct type of token definition,
 * For more efficient matching.
 * It's not split into TokenDefinition and N matchers, as it seems to be way slower.
 *
 * @param {{ type: string, [regex]: string, [value]: string, [regexFlags]: string, [valid]: string, [validFlags]: string }} definition
 * @returns {TokenDefinition|RegexpTokenDefinition|SingleCharTokenDefinition|ValueTokenDefinition}
 */
function buildTokenDefinition (definition) {
  // Validate if definition is an object
  if (!definition || typeof definition !== 'object') {
    throw new Error('Token definition should be an object.')
  }

  const { type, regex, regexFlags, value, valid, validFlags } = definition

  // Validate definition type
  if (!type) {
    throw new Error('Token definition should have a type.')
  }

  // Validate definition regex
  if (!regex && !value) {
    throw new Error(`${type}: Token definition should have a regular expression or value.`)
  }

  // Validate if field has only regex or value
  if (value && (regex || valid)) {
    throw new Error(`${type}: Token definition with value shouldn't contain 'regex' and 'valid' fields.`)
  }

  // Build token definition for value-based tokens
  if (value) {
    if (value.length === 1) {
      return new SingleCharTokenDefinition(type, value)
    }

    return new ValueTokenDefinition(type, value)
  }

  // Build regular expressions
  const expression = buildRegExp('^(' + regex + ')', regexFlags)
  const validation = valid ? buildRegExp('^(' + valid + ')', validFlags) : null

  // We don't need named groups from validation regexp, so we can cut them
  const validRegex = validation && validation.regex ? validation.regex : validation

  // Build token definition for tokens with regular expressions
  if (validation) {
    return new TokenDefinition(type, expression, validRegex)
  }

  return new RegexpTokenDefinition(type, expression)
}

module.exports = buildTokenDefinition
