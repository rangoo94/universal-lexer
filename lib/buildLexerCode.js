const buildRegexpDeclarationCode = require('./buildRegexpDeclarationCode')
const buildMatchingCode = require('./buildMatchingCode')
const analyzeDefinition = require('./analyzeDefinition')
const utils = require('./utils')

/**
 * Build lexer function code
 *
 * @param {object[]} definitions
 * @param {boolean} [beautify]
 * @returns {string}
 */
function buildLexerCode (definitions, beautify = false) {
  // Analyze all definitions to gather more information
  definitions = definitions.map(analyzeDefinition)

  // Build list of declarations
  const declarations = definitions.map(buildRegexpDeclarationCode)

  // Build list of matchers
  const matchers = definitions.map(buildMatchingCode)

  // Build tokenizer function
  const code = `(function () {
    function identity (x) { return x }

    ${declarations.join('')}

    return function tokenize (code, process) {
      if (process == null) {
        process = identity
      }

      var tokens = []
      var index = 0

      while (index !== code.length) {
        var chr = code.charCodeAt(index)

        ${matchers.join('')}

        var parts = code.substr(0, index).split(/\\n/)

        return {
          error: "Unrecognized token",
          index: index,
          line: parts.length,
          column: parts[parts.length - 1].length + 1
        }
      }

      return {
        tokens: tokens
      }
    }
  }())`

  return beautify ? utils.beautify(code) : utils.trimSpaces(code)
}

module.exports = buildLexerCode
