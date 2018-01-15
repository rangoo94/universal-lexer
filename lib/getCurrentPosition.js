/**
 * Get current position (line, index)
 * Line starts from 1, index from 0
 *
 * @param {string} str
 * @returns {{ line: number, index: number }}
 */
function getCurrentPosition (str) {
  const parts = str.split(/\n/)

  return {
    line: parts.length,
    index: parts[parts.length - 1].length
  }
}

module.exports = getCurrentPosition
