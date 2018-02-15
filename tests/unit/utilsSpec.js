const expect = require('expect.js')
const utils = require('../../lib/utils')

describe('Utils', () => {
  it('should correctly build variable name for definition', () => {
    expect(utils.variable('v', { uid: '10' })).to.eql('v$10')
    expect(utils.variable('v', { uid: 10 })).to.eql('v$10')
  })

  it('should correctly trim spaces', () => {
    expect(utils.trimSpaces('abc\n\n   \naaa')).to.eql('abc\naaa')
  })
})
