# Universal Lexer

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

Code itself is written in ES6, but it's transpiled to ES5, so you can use it either in Node.js or in browser.

## How it works

There are two ways of passing rules to this lexer.

### Pass as array of definitions

Simply, pass definitions to lexer:

```js
// Load library
const UniversalLexer = require('universal-lexer')

// Create token definition
const Colon = {
  type: 'Colon',
  regex: ':'
}

// Build array of definitions
const definitions = [ Colon ]

// Create lexer
const lexer = UniversalLexer.fromDefinitions(definitions)
```

A definition is more complex object:

```js
{
  // Required: Token name
  type: 'String',

  // Optional: Regular expression to validate
  // if current token should be parsed as this token
  // Useful i.e. when you require separator after sentence,
  // but you don't want to include it.
  valid: '"',

  // Optional: regular expression flags for 'valid' field
  validFlags: 'i',

  // Required: Regular expression to find current token
  // You can use named groups as well (?<name>expression):
  // Then it will attach this information to token.
  regex: '"(?<value>([^"]|\\.)+)"',

  // Optional: regular expression flags for 'regex' field
  regexFlags: 'i'
}
```

### Pass YAML file

```js
// Load library
const UniversalLexer = require('universal-lexer')

const lexer = UniversalLexer.fromFile('scss.yaml')
```

YAML file for now should contain only `Tokens` property with definitions.
Later it may have more advanced stuff like macros (for simpler syntax).

**Example:**

```js
Tokens:
  # Whitespaces

  - name: NewLine
    regex: '\n'

  - name: Space
    regex: '[ \t]+'

  # Math

  - name: Operator
    regex: '[+-*/]'

  # Color
  # It has 'valid' field, to be sure that it's not i.e. blacker
  # Now, it will check if there is no text after

  - name: Color
    regex: '(?<value>black|white)'
    valid: '(black|white)[^\w]'
```

## Processing data

Processing input data, after you created a lexer is pretty straight-forward with `for` method:

```js
// Load library
const UniversalLexer = require('universal-lexer')

// Create lexer
const lexer = UniversalLexer.fromFile('scss.yaml')

// Build processor
const processor = lexer.for('some { background: code }')

// Get all tokens...
const tokens = processor.process()

// or iterate over them
for (const token of processor) {
  console.log(token)
}
```

## Debug / Syntax Highlighting

There is additionally `HTML` object extracted into module,
which allows rendering HTML code with your tokens.

```js
// Load library
const UniversalLexer = require('universal-lexer')

// Create lexer
const lexer = UniversalLexer.fromFile('scss.yaml')

// Get tokens
const tokens = lexer.for('some { background: code }').process()

// Build HTML
const html = UniversalLexer.HTML.build(tokens, {
  String: [
    // You can pass any styling for specific tokens
    'background: red',

    // There are also few helpers provided:
    UniversalLexer.HTML.color('blue'),
    UniversalLexer.HTML.underline,
    UniversalLexer.HTML.bold
  ]
})

console.log(html)
```

For easier work with such code, you can later run it like:

```bash
node debug.js > index.html && open index.html
```
