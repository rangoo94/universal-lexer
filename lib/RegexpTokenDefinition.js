/**
 * Token definition
 * which has only base expression
 */
class RegexpTokenDefinition {
  /**
   * @param {string} type
   * @param {RegExp|NamedRegExp} regex
   */
  constructor (type, regex) {
    this.type = type
    this.regex = regex
  }

  /**
   * Match input against this token definition
   *
   * @param {string} str
   * @returns {null|array|object|{ groups: object }}
   */
  match (str) {
    return this.regex.exec(str)
  }
}

module.exports = RegexpTokenDefinition
