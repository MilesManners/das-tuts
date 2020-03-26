const lisp = require('../lisp')

describe('Basics', () => {
  it('funcs and args are the same as JS', () => {
    expect(lisp([parseInt, '4.41'])).toBe(4)

    expect(lisp([isNaN, 103])).toBe(false)

    const sum = (...args) => args.reduce((a, b) => a + b, 0)
    expect(lisp([sum, 2, 3])).toBe(5)
  })

  it('nesting', () => {
    const sum = (...args) => args.reduce((a, b) => a + b, 0)
    expect(lisp([sum, [sum, 1, 2], [sum, 3, 4]])).toBe(10)
  })

  it('scope', () => {
    expect(lisp(
      ['defn', 'test', [],
        ['def', 'x', 1]],
      ['test'],
      ['if', ['=', 'x', 1],
        ['print', 'dirty'],
        ['print', 'clean']]
    )).toBe('clean')
  })
})

describe('Output', () => {
  it('print', () => {
    expect(lisp(['print'])).toBe('')
    expect(lisp(['print', 'hello'])).toBe('hello')
    expect(lisp(['print', 'hello', ' ', 'world'])).toBe('hello world')
  })
  
  it('print', () => {
    expect(lisp(['out'])).toBeUndefined()
    expect(lisp(['out', true])).toBe(true)
    expect(lisp(['out', 1, 2])).toEqual([1, 2])
  })
})

describe('Special Forms', () => {
  it('def', () => {
    expect(lisp(['def', 'a', true])).toBe(true)
    expect(lisp(['def', 'list', [1, 2, 3]])).toEqual([1, 2, 3])
  })

  it('do', () => {
    expect(lisp(
      ['do',
        ['def', 'a', 2],
        ['out', 'a']]
    )).toBe(2)
  })

  it('fn', () => {
    expect(lisp(
      ['def', 'shout',
        ['fn', ['planet', 'greeting'],
          ['print', 'greeting', ' ', 'planet']]],
      ['shout', 'world', 'hello']
    )).toBe('hello world')
  })

  it('defn', () => {
    expect(lisp(
      ['defn', 'greeting', ['name'],
        ['print', 'Hello, ', 'name']],
      ['greeting', 'Dan']
    )).toBe('Hello, Dan')
  })

  it('if', () => {
    expect(lisp(
      ['if', true, true, false]
    )).toBe(true)

    expect(lisp(
      ['if', false, true, false]
    )).toBe(false)
  })

  it('spread', () => {
    expect(lisp(
      ['defn', 'sum', ['a', 'b', 'c'],
        ['+', 'a', 'b', 'c']],
      ['def', 'list', [1, 2, 3]],
      ['spread', 'sum', 'list']
    )).toBe(6)
  })
})

describe('Built-in', () => {
  it('isFinite', () => {
    expect(lisp(['isFinite', 0])).toBe(true)
    expect(lisp(['isFinite', Infinity])).toBe(false)
  })

  it('isNaN', () => {
    expect(lisp(['isNaN', NaN])).toBe(true)
    expect(lisp(['isNaN', 0])).toBe(false)
  })

  it('parseInt', () => {
    expect(lisp(['parseFloat', '4.21'])).toBe(4.21)
  })

  it('parseInt', () => {
    expect(lisp(['parseInt', 4.21])).toBe(4)
  })
})

describe('Comparison', () => {
  it('=', () => {
    expect(lisp(['='])).toBeUndefined()
    expect(lisp(['=', 0])).toBeUndefined()
    expect(lisp(['=', true, true])).toBe(true)
    expect(lisp(['=', true, false])).toBe(false)
  })

  it('!=', () => {
    expect(lisp(['!='])).toBeUndefined()
    expect(lisp(['!=', 0])).toBeUndefined()
    expect(lisp(['!=', true, true])).toBe(false)
    expect(lisp(['!=', true, false])).toBe(true)
  })

  it('<', () => {
    expect(lisp(['<'])).toBeUndefined()
    expect(lisp(['<', 0])).toBeUndefined()
    expect(lisp(['<', 1, 0])).toBe(false)
    expect(lisp(['<', 1, 1])).toBe(false)
    expect(lisp(['<', 0, 1])).toBe(true)
  })

  it('<=', () => {
    expect(lisp(['<='])).toBeUndefined()
    expect(lisp(['<=', 0])).toBeUndefined()
    expect(lisp(['<=', 1, 0])).toBe(false)
    expect(lisp(['<=', 1, 1])).toBe(true)
    expect(lisp(['<=', 0, 1])).toBe(true)
  })

  it('>', () => {
    expect(lisp(['>'])).toBeUndefined()
    expect(lisp(['>', 0])).toBeUndefined()
    expect(lisp(['>', 1, 0])).toBe(true)
    expect(lisp(['>', 1, 1])).toBe(false)
    expect(lisp(['>', 0, 1])).toBe(false)
  })

  it('>=', () => {
    expect(lisp(['>='])).toBeUndefined()
    expect(lisp(['>=', 0])).toBeUndefined()
    expect(lisp(['>=', 1, 0])).toBe(true)
    expect(lisp(['>=', 1, 1])).toBe(true)
    expect(lisp(['>=', 0, 1])).toBe(false)
  })
})

describe('Binary', () => {
  it('not', () => {
    expect(lisp(['not'])).toBeUndefined()
    expect(lisp(['not', true])).toBe(false)
    expect(lisp(['not', ['not', true]])).toBe(true)
  })

  it('and', () => {
    expect(lisp(['and'])).toBeUndefined()
    expect(lisp(['and', true])).toBeUndefined()
    expect(lisp(['and', true, true])).toBe(true)
    expect(lisp(['and', true, false])).toBe(false)
    expect(lisp(['and', false, false])).toBe(false)
  })

  it('or', () => {
    expect(lisp(['or'])).toBeUndefined()
    expect(lisp(['or', true])).toBeUndefined()
    expect(lisp(['or', true, true])).toBe(true)
    expect(lisp(['or', true, false])).toBe(true)
    expect(lisp(['or', false, false])).toBe(false)
  })
})

describe('Arithmetic', () => {
  it('+', () => {
    expect(lisp(['+'])).toBeUndefined()
    expect(lisp(['+', -1])).toBe(1)
    expect(lisp(['+', 1, 2])).toBe(3)

    expect(lisp(['+', '1', '2'])).toBe('12')
  })

  it('-', () => {
    expect(lisp(['-'])).toBeUndefined()
    expect(lisp(['-', 1])).toBe(-1)
    expect(lisp(['-', 2, 1])).toBe(1)
  })
  
  it('*', () => {
    expect(lisp(['*'])).toBeUndefined()
    expect(lisp(['*', 2])).toBe(2)
    expect(lisp(['*', 2, 2])).toBe(4)
  })

  it('/', () => {
    expect(lisp(['/'])).toBeUndefined()
    expect(lisp(['/', 2])).toBe(2)
    expect(lisp(['/', 4, 2])).toBe(2)
  })

  it('**', () => {
    expect(lisp(['**'])).toBeUndefined()
    expect(lisp(['**', 2])).toBe(2)
    expect(lisp(['**', 2, 3])).toBe(8)
  })
})

describe('other', () => {
  it('get', () => {
    expect(lisp(['get', [1, 2, 3], 1])).toBe(2)
    expect(lisp(['get', [], 'slice'])).toBe([].slice)
  })

  it('call', () => {
    // expect(lisp(
    //   ['do',
    //     ['defn', 'printStr', ['str'], ['print', 'str']],
    //     ['call', 'printStr', '', ['hello']]]
    // )).toBe('hello')

    expect(lisp(
      ['defn', 'sliceList', ['list', 'args'],
        ['call', ['get', [], 'slice'], 'list', 'args']],

      ['def', 'list', [1, 2, 3]],
      ['sliceList', 'list', 1]
    )).toEqual([2, 3])
  })
})

describe('alias', () => {
  it('general', () => {
    expect(lisp(['=', '!', 'not'])).toBe(true)
    expect(lisp(['=', '^', '**'])).toBe(true)
  })
})
