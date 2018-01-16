/**
 * Token definition
 * which has both base & validation expressions
 */
class TokenDefinition {
  /**
   * @param {string} type
   * @param {RegExp|NamedRegExp} regex
   * @param {RegExp|NamedRegExp} validation
   */
  constructor (type, regex, validation) {
    this.type = type
    this.regex = regex
    this.validation = validation
  }

  /**
   * Match input against this token definition
   *
   * @param {string} str
   * @returns {null|array|object|{ groups: object }}
   */
  match (str) {
    if (!this.validation.test(str)) {
      return null
    }

    const match = this.regex.exec(str)

    if (match === null) {
      throw new Error(`${this.type}: passed validation expression, but not a base expression.`)
    }

    return match
  }
}

module.exports = TokenDefinition
