const expect = require('expect.js')
const utils = require('../../lib/utils')

describe('Utils', () => {
  it('should correctly build variable name for definition', () => {
    expect(utils.variable('v', { uid: '10' })).to.eql('v$10')
  })
})
