const expect = require('expect.js')
const compile = require('../../lib/compileLexer')

describe('E2E: Compile lexer', () => {
  it('should correctly parse with simple definition', () => {
    const tokenize = compile([
      { type: 'WS', value: ' ' }
    ])

    expect(tokenize('   ')).to.eql({
      tokens: [
        { type: 'WS', data: { value: ' ' }, start: 0, end: 1 },
        { type: 'WS', data: { value: ' ' }, start: 1, end: 2 },
        { type: 'WS', data: { value: ' ' }, start: 2, end: 3 }
      ]
    })
  })

  it('should correctly parse with regex definition', () => {
    const tokenize = compile([
      { type: 'WS', value: ' ' },
      { type: 'LT', regex: '[a-z]+', regexFlags: 'i' },
    ])

    expect(tokenize('  Sth ')).to.eql({
      tokens: [
        { type: 'WS', data: { value: ' ' }, start: 0, end: 1 },
        { type: 'WS', data: { value: ' ' }, start: 1, end: 2 },
        { type: 'LT', data: { value: 'Sth' }, start: 2, end: 5 },
        { type: 'WS', data: { value: ' ' }, start: 5, end: 6 }
      ]
    })
  })

  it('should correctly parse with regex (named groups) definition', () => {
    const tokenize = compile([
      { type: 'WS', value: ' ' },
      { type: 'LT', regex: '(?<first>[a-z])(?<later>[a-z]*)', regexFlags: 'i' },
    ])

    expect(tokenize('  Sth ')).to.eql({
      tokens: [
        { type: 'WS', data: { value: ' ' }, start: 0, end: 1 },
        { type: 'WS', data: { value: ' ' }, start: 1, end: 2 },
        { type: 'LT', data: { first: 'S', later: 'th' }, start: 2, end: 5 },
        { type: 'WS', data: { value: ' ' }, start: 5, end: 6 }
      ]
    })
  })

  it('should correctly parse with text definition', () => {
    const tokenize = compile([
      { type: 'WS', regex: '[ ]+' },
      { type: 'FN', value: '@fn' },
    ])

    expect(tokenize('  @fn ')).to.eql({
      tokens: [
        { type: 'WS', data: { value: '  ' }, start: 0, end: 2 },
        { type: 'FN', data: { value: '@fn' }, start: 2, end: 5 },
        { type: 'WS', data: { value: ' ' }, start: 5, end: 6 }
      ]
    })
  })

  it('should correctly parse with validated regex definition', () => {
    const tokenize = compile([
      { type: 'WS', regex: '[ ]+' },
      { type: 'FN', regex: '@fn', valid: '@fn( |$)' },
      { type: 'WORD', regex: '[^ ]*' },
    ])

    expect(tokenize('  @fnx ')).to.eql({
      tokens: [
        { type: 'WS', data: { value: '  ' }, start: 0, end: 2 },
        { type: 'WORD', data: { value: '@fnx' }, start: 2, end: 6 },
        { type: 'WS', data: { value: ' ' }, start: 6, end: 7 }
      ]
    })

    expect(tokenize('  @fn x')).to.eql({
      tokens: [
        { type: 'WS', data: { value: '  ' }, start: 0, end: 2 },
        { type: 'FN', data: { value: '@fn' }, start: 2, end: 5 },
        { type: 'WS', data: { value: ' ' }, start: 5, end: 6 },
        { type: 'WORD', data: { value: 'x' }, start: 6, end: 7 }
      ]
    })
  })

  it('should fail because of validated regex definition', () => {
    const tokenize = compile([
      { type: 'WS', regex: '[ ]+' },
      { type: 'FN', regex: '@fn', valid: '@fn( |$)' }
    ])

    expect(tokenize('  @fnx ')).to.eql({
      error: 'Unrecognized token',
      index: 2,
      line: 1,
      column: 3
    })
  })

  it('should fail because of no definitions', () => {
    const tokenize = compile([])

    expect(tokenize('  @fnx ')).to.eql({
      error: 'Unrecognized token',
      index: 0,
      line: 1,
      column: 1
    })
  })
})
