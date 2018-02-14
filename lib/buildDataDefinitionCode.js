/**
 * Build code for token data definition
 *
 * @param {{ [indices]: object }} definition
 * @param {null|string} match  Match variable
 * @param {null|string} [value]  Full value, if match variable is not provided
 * @returns {string}
 */
function buildDataCode (definition, match, value) {
  // Find indices based on named groups
  const indices = definition.indices || {}

  // Find named groups
  const keys = Object.keys(indices)

  // Return single value if there are no named groups
  if (keys.length === 0) {
    return match ? `{ value: ${match}[0] }` : `{ value: ${value} }`
  }

  // Build code for each named group
  const properties = keys.map(
    key => `${JSON.stringify(key)}: ${match}[${indices[key]}]`
  )

  // Build final code
  return `{ ${properties.join(', ')} }`
}

module.exports = buildDataCode
