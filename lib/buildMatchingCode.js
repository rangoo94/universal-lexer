const buildCharactersCondition = require('./buildCharactersCondition')
const buildTokenCode = require('./buildTokenDefinitionCode')
const utils = require('./utils')

/**
 * Build code to add token from definition
 *
 * @param {object} definition
 * @returns {string}
 */
function process (definition) {
  return `tokens.push(process(${buildTokenCode(definition)}))`
}

/**
 * Build matching code for regex-based definition
 *
 * @param {object} definition
 * @returns {string}
 */
function buildRegexMatchingCode (definition) {
  const regex = utils.variable('re', definition)
  const match = utils.variable('m', definition)

  return `
    ${regex}.lastIndex = index
    var ${match} = ${regex}.exec(code)

    if (${match} !== null && ${match}.index === index) {
      ${process(definition)}
      index += ${match}[0].length
      continue
    }
  `
}

/**
 * Build matching code for pre-validated regex-based definition
 *
 * @param {object} definition
 * @returns {string}
 */
function buildValidatedRegexMatchingCode (definition) {
  const valid = utils.variable('valid', definition)

  return `
    ${valid}.lastIndex = index

    if (${valid}.test(code)) {
      ${buildRegexMatchingCode(definition)}
    }
  `
}

/**
 * Build matching code for character-based definition
 *
 * @param {object} definition
 * @returns {string}
 */
function buildCharacterMatchingCode (definition) {
  return `
    ${process(definition)}
    index += 1
    continue
  `
}

/**
 * Build matching code for text-based definition
 *
 * @param {object} definition
 * @returns {string}
 */
function buildTextMatchingCode (definition) {
  const value = definition.value

  return `
    if (code.substr(index + 1, ${value.length - 1}) === ${JSON.stringify(value.substr(1))}) {
      ${process(definition)}
      index += ${value.length}
      continue
    }
  `
}

const strategies = {
  regex: buildRegexMatchingCode,
  validatedRegex: buildValidatedRegexMatchingCode,
  text: buildTextMatchingCode,
  character: buildCharacterMatchingCode
}

/**
 * Build matching code for any definition
 *
 * @param {object} definition
 * @returns {string}
 */
function buildMatchingCode (definition) {
  // Validate if we recognize definition strategy
  if (!strategies[definition.strategy]) {
    throw new Error(`Unknown definition strategy: "${definition.strategy}"`)
  }

  // Build matching code based on definition strategy
  const code = strategies[definition.strategy](definition)

  if (!definition.characters) {
    return code
  }

  const condition = buildCharactersCondition(definition.characters)

  return `
    if (${condition}) {
      ${code}
    }
  `
}

module.exports = buildMatchingCode
