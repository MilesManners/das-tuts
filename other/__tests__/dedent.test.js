const dedent = require('../dedent')

describe('dedent', () => {
  test('empty string', () => {
    const output = dedent('')
    expect(output).toMatchSnapshot()
  })

  test('no indent', () => {
    const output = dedent(`
test string without indentation
that wraps
onto multiple
lines to test`)
    expect(output).toMatchSnapshot()
  })

  test('has indent', () => {
    const output = dedent(`
            A string that gets so long you need to break it over
            multiple lines. Luckily dedent is here to keep it
            readable without lots of spaces ending up in the string
            itself.`).trim()
    expect(output).toMatchSnapshot()
  })

  test('varying indent', () => {
    const output = dedent(`
      Leading and trailing lines will be trimmed, so you can write something like
      this and have it work as you expect:
    
        * how convenient it is
        * that I can use an indented list
            - and still have it do the right thing
    
      That's all.
    `).trim()
    expect(output).toMatchSnapshot()
  })
})