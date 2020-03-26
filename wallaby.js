module.exports = wallaby => ({
  files: [
    '*/**/*.js',
    '!*/**/__tests__/*.js',
    '!node_modules'
  ],
  tests: [
    '*/**/__tests__/*.test.js',
    '!node_modules'
  ],

  env: {
    type: 'node',
    runner: 'node'
  },

  testFramework: 'jest',

  debug: true
})