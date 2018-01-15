const LexerProcessor = require('./LexerProcessor')

/**
 * Universal lexer which converts text to lexical content
 */
class Lexer {
  /**
   * @param {object[]} tokens  rules for tokens
   * @param {object} [processors]
   */
  constructor (tokens, processors) {
    this.tokens = tokens
    this.processors = Object.assign({}, processors)
  }

  /**
   * Add processor for found token with specified type
   *
   * @param {string} tokenName
   * @param {function} processor
   * @returns {Lexer}
   */
  addProcessor (tokenName, processor) {
    if (this.processors[tokenName]) {
      throw new Error('You can\'t set up two processors for single token.')
    }

    this.processors[tokenName] = processor

    return this
  }

  /**
   * Create processor for specified input
   *
   * @param {string} input
   */
  'for' (input) {
    return new LexerProcessor(this.tokens, this.processors, input)
  }

  /**
   * Clone lexer
   *
   * @returns {Lexer}
   */
  clone () {
    return new Lexer(this.tokens, this.processors)
  }
}

module.exports = Lexer
