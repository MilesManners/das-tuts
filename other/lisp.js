const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

const pureEval = (rawExpr, scope = {}) => rawExpr instanceof Array
  ? pipe(
    () => rawExpr.map(symbol => typeof symbol === 'string' && symbol in scope ? scope[symbol] : symbol),
    ([fn, ...args]) => [fn instanceof Array ? pureEval(fn, scope) : fn, args],
    ([fn, args]) => fn instanceof Function
      ? fn.apply(scope, args.map((arg, i) =>
          arg instanceof Array && !fn.__specialForm__
            ? pureEval(arg, scope)
            : fn.__rawArgs__
              ? rawExpr[i + 1]
              : arg
        ))
      : [fn, ...args.map(arg => arg instanceof Array ? pureEval(arg, scope) : arg)]
    )()
  : rawExpr

const specialForm = f => {
  f.__specialForm__ = true
  return f
}

const rawArgs = f => {
  f.__rawArgs__ = true
  return f
}

const native = () => {
  const req = (n, fn) => (...args) => args.length < n ? undefined : fn(args)

  let native = {
    // Special Forms
    'fn': specialForm(function (defArgs, expr) {
      return function (...callArgs) {
        let childScope = Object.create(this)

        defArgs.forEach((argName, index) => { childScope[argName] = callArgs[index] })

        return pureEval(expr, childScope)
      }
    }),
    'do': specialForm(function (...exprs) {
      return exprs.reduce(((_, x) => pureEval(x, this)).bind(this), null)
    }),
    'if': specialForm(function (cond, succ, fail) {
      return pureEval(pureEval(cond, this) ? succ : fail, this)
    }),
    'def': rawArgs(function (name, value) {
      return this[name] = value
    }),
    'defn': specialForm(function (name, args, expr) {
      return native.def.call(this, name, native.fn.call(this, args, expr))
    }),
    'spread': specialForm(function (fn, arg) {
      return fn.call(this, ...arg)
    }),
    'set': specialForm(function (list, n, val) {
      list[n] = val
    }),
    'quote': specialForm(expr => expr),

    // Built-in
    'isFinite': isFinite,
    'isNaN': isNaN,
    'parseFloat': parseFloat,
    'parseInt': parseInt,
    'typeof': arg => typeof arg,
    
    // Comparison
    '=': req(2, args => !args.slice(1).some(x => x !== args[0])),
    '!=': req(2, args => args.slice(1).some(x => x !== args[0])),
    '<': req(2, args => !args.slice(1).some((x, i) => args[i] >= x)),
    '<=': req(2, args => !args.slice(1).some((x, i) => args[i] > x)),
    '>': req(2, args => !args.slice(1).some((x, i) => args[i] <= x)),
    '>=': req(2, args => !args.slice(1).some((x, i) => args[i] < x)),

    // Logical
    'not': req(1, ([arg]) => !arg),
    'and': req(2, args => args.slice(1).every((x, i) => x && args[i])),
    'or': req(2, args => args.slice(1).some((x, i) => x || args[i])),

    // Arithmetic
    '+': req(1, args => args.length === 1
      ? Math.abs(args[0])
      : args.reduce((a, b) => a + b)),
    '-': req(1, ([arg, ...args]) => args.length === 0
      ? -arg
      : args.reduce((a, b) => a - b, arg)),
    '*': (arg, ...args) => args.reduce((a, b) => a * b, arg),
    '/': (arg, ...args) => args.reduce((a, b) => a / b, arg),
    '^': (arg, ...args) => args.reduce((a, b) => a ** b, arg),

    // Output
    'print': (...args) => args.reduce((a, b) => a + b, ''),
    'out': req(1, args => args.length === 1 ? args[0] : args),

    // Other
    'get': (list, n) => list[n],
    'call': (f, ctx, args) => f.call(ctx, args)
  }

  let alias = {
    'eq': native['='],
    'ne': native['!='],
    'lt': native['<'],
    'le': native['<='],
    'gt': native['>'],
    'ge': native['>='],
    '!': native['not'],
    '**': native['^']
  }

  return Object.assign(native, alias)
}

const lisp = (...e) =>
  pureEval(e.length > 1
    ? e.unshift('do') && e
    : typeof e[0] === 'string'
      ? e
      : e[0], native())

module.exports = lisp
module.exports.pureEval = pureEval



lisp(
  ['do',
    ['defn', 'fib', ['n'],
      ['if', ['>', 'n', 1],
        ['+',
          ['fib', ['-', 'n', 1]],
          ['fib', ['-', 'n', 2]]],
        1]],
    ['fib', 8]]
)//?

lisp(
  ['defn', 'sliceList', ['list', 'args'],
    ['call', ['get', [], 'slice'], 'list', 'args']],

  ['defn', 'sum', ['list'],
    ['if', ['>', ['get', 'list', 'length'], 1],
      ['+',
        ['get', 'list', 0],
        ['sum', ['sliceList', 'list', 1]]],
      ['get', 'list', 0]]],

  ['def', 'list', [1, 2, 3]],
  ['sum', 'list']
)//?

lisp(
  ['defn', 'string?', ['str'],
    ['=', ['typeof', 'str'], 'string']],

  ['def', 'str', ''],
  ['string?', 'str']
)//?
