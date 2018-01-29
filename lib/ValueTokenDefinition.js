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
    this.value = '' + value
    this.length = this.value.length
  }

  /**
   * Match input against this token definition
   *
   * @param {string} str
   * @returns {null|array|object|{ groups: object }}
   */
  match (str) {
    return str.substring(0, this.length) === this.value
      ? [ this.value ]
      : null
  }
}

module.exports = ValueTokenDefinition
