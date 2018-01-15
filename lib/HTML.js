const INDEX = `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Simple SCSS Parser</title>
    </head>
    <body>
        <style>
            .code {
                position: relative;
            }

            .tooltip {
                font-family: 'Helvetica Neue', Arial, Tahoma, Sans-serif;
                position: absolute;
                left: 50%;
                bottom: 100%;
                transform: translateX(-50%);
                pointer-events: none;
                opacity: 0;
                transition: 300ms all ease-in;
                padding: 5px;
                color: #fff;
                background: rgba(0, 0, 0, .9);
                border-radius: 3px;
                user-select: none;
                text-align: center;
            }

            .tooltip span {
                display: block;
                font-size: 0.9em;
            }

            .code:hover {
                background: rgba(255, 255, 255, .2);
                outline: 1px solid rgba(255, 255, 255, .5);
            }

            .code:hover .tooltip {
                opacity: 1;
            }
            
            $style

            pre {
                font-size: 14px;
                margin: 100px;
                padding: 15px;
                border: 1px solid #000;
                background: #2b2b2b;
                color: #eee;
                box-shadow: 0 0 0 1px #fff, 0 0 20px 5px rgba(0, 0, 0, .3);
            }
        </style>
        <pre>$code</pre>
    </body>
</html>
`

/**
 * Pretty format for objects
 *
 * @param {object} data
 * @returns {string}
 */
function pretty (data) {
  return Object.keys(data).map(key => key + ' = ' + JSON.stringify(data[key])).join(', ')
}

/**
 * Build CSS rule for token
 *
 * @param {string} type  Token type
 * @param {string[]} styles  Rules to apply
 * @returns {string}
 */
function buildStyle (type, styles) {
  return '.code--' + type + '{' + styles.join(';') + '}'
}

/**
 * Build CSS styles according to object
 *
 * @param {object} styling
 * @returns {string}
 */
function buildStyles (styling) {
  return Object.keys(styling || {})
    .map(type => buildStyle(type, styling[type]))
    .join('\n')
}

/**
 * Sanitize string to put it into HTML
 *
 * @param {string} str
 * @returns {string}
 */
const _ = function sanitize (str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Build HTML representation of token
 *
 * @param {{ type: string, code: string, data: object, position: { start: string, end: string } }} token
 * @returns {string}
 */
function buildToken (token) {
  const code = token.code
  const position = `(${token.position.start}, ${token.position.end})`
  const tooltip = `<span class="tooltip"><strong>${_(token.type)} ${position}</strong><span>${_(pretty(token.data))}</span></span>`

  return `<span class="code code--${_(token.type)}">${tooltip}${_(code)}</span>`
}

/**
 * Build HTML representation of tokens list
 *
 * @param {object[]} tokens
 * @returns {string}
 */
function buildCode (tokens) {
  return tokens.map(buildToken).join('')
}

/**
 * Build formatted HTML code for specified tokens list
 *
 * @param {object[]} tokens
 * @param {object} [styling]
 * @returns {string}
 */
function buildHTML (tokens, styling) {
  const style = buildStyles(styling)
  const code = buildCode(tokens)

  return INDEX
    .replace('$style', style)
    .replace('$code', code)
}

exports.build = buildHTML

// Set up helpers for styling

exports.style = {
  bold: 'font-weight: bold',
  color: c => 'color: ' + c,
  underline: 'text-decoration: underline'
}
