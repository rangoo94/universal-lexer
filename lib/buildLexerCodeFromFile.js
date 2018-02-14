const buildLexerCode = require('./buildLexerCode')

/**
 * Build lexer code from file definition in YAML
 *
 * @param {string} filePath
 * @param {boolean} [beautify]
 * @returns {string}
 */
function buildLexerCodeFromFile (filePath, beautify = false) {
  // Make sure that bundler will not catch that
  const YAML = require('ya' + 'mljs')

  /** @type {{ Tokens: object[] }} */
  const data = YAML.load(filePath)

  // Validate file structure
  if (!data.Tokens || !Array.isArray(data.Tokens)) {
    throw new Error('File should contain "Tokens" field with array of definitions.')
  }

  // Build from definitions found in file
  return buildLexerCode(data.Tokens, beautify)
}

module.exports = buildLexerCodeFromFile
