# Universal Lexer

[![Travis](https://travis-ci.org/rangoo94/universal-lexer.svg)](https://travis-ci.org/rangoo94/universal-lexer)
[![Code Climate](https://codeclimate.com/github/rangoo94/universal-lexer/badges/gpa.svg)](https://codeclimate.com/github/rangoo94/universal-lexer)
[![Coverage Status](https://coveralls.io/repos/github/rangoo94/universal-lexer/badge.svg?branch=master)](https://coveralls.io/github/rangoo94/universal-lexer?branch=master)
[![NPM Downloads](https://img.shields.io/npm/dm/universal-lexer.svg)](https://www.npmjs.com/package/universal-lexer)

Lexer which can parse any text input to tokens, according to provided regular expressions.

> In computer science, lexical analysis, lexing or tokenization is the process of converting a sequence of characters
> (such as in a computer program or web page) into a sequence of tokens (strings with an assigned and thus identified meaning).
> A program that performs lexical analysis may be termed a lexer, tokenizer, or scanner, though scanner is also a term for the first stage of a lexer.
> A lexer is generally combined with a parser, which together analyze the syntax of programming languages, web pages, and so forth.

## Features

- Allow named regular expressions, so you don't have to work with it a lot
- Allow post-processing tokens, to get more information you require

## How to install

Package is available as `universal-lexer` in NPM, so you can use it in your project using
`npm install universal-lexer` or `yarn add universal-lexer`

## What are requirements?

Code itself is written in ES6 and should work in Node.js 6+ environment.
If you would like to use it in browser or older development, there is also transpiled and bundled (UMD) version included.
You can use `universal-lexer/browser` in your requires or `UniversalLexer` in global environment (in browser):

```js
// Load library
const UniversalLexer = require('universal-lexer/browser')

// Create lexer
const lexer = UniversalLexer.compile(definitions)

// ...
```

## How it works

You've got two sets of functions:

```js
// Load library
const UniversalLexer = require('universal-lexer')

// Build code for this lexer
const code1 = UniversalLexer.build([ { type: 'Colon', value: ':' } ])
const code2 = UniversalLexer.buildFromFile('json.yaml')

// Compile dynamically a function which can be used
const func1 = UniversalLexer.compile([ { type: 'Colon', value: ':' } ])
const func2 = UniversalLexer.compileFromFile('json.yaml')
```
There are two ways of passing rules to this lexer: from file or array of definitions.

### Pass as array of definitions

Simply, pass definitions to lexer:

```js
// Load library
const UniversalLexer = require('universal-lexer')

// Create token definition
const Colon = {
  type: 'Colon',
  value: ':'
}

// Build array of definitions
const definitions = [ Colon ]

// Create lexer
const lexer = UniversalLexer.compile(definitions)
```

A definition is more complex object:

```js
// Required fields: 'type' and either `regex` or `value`
{
  // Token name
  type: 'String',

  // String value which should be searched on beginning on string
  value: 'abc',
  value: '(',

  // Regular expression to validate
  // if current token should be parsed as this token
  // Useful i.e. when you require separator after sentence,
  // but you don't want to include it.
  valid: '"',

  // Regular expression flags for 'valid' field
  validFlags: 'i',

  // Regular expression to find current token
  // You can use named groups as well (?<name>expression):
  // Then it will attach this information to token.
  regex: '"(?<value>([^"]|\\.)+)"',

  // Regular expression flags for 'regex' field
  regexFlags: 'i'
}
```

### Pass YAML file

```js
// Load library
const UniversalLexer = require('universal-lexer')

const lexer = UniversalLexer.compileFromFile('scss.yaml')
```

YAML file for now should contain only `Tokens` property with definitions.
Later it may have more advanced stuff like macros (for simpler syntax).

**Example:**

```yaml
Tokens:
  # Whitespaces

  - type: NewLine
    value: "\n"

  - type: Space
    regex: '[ \t]+'

  # Math

  - type: Operator
    regex: '[+-*/]'

  # Color
  # It has 'valid' field, to be sure that it's not i.e. blacker
  # Now, it will check if there is no text after

  - type: Color
    regex: '(?<value>black|white)'
    valid: '(black|white)[^\w]'
```

## Processing data

Processing input data, after you created a lexer is pretty straight-forward with `for` method:

```js
// Load library
const UniversalLexer = require('universal-lexer')

// Create lexer
const tokenize = UniversalLexer.compileFromFile('scss.yaml')

// Build processor
const tokens = tokenize('some { background: code }').tokens
```

## Post-processing tokens

If you would like to make more advanced parsing on parsed tokens, you can do it with `addProcessor` method:

```js
// Load library
const UniversalLexer = require('universal-lexer')

// Create lexer
const tokenize = UniversalLexer.compileFromFile('scss.yaml')

// That's 'Literal' definition:
const Literal = {
  type: 'Literal',
  regex: '(?<value>([^\t \n;"'',{}()\[\]#=:~&\\]|(\\.))+)'
}

// Create processor which will replace all '\X' to 'X' in value
function process (token) {
  if (token.type !== 'Literal') {
    return token
  }

  return {
    type: 'Literal',
    data: {
      value: match.value.replace(/\\(.)/g, '$1')
    },
    start: token.start,
    end: token.end
  }
}

// Get all tokens...
const tokens = tokenize('some { background: code }', process).tokens
```

## Beautified code

If you would like to get beautified code of lexer,
you can use second argument of `compile` functions:

```js
UniversalLexer.compile(definitions, true)
UniversalLexer.compileFromFile('scss.yaml', true)
```

## Possible results

On success you will retrieve simple object with array of tokens:

```js
{
  tokens: [
    { type: 'Whitespace', data: { value: '     ' }, start: 0, end: 5 },
    { type: 'Word', data: { value: 'some' }, start: 5, end: 9 }
  ]
}
```

When something is wrong you will get error information:

```js
{
  error: 'Unrecognized token',
  index: 1,
  line: 1,
  column: 2
}
```

## Examples

For now, you can see example of JSON semantics in `examples/json.yaml` file.

## CLI

After installing globally (or inside of NPM scripts) `universal-lexer` command is available:

```
Usage: universal-lexer [options] output.js

Options:
  --version       Show version number                                  [boolean]
  -s, --source    Semantics file                                      [required]
  -b, --beautify  Should beautify code?                [boolean] [default: true]
  -h, --help      Show help                                            [boolean]

Examples:
  universal-lexer -s json.yaml lexer.js  build lexer from semantics file
```

## Changelog

### Version 2

- **2.0.4** - remove unneeded `benchmark` dependency
- **2.0.3** - add unit and E2E tests, fix small bugs
- **2.0.2** - added CLI command
- **2.0.1** - fix typo in README file
- **2.0.0** - optimize it (even 10x faster) by expression analysis and some other things

### Version 1

- **1.0.8** - change that current position in syntax error starts from 1 always
- **1.0.7** - optimize definitions with "value", make syntax errors developer-friendly
- **1.0.6** - optimized Lexer performance (20% faster in average)
- **1.0.5** - fix browser version to be put into NPM package properly
- **1.0.4** - bugfix for debugging
- **1.0.3** - add proper sanitization for debug HTML
- **1.0.2** - small fixes for README file
- **1.0.1** - added Rollup.js support to build version for browser
