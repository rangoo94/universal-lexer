const buildLexerFromDefinitions = require('./buildLexerFromDefinitions')

/**
 * Build lexer from file definition in YAML
 *
 * @param {string} filePath
 * @returns {Lexer}
 */
function buildLexerFromFile (filePath) {
  // Make sure that bundler will not catch that
  const YAML = require('ya' + 'mljs')

  /** @type {{ Tokens: object[] }} */
  const data = YAML.load(filePath)

  // Validate file structure
  if (!data.Tokens) {
    throw new Error('File should contain `Tokens` field.')
  }

  // Build from definitions found in file
  return buildLexerFromDefinitions(data.Tokens)
}

module.exports = buildLexerFromFile
