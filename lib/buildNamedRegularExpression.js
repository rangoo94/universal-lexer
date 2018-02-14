const namedRegexp = require('named-js-regexp')

/**
 * Wrapper for regular expression
 * with named properties
 */
class NamedRegExp {
  /**
   * @param {RegExp} regex
   * @param {object} indices
   */
  constructor (regex, indices) {
    this.regex = regex
    this.indices = indices
  }

  /**
   * Execute regular expression
   *
   * @param {string} str
   * @returns {Array|{index:number, input:string}}
   */
  exec (str) {
    // Execute regular expression
    const v = this.regex.exec(str)

    // When not passed, just return null
    if (v === null) {
      return null
    }

    // Build object for groups
    v.groups = {}

    // Add any groups are specified
    for (let key in this.indices) {
      v.groups[key] = v[this.indices[key]]
    }

    return v
  }

  /**
   * Test regular expression against text
   *
   * @param {string} str
   * @returns {boolean}
   */
  test (str) {
    return this.regex.test(str)
  }

  /**
   * Parse regular expression to string
   *
   * @returns {string}
   */
  toString () {
    return this.regex.toString()
  }
}

/**
 * As `named-js-regexp` library is changing RegExp object,
 * it's much slower than regular expressions.
 *
 * Instead of that, we use `named-js-regexp` library
 * only to find named properties,
 * and build object with standard regular expressions.
 *
 * @param {string} text
 * @param {string} [flags]
 * @returns {RegExp|NamedRegExp}
 */
function buildNamedRegularExpression (text, flags) {
  // Build named regular expression
  const enhancedRegex = namedRegexp(text, flags)

  // Find group indices
  const indices = enhancedRegex.groupsIndices

  // Build regular expression without named properties
  /** @type {RegExp|Object} */
  // eslint-disable-next-line
  const regex = eval(enhancedRegex.toString())

  // Build object which simulates regular expressions
  return new NamedRegExp(regex, indices)
}

module.exports = buildNamedRegularExpression
