module.exports = function (wallaby) {
  return {
    files: [
      'lib/**/*.js',
      { pattern: 'tests/utils.js', instrument: false }
    ],
    tests: [
      'tests/**/*Spec.js'
    ],

    env: {
      type: 'node'
    },

    testFramework: 'mocha'
  }
}
