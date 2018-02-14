const beautifyjs = require('js-beautify')

/**
 * Trim spaces in code
 *
 * @param {string} code
 * @returns {string}
 */
function trimSpaces (code) {
  return code
    .replace(/[ \t\r]+\n/g, '\n') // remove spaces on end of line
    .replace(/\n[\n]+/g, '\n') // allow maximum of one empty line between instructions
}

/**
 * Beautify JS code to make it simpler
 *
 * @param {string} code
 * @returns {string}
 */
function beautify (code) {
  return beautifyjs(trimSpaces(code), { indent_size: 2, space_in_empty_paren: false })
}

/**
 * Build internal variable name for specified definition
 *
 * @param {string} name
 * @param {{ uid: string }} definition
 * @returns {string}
 */
function buildVariableName (name, definition) {
  return `${name}$${definition.uid}`
}

exports.trimSpaces = trimSpaces
exports.beautify = beautify
exports.variable = buildVariableName
