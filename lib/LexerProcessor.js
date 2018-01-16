const LexerProcessorIterator = require('./LexerProcessorIterator')
const Token = require('./Token')

const getCurrentPosition = require('./getCurrentPosition')

// Find if current environment allows Symbols
const glob = typeof window === 'undefined' ? global : window
const hasSymbols = 'Symbol' in glob

/**
 * Processor (which also implements iterator) for tokens,
 * based on Lexer definition
 */
class LexerProcessor {
  /**
   *
   * @param {TokenDefinition[]|RegexpTokenDefinition[]|SingleCharTokenDefinition[]|ValueTokenDefinition[]} tokens  rules for tokens
   * @param {object} processors  processors for specific tokens
   * @param {string} input
   */
  constructor (tokens, processors, input) {
    this.tokens = tokens
    this.processors = processors || {}
    this.input = input

    this.reset()
  }

  /**
   * Reset iterator
   */
  reset () {
    this.index = 0
    this.current = this.input
  }

  /**
   * Build current token
   *
   * @param {string} type
   * @param {object} match
   * @returns {Token}
   */
  buildToken (type, match) {
    // Get code for current token
    const code = match[0]

    // Find matching groups
    const groups = match.groups

    // Process data
    const data = this.processors[type] ? this.processors[type](groups, code) : groups

    // Find current token position
    const position = {
      start: this.index,
      end: this.index + code.length
    }

    return new Token(type, data, position, code)
  }

  /**
   * Find next token
   *
   * @returns {Token|null}
   */
  next () {
    // Reset and finish iteration when reached end
    if (this.current.length === 0) {
      this.reset()
      return null
    }

    // Search for token definition which apply to current place in code
    for (let i = 0; i < this.tokens.length; i++) {
      const definition = this.tokens[i]

      // Match
      const match = definition.match(this.current)

      // When this definition is not passing, continue searching for correct one
      if (match === null) {
        continue
      }

      // Build basic token, as we had found correct definition
      const token = this.buildToken(definition.type, match)
      const length = match[0].length

      // Go to next token
      this.current = this.current.substr(length)
      this.index += length

      return token
    }

    // When there was unknown syntax (no definition passed) return this info
    const pos = getCurrentPosition(this.input.substr(0, this.index))

    throw new Error(`Unknown token (line: ${pos.line}, position: ${pos.index}) (${JSON.stringify(this.current.substr(0, 30))}.`)
  }

  /**
   * Process whole input for tokens
   *
   * Optimized according to performance results:
   * 'for' loop with predefined array and direct assignments
   * are way faster for big arrays
   *
   * @returns {object[]}
   */
  process () {
    let tokens = new Array(this.current.length)

    let t = this.next()

    let i = 0
    for (; t; i++) {
      tokens[i] = t
      t = this.next()
    }

    tokens.length = i

    return tokens
  }

  /**
   * Clone processor with resetting indexes
   *
   * @returns {LexerProcessor}
   */
  clone () {
    return new LexerProcessor(this.tokens, this.processors, this.input)
  }
}

// Attach iterator if symbols are available in environment
if (hasSymbols) {
  LexerProcessor.prototype[Symbol.iterator] = function () {
    return new LexerProcessorIterator(this.clone())
  }
}

module.exports = LexerProcessor
