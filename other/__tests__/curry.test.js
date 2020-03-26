const curry = require('../curry')

describe('curry', () => {
  test('fully chains', () => {
    const add = curry((a, b, c) => a + b + c)
    expect(add(2)(2)(2)).toBe(6)
  })

  test('partial application', () => {
    const add = curry((a, b, c) => a + b + c)
    const add2 = add(2)
    expect(add2(2)(2)).toBe(6)
  })

  test('partial application can be reused', () => {
    const add = curry((a, b, c) => a + b + c)
    const add2 = add(2)
    expect(add2(2)(2)).toBe(6)
    expect(add2(2)(3)).toBe(7)
  })

  test('multiple arguments', () => {
    const times = curry((a, b, c) => a * b * c)

    expect(times(2, 3, 4)).toBe(24)
    expect(times(2)(3, 4)).toBe(24)
    expect(times(2, 3)(4)).toBe(24)
    expect(times(2)(3)(4)).toBe(24)
  })
})