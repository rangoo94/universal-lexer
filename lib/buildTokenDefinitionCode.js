const buildDataDefinitionCode = require('./buildDataDefinitionCode')
const utils = require('./utils')

/**
 * Build token code for regexp-based definitions
 *
 * @param {object} definition
 * @returns {string}
 */
function buildRegexTokenDefinitionCode (definition) {
  // Build variable name for regexp result
  const variable = utils.variable('m', definition)

  return `{
    type: ${JSON.stringify(definition.type)},
    data: ${buildDataDefinitionCode(definition, variable)},
    start: index,
    end: index + ${variable}[0].length
  }`
}

/**
 * Build token code for text definitions
 *
 * @param {object} definition
 * @returns {string}
 */
function buildTextDefinitionCode (definition) {
  return `{
    type: ${JSON.stringify(definition.type)},
    data: ${buildDataDefinitionCode(definition, null, JSON.stringify(definition.value))},
    start: index,
    end: index + ${definition.value.length}
  }`
}

const strategies = {
  regex: buildRegexTokenDefinitionCode,
  validatedRegex: buildRegexTokenDefinitionCode,
  character: buildTextDefinitionCode,
  text: buildTextDefinitionCode
}

/**
 * Build token code for any definition
 *
 * @param {object} definition
 * @returns {string}
 */
function buildTokenDefinitionCode (definition) {
  // Validate if we recognize definition strategy
  if (!strategies[definition.strategy]) {
    throw new Error(`Unknown definition strategy: "${definition.strategy}"`)
  }

  // Build token code based on definition strategy
  return strategies[definition.strategy](definition)
}

module.exports = buildTokenDefinitionCode
