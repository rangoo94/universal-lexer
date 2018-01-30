/**
 * Get current position (line, index)
 * Both line and index starts from 1
 *
 * @param {string} str
 * @returns {{ line: number, index: number }}
 */
function getCurrentPosition (str) {
  const parts = str.split(/\n/)

  return {
    line: parts.length,
    index: parts[parts.length - 1].length + 1
  }
}

module.exports = getCurrentPosition
