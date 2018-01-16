/**
 * Token definition
 * which has value, but it's not single char
 */
class ValueTokenDefinition {
  /**
   * @param {string} type
   * @param {string} value
   */
  constructor (type, value) {
    this.type = type
    this.value = value
  }

  /**
   * Match input against this token definition
   *
   * @param {string} str
   * @returns {null|array|object|{ groups: object }}
   */
  match (str) {
    return str.startsWith(this.value)
      ? [ this.value ]
      : null
  }
}

module.exports = ValueTokenDefinition
