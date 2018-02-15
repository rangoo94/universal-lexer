const expect = require('expect.js')
const build = require('../../lib/buildCharactersCondition')

describe('Build characters condition', () => {
  it('should build correct condition without characters', () => {
    expect(build()).to.eql('true')
    expect(build(null)).to.eql('true')
    expect(build([])).to.eql('true')
  })

  it('should build correct condition with single character', () => {
    expect(build([ 'a' ])).to.eql('chr === 97')
  })

  it('should build correct condition with multiple characters', () => {
    expect(build([ 'a', 'b' ])).to.eql('(chr === 97 || chr === 98)')
    expect(build([ 'a', 'b', 'c' ])).to.eql('(chr === 97 || chr === 98 || chr === 99)')
  })
})
