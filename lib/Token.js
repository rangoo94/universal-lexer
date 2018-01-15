/**
 * Token representation
 */
class Token {
  /**
   *
   * @param {string} type
   * @param {object} [data]
   * @param {{ start: number, end: number }} [position]
   * @param {string} [code]
   */
  constructor (type, data, position, code) {
    this.type = type
    this.data = data || {}
    this.position = position || { start: NaN, end: NaN }
    this.code = typeof code !== 'string' ? null : code
  }
}

module.exports = Token
