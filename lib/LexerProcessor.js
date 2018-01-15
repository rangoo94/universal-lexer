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
   * @param {object[]} tokens  rules for tokens
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
   * @returns {{ done: boolean, [value]: Token }}
   */
  next () {
    // Reset and finish iteration when reached end
    if (this.current.length === 0) {
      this.reset()
      return { done: true }
    }

    // Search for token definition which apply to current place in code
    for (let i = 0; i < this.tokens.length; i++) {
      const definition = this.tokens[i]

      // Validate if this token is here
      const isValid = definition.validation.test(this.current)

      // When this definition is not passing, continue searching for correct one
      if (isValid === false) {
        continue
      }

      // Match current token
      const match = definition.regex.exec(this.current)

      if (match === null) {
        throw new Error(`${definition.type}: validation passed, but expression didn't.`)
      }

      // Build basic token, as we had found correct definition
      const token = this.buildToken(definition.type, match)
      const length = token.code.length

      // Go to next token
      this.current = this.current.substr(length)
      this.index += length

      return {
        value: token,
        done: false
      }
    }

    // When there was unknown syntax (no definition passed) return this info
    const pos = getCurrentPosition(this.input.substr(0, this.index))

    throw new Error(`Unknown token (line: ${pos.line}, position: ${pos.index}).`)
  }

  /**
   * Process whole input for tokens
   *
   * @returns {object[]}
   */
  process () {
    const tokens = []

    let t = this.next()

    while (!t.done) {
      tokens.push(t.value)
      t = this.next()
    }

    return tokens
  }
}

// Lexer processor is iterator itself
// Slightly broken when iterating in iterator (index will be shared)
if (hasSymbols) {
  LexerProcessor.prototype[Symbol.iterator] = function () {
    return this
  }
}

module.exports = LexerProcessor
