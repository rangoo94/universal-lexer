const buildNamedRegularExpression = require('./buildNamedRegularExpression')
const findRegexpBeginning = require('find-regexp-beginning')

/**
 * Validate if definition has correct format
 *
 * @param {{ type: string, [value]: string, [regex]: string, [regexFlags]: string, [valid]: string, [validFlags]: string }} definition
 * @param {string|int} uid
 * @throws {Error}
 */
function validateDefinition (definition, uid) {
  // Check if definition is an object
  if (!definition || typeof definition !== 'object') {
    throw new Error('Missing definition')
  }

  // Check if definition has UID
  if (uid === void 0) {
    throw new Error('Missing UID.')
  }

  // Check if definition has a type
  if (!definition.type) {
    throw new Error('Missing definition type.')
  }

  const hasRegex = definition.regex !== void 0
  const hasValue = definition.value !== void 0

  // Check if definition has only one of: regex or value
  if ((hasRegex && hasValue) || (!hasRegex && !hasValue)) {
    throw new Error(`Definition "${definition.type}" needs to have either 'regex' or 'value'.`)
  }
}

/**
 * Analyze definition with 'value' to get more information
 * and detect required strategy
 *
 * @param {{ type: string, value: string }} definition
 * @param {string|int} uid
 * @returns {{ uid: string, generic: boolean, type: string, strategy: string, characters: null|string[], strategy: string, value: string }}
 */
function analyzeValueDefinition (definition, uid) {
  // Convert value to string
  const value = '' + definition.value

  // Validate if value is not empty
  if (definition.value.length === 0) {
    throw new Error(`Definition "${definition.type}" can't have empty 'value'.`)
  }

  // Build information about this definition
  return {
    uid: uid,
    generic: false,
    type: definition.type,
    strategy: value.length === 1 ? 'character' : 'text',
    characters: [ value[0] ],
    value: value
  }
}

/**
 * Analyze definition to get more information
 * and detect required strategy
 *
 * @param {{ type: string, [value]: string, [regex]: string, [regexFlags]: string, [valid]: string, [validFlags]: string }} definition
 * @param {string|int} uid
 * @returns {{ uid: string, generic: boolean, type: string, strategy: string, characters: null|string[], strategy: string, [value]: string, [regex]: RegExp, [valid]: RegExp|null, [indices]: object }}
 */
function analyzeDefinition (definition, uid) {
  // Validate definition format
  validateDefinition(definition, uid)

  // Analyze definition with 'value'
  if (definition.value !== void 0) {
    return analyzeValueDefinition(definition, uid)
  }

  // Get information about flags in 'valid' and 'regex' expressions
  const regexFlags = (definition.regexFlags || '') + 'g'
  const validFlags = (definition.validFlags || '') + 'g'

  // Analyze regular expressions in 'valid' and 'regex' fields
  const expression = buildNamedRegularExpression(definition.regex, regexFlags)
  const valid = definition.valid ? buildNamedRegularExpression(definition.valid, validFlags) : null

  // Find possible characters or check if it's generic expression
  const characters = findRegexpBeginning(expression.regex, 25)

  // Build information about this definition
  return {
    uid: uid,
    generic: !characters,
    characters: characters,
    type: definition.type,
    strategy: valid ? 'validatedRegex' : 'regex',
    regex: expression.regex,
    valid: valid ? valid.regex : null,
    indices: expression.indices
  }
}

module.exports = analyzeDefinition
