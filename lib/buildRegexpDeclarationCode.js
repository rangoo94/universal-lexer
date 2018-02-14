const utils = require('./utils')

/**
 * Build code to define regexp variables for definition
 *
 * @param {{ uid: string, strategy: string, [regex]: RegExp, [valid]: RegExp }} definition
 * @returns {string}
 */
function buildRegexpDeclarationCode (definition) {
  // It's not regular expression based definition, so return empty code
  if (definition.strategy !== 'regex' && definition.strategy !== 'validatedRegex') {
    return ''
  }

  // Build internal name for regex variable
  const regex = utils.variable('re', definition)

  // It's regexp definition with pre-validation regexp
  if (definition.strategy === 'validatedRegex') {
    // Build internal name for pre-validation regex variable
    const valid = utils.variable('valid', definition)

    // Build code for regex's
    return `
      var ${regex} = ${definition.regex.toString()}
      var ${valid} = ${definition.valid.toString()}
    `
  }

  // It's regexp definition without pre-validation
  return `
    var ${regex} = ${definition.regex.toString()}
  `
}

module.exports = buildRegexpDeclarationCode
