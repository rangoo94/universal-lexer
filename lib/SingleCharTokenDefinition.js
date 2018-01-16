/**
 * Token definition
 * which has single character validation
 */
class SingleCharTokenDefinition {
  /**
   * @param {string} type
   * @param {string} character
   */
  constructor (type, character) {
    this.type = type
    this.character = character
  }

  /**
   * Match input against this token definition
   *
   * @param {string} str
   * @returns {null|array}
   */
  match (str) {
    return str[0] === this.character
      ? [ this.character ]
      : null
  }
}

module.exports = SingleCharTokenDefinition
