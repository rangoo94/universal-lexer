const expect = require('expect.js')
const analyze = require('../../lib/analyzeDefinition')

describe('Analyze definition', () => {
  it('should fail without definition', () => {
    expect(() => analyze(null, 10)).to.throwError()
  })

  it('should fail without definition type', () => {
    expect(() => analyze({
      regex: 'abc'
    }, 10)).to.throwError()
  })

  it('should fail without definition value/regex', () => {
    expect(() => analyze({
      type: 'xx'
    }, 10)).to.throwError()
  })

  it('should fail with both definition value and regex', () => {
    expect(() => analyze({
      type: 'xx',
      regex: 'abc',
      value: 'abc'
    }, 10)).to.throwError()
  })

  it('should fail without UID', () => {
    expect(() => analyze({
      type: 'xx',
      regex: 'abc'
    })).to.throwError()
  })

  it('should fail with empty value', () => {
    expect(() => analyze({
      type: 'xx',
      value: ''
    }, 10)).to.throwError()
  })

  it('should build correct single-character definition', () => {
    expect(analyze({
      type: 'xx',
      value: 'a'
    }, 10)).to.eql({
      uid: 10,
      generic: false,
      type: 'xx',
      strategy: 'character',
      characters: [ 'a' ],
      value: 'a'
    })
  })

  it('should build correct text definition', () => {
    expect(analyze({
      type: 'xx',
      value: 'abc'
    }, 10)).to.eql({
      uid: 10,
      generic: false,
      type: 'xx',
      strategy: 'text',
      characters: [ 'a' ],
      value: 'abc'
    })
  })

  it('should build correct regex definition', () => {
    expect(analyze({
      type: 'xx',
      regex: 'abc'
    }, 10)).to.eql({
      uid: 10,
      generic: false,
      characters: [ 'a' ],
      type: 'xx',
      strategy: 'regex',
      regex: /abc/g,
      valid: null,
      indices: {}
    })
  })

  it('should build correct regex with named groups definition', () => {
    expect(analyze({
      type: 'xx',
      regex: 'a(?<name>bc)'
    }, 10)).to.eql({
      uid: 10,
      generic: false,
      characters: [ 'a' ],
      type: 'xx',
      strategy: 'regex',
      regex: /a(bc)/g,
      valid: null,
      indices: { name: 1 }
    })
  })

  it('should build correct validated-regex definition', () => {
    expect(analyze({
      type: 'xx',
      regex: 'abc',
      valid: 'a'
    }, 10)).to.eql({
      uid: 10,
      generic: false,
      characters: [ 'a' ],
      type: 'xx',
      strategy: 'validatedRegex',
      regex: /abc/g,
      valid: /a/g,
      indices: {}
    })
  })

  it('should build correct validated-regex with named groups definition', () => {
    expect(analyze({
      type: 'xx',
      regex: 'a(?<name>bc)',
      valid: 'a'
    }, 10)).to.eql({
      uid: 10,
      generic: false,
      characters: [ 'a' ],
      type: 'xx',
      strategy: 'validatedRegex',
      regex: /a(bc)/g,
      valid: /a/g,
      indices: { name: 1 }
    })
  })

  it('should build correct generic regex definition', () => {
    expect(analyze({
      type: 'xx',
      regex: '.(?<name>bc)'
    }, 10)).to.eql({
      uid: 10,
      generic: true,
      characters: null,
      type: 'xx',
      strategy: 'regex',
      regex: /.(bc)/g,
      valid: null,
      indices: { name: 1 }
    })
  })

  it('should build correct regex with flags definition', () => {
    expect(analyze({
      type: 'xx',
      regex: '.(?<name>bc)',
      regexFlags: 'i'
    }, 10)).to.eql({
      uid: 10,
      generic: true,
      characters: null,
      type: 'xx',
      strategy: 'regex',
      regex: /.(bc)/gi,
      valid: null,
      indices: { name: 1 }
    })

    expect(analyze({
      type: 'xx',
      regex: 'a(?<name>bc)',
      regexFlags: 'i'
    }, 10)).to.eql({
      uid: 10,
      generic: false,
      characters: [ 'a', 'A' ],
      type: 'xx',
      strategy: 'regex',
      regex: /a(bc)/gi,
      valid: null,
      indices: { name: 1 }
    })
  })

  it('should build correct validated regex with flags definition', () => {
    expect(analyze({
      type: 'xx',
      regex: '([aA])(?<name>bc)',
      valid: 'a',
      validFlags: 'i'
    }, 10)).to.eql({
      uid: 10,
      generic: false,
      characters: [ 'a', 'A' ],
      type: 'xx',
      strategy: 'validatedRegex',
      regex: /([aA])(bc)/g,
      valid: /a/gi,
      indices: { name: 2 }
    })
  })
})
