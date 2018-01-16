/**
 * Iterator for LexerProcessor
 */
class LexerProcessorIterator {
  /**
   * @param {LexerProcessor} processor
   */
  constructor (processor) {
    this.processor = processor
  }

  /**
   * Get next node
   *
   * @returns {{ done: boolean, [value]: Token }}
   */
  next () {
    const node = this.processor.next()

    return node === null ? { done: true } : { done: false, value: node }
  }
}

module.exports = LexerProcessorIterator
