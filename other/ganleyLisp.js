// ----------------------------------------------------------- //
// JavaScript Lisp Interpreter                                 //
// by Joe Ganley, http://joeganley.com/                        //
// Copyright (C) 1997-2010 J. L. Ganley.  All rights reserved. //
// ----------------------------------------------------------- //

// some character classification functions
function isDigit (c) { return /\d+/.test(c) }
function isAlpha (c) { return /[a-zA-Z]+/.test(c) }
function isAlphaDigit (c) { return /\w+/.test(c) }
function isWhite (c) { return /\s+/.test(c) }

Array.prototype.ix = 0
Array.prototype.listP = true
Array.prototype.lambdaP = true

// symbol table
symTab = []
symTab[0] = []

const nil = 'nil'

// takes a string and returns an array of tokens
function tokenize (str) {
  let i = 0
  let ret = new Array()
  ret.ix = 0

  while (i < str.length) {
    if (str[i] === '+' || str[i] === '-') {
      if (isDigit(str[i + 1])) {
        ret[ret.length] = str[i++]
        while (i < str.length && isDigit(str[i])) {
          ret[ret.length - 1] += str[i++]
        }
      } else {
        ret[ret.length] = str[i++]
      }
    } else if (isDigit(str[i])) {
      ret[ret.length] = ""
      while (i < str.length && isDigit(str[i])) {
        ret[ret.length - 1] += str[i++]
      }
    } else if (isAlpha(str[i])) {
      ret[ret.length] = ""
      while (i < str.length && isAlphaDigit(str[i])) {
        ret[ret.length - 1] += str[i++]
      }
    } else if (isWhite(str[i])) {
      ++i
    } else {
      ret[ret.length] = str[i++]
    }
  }
  return ret
}

// look up the given symbol in the symbol table.  Start with the current
// level and work backward as necessary if the symbol is not found.
// (dynamic scoping a la Lisp, rather than Scheme)
function lookup (sym) {
  for (let i = symTab.length; i >= 0; --i) {
    let sym = symTab[i]
    if (symTab[i][sym] || symTab[i][sym] === 0) {
      return symTab[i][sym]
    }
  }

  return nil
}

// store the given symbol/value pair in the symbol table at the current level.
function store (sym, val) {
  symTab[symTab.length][sym] = val
}

// parse the array of tokens into the standard Lisp list structure
// (implemented as arrays, since they're dynamic in JS)
function parse (tok) {
  let ret
  let arg

  if (tok[tok.ix] === '(') {
    tok.ix++
    if (tok[tok.ix] === ')') {
      tok.ix++
      ret = new Array(1)
      ret[0] = null
      ret.listP = true
      ret.lambdaP = false
    } else {
      ret = new Array()
      ret.listP = true
      ret.lambdaP = false

      while ((tok.ix < tok.length) && (tok[tok.ix] !== ')')) {
        ret[ret.length] = parse(tok)
      }

      if (tok[tok.ix] === ')') {
        tok.ix++
      } else {
        alert('Missing ")"')
      }
    }
  } else if (tok[tok.ix] === '"') {
    tok.ix++
    arg = parse(tok)
    if (isNull(arg)) {
      ret = nil
    } else {
      ret = new Array(2)
      ret.listP = true
      ret.lambdaP = false
      ret[0] = 'quote'
      ret[1] = arg
    }
  } else {
    ret = tok[tok.ix++]
  }
  return ret
}

// is the given list nil in any of its guises?
function isNull (tree) {
  return !tree || tree === nil
  || (tree.listP && (tree.length === 0 || tree[0] === null))
}

const ops = {
  'quote': args =>
    args[0],
  '+': args =>
    args.reduce((a, b) => a + +eval(b), 0),
  '-': args =>
    args.length === 1
      ? -+eval(args[0])
      : args.slice(1).reduce((a, b) => a - +eval(b), +eval(args[0])),
  '*': args =>
    args.slice(1).reduce((a, b) => a * +eval(b), +eval(args[0])),
  '/': args =>
    args.slice(1).reduce((a, b) => ~~(a / +eval(b)), +eval(args[0])),
  'eq': args =>
    !args.some(x => x !== args[0]),
  '=': args =>
    ops.eq(...args),
  '<': args =>
    !args.slice(1).some((x, i) => x >= args[i - 1]),
  '<=': args =>
    !args.slice(1).some((x, i) => x > args[i - 1]),
  '>': args =>
    !args.slice(1).some((x, i) => x <= args[i - 1]),
  '>=': args =>
    !args.slice(1).some((x, i) => x < args[i - 1]),
  'and': args =>
    !args.slice(1).some((x, i) => !(x && args[i - 1])),
  'or': args =>
    !args.slice(1).some((x, i) => !(x || args[i - 1])),
  'cond': args =>
    args.some(x => {
      let arg = x[0]
      return !isNull(arg) && (x.length > 1 ? eval(x[1]) : arg)
    }),
  'car': (_, arg) => {
    return arg.listP && arg.length !== 0 ? arg[0] : nil
  },
  'cdr': (_, arg) => {
    if (arg.listP && arg.length > 1) {
      let out = [...arg].slice(1)
      out.listP = true
      out.lambdaP = false
      return out
    } else {
      return nil
    }
  },
  'cons': (args, arg) => {
    if (isNull(arg)) {
      arg = nil
    }

    let arg2 = eval(args[1])

    if (isNull(arg2)) {
      arg2 = []
      arg2.listP = true
      arg2.lambdaP = false
    }

    if (arg2.listP) {
      let out = [arg, ...arg2]
      out.listP = true
      out.lambdaP = false
      return out
    } else {
      return nil
    }
  }
}

// evaluate the given list
function eval (tree) {
  let [op, ...args] = tree

  if (isNull(tree)) {
    return nil
  } else if (tree.listP) {
    if (op in ops) {
      ops[op](args, eval(args[0]))
    }

    if (tree[0] == "cons") {
      let arg = eval(args[0])

      if (isNull(arg)) {
        arg = nil
      }

      arg2 = eval(tree[2])

      if (isNull(arg2)) {
        arg2 = new Array()
        arg2.listP = true
        arg2.lambdaP = false
      }

      if (arg2.listP) {
        ret = new Array(arg2.length + 1)
        ret.listP = true
        ret.lambdaP = false
        for (i = 0; i < arg2.length; ++i) {
          ret[i + 1] = arg2[i]
        }
        ret[0] = arg
      } else {
        return nil
      }
    } else if (tree[0] == "atom") {
      let arg = eval(args[0])
      return arg.listP && !isNull(arg) ? nil : 't'
    } else if (tree[0] == "list") {
      let out = []
      out.listP = true
      out.lambdaP = false
      for (i = 1; i < tree.length; ++i) {
        out[out.length] = eval(tree[i])
      }
      return out
    } else if (tree[0] == "set") {
      let arg = eval(tree[1])

      if ((arg.toString() == nil) || (!isAlpha(arg[0]))) {
        alert('Invalid first operand to set: ' + arg)
        return nil
      } else {
        arg2 = eval(tree[2])
        store(arg, arg2)
        return arg2
      }
    } else if (op === 'eval') {
      return eval(eval(tree[1]))
    } else if (op === 'define') {
      if (args[0] === nil || !isAlpha(args[0][0])) {
        alert('Invalid first operand to define: ' + args[0])
        return nil
      }

      let out = new Array()
      out.listP = true
      out.lambdaP = true
      for (i = 2; i < tree.length; i++) {
        out[i - 2] = tree[i]
      }
      symTab[0][arg] = out
      
      return out
    } else if (op === 'λ') {
      let out = []
      out.listP = true
      out.lambdaP = true
      for (i = 1; i < tree.length; i++) {
        out[i - 1] = tree[i]
      }
      return out
    } else if (op === 'alert') {
      let out = eval(args[0])
      alert(out)
      return out
    } else {
      // if we get here, then it's either a function call or an error
      let arg = eval(tree[0])

      if (arg && arg.listP && arg.lambdaP) {
        formals = [arg[0].length]
        for (i = 0; i < arg[0].length; ++i) {
          formals[i] = eval(tree[i + 1])
        }

        symTab.push([])

        for (i = 0; i < arg[0].length; ++i) {
          store(arg[0][i], formals[i])
        }

        for (i = 1; i < arg.length; ++i) {
          return eval(arg[i])
        }
      } else {
        alert("Invalid function call: " + print(tree[0]))
        return nil
      }
    }
  } else { // it's an atom
    return isAlpha(tree[0])
    ? tree === 't'
      ? 't'
      : isNull(tree)
        ? nil
        : lookup(tree)
    : tree
  }
}

// translate the list expression back into printable form
function print (sexpr) {
  let i
  let ret

  if (sexpr || sexpr == 0) {
    if (sexpr.listP) {
      if (sexpr.length === 0) {
        ret = nil
      } else if (sexpr.lambdaP) {
        ret = '(λ '
      } else {
        ret = '('
      }

      ret += print(sexpr[0])

      for (let expr of sexpr) {
        ret += ' ' + print(expr)
      }

      ret += ')'
    } else {
      ret = '' + sexpr
    }
  } else {
    ret = ''
  }

  return ret
}

// the main interpreter driver
function interp (str) {
  return print(eval(parse(tokenize(str))))
}

function composites () {
  interp("(define len (s) (cond ((null s) 0) (t (+ 1 (len (cdr s))))))")//?
  interp("(define flatten (s) (cond ((null s) nil) ((atom (car s)) (cons (car s) (flatten (cdr s)))) (t (append (flatten (car s)) (flatten (cdr s))))))")//?
  // Portions copyright (c) 1988, 1990 Roger Rohrbach
  interp("(define cadr (e) (car (cdr e)))")//?
  interp("(define cddr (e) (cdr (cdr e)))")//?
  interp("(define caar (e) (car (car e)))")//?
  interp("(define cdar (e) (cdr (car e)))")//?
  interp("(define cadar (e) (car (cdr (car e))))")//?
  interp("(define caddr (e) (car (cdr (cdr e))))")//?
  interp("(define cddar (e) (cdr (cdr (car e))))")//?
  interp("(define cdadr (e) (cdr (car (cdr e))))")//?
  interp("(define null (e) (eq e nil))")//?
  interp("(define not (e) (eq e nil))")//?
  interp("(define equal (x y) (or (and (atom x) (atom y) (eq x y)) (and (not (atom x)) (not (atom y)) (equal (car x) (car y)) (equal (cdr x) (cdr y)))))")//?
  interp("(define append (x y) (cond ((null x) y) (t (cons (car x) (append (cdr x) y)))))")//?
  interp("(define member (x y) (and (not (null y)) (or (equal x (car y)) (member x (cdr y)))))")//?
  interp("(define last (e) (cond ((atom e) nil) ((null (cdr e)) (car e)) (t (last (cdr e)))))")//?
  interp("(define reverse (x) (qreverse x nil))")//?
  interp("(define qreverse (x y) (cond ((null x) y) (t (qreverse (cdr x) (cons (car x) y)))))")//?
  interp("(define remove (e l) (cond ((null l) nil) ((equal e (car l)) (remove e (cdr l))) (t (cons (car l) (remove e (cdr l))))))")//?
  interp("(define mapcar (f l) (cond ((null l) nil) (t (cons (eval (list f (list 'quote (car l)))) (mapcar f (cdr l))))))")//?
  interp("(define apply (f args) (cond ((null args) nil) (t (eval (cons f args)))))")//?
}

composites()