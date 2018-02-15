/**
 * Build code for logical condition for list of characters
 *
 * @param {string[]} characters
 * @returns {string}
 */
function buildCharactersCondition (characters) {
  // When there is no characters, it's always true
  if (!characters || characters.length === 0) {
    return 'true'
  }

  // Build single character information without parentheses
  if (characters.length === 1) {
    return `chr === ${JSON.stringify(characters[0].charCodeAt(0))}`
  }

  // Pack condition with parentheses
  return `(${characters.map(chr => `chr === ${JSON.stringify(chr.charCodeAt(0))}`).join(' || ')})`
}

module.exports = buildCharactersCondition
