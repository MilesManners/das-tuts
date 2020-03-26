const I = x => x
const K = k => _ => k

const T = K
const F = K(I)

const NOT = chooseOne => chooseOne(F)(T)

const IF = Condition => Then => Else => Condition(Then)(Else)

const AND = a => b => a(b)(F)
const OR = a => b => a(T)(b)

const B = f => g => x => f(g(x))
const B1 = B(B)(B)

const BOOL_EQ = a => b => a(b(T)(F))(b(F)(T))

const PAIR = a => b => f => f(a)(b)
const P1 = pair => pair(T)
const P2 = pair => pair(F)

const n0 = _ => x => x

const ADD1 = num => fn => x => fn(num(fn)(x))
const ADD = a => b => a(ADD1)(b)
const MULT = B
const POW = a => b => b(a)

const Φ = old => PAIR(P2(old))(ADD1(P2(old)))

const PRED = n => P1(n(Φ)(PAIR(n0)(n0)))

const SUB = a => b => b(PRED)(a)

const IS0 = num => num(K(F))(T)
const LEQ = a => b => IS0(SUB(a)(b))
const EQ = a => b => AND(LEQ(a)(b))(LEQ(b)(a))
const GT = B1(NOT)(LEQ)

const n1 = ADD1(n0)
const n2 = ADD1(n1)
const n3 = ADD1(n2)
const n4 = ADD1(n3)
const n5 = ADD1(n4)
const n6 = ADD1(n5)
const n7 = ADD1(n6)

const λ = 'λ'
const yell = str => str + '!'
const church = n => n === 0 ? n0 : ADD1(church(n - 1))
const jsnum = c => c(x => x + 1)(0)

const FIB =
  n => n(
    f =>
    a =>
    b => f(b)((
      a =>
      b => a(
        num =>
        fn =>
        x => fn(num(fn)(x))
      )(b)
    )(a)(b))
  )
  (k => _ => k)
  (_ => x => x)
  (
    (num => fn => x => fn(num(fn)(x)))
    (_ => x => x)
  )

jsnum(FIB(n0))//?
jsnum(FIB(n1))//?
jsnum(FIB(n2))//?
jsnum(FIB(n3))//?
jsnum(FIB(n4))//?
jsnum(FIB(n5))//?
jsnum(FIB(n6))//?
jsnum(FIB(n7))//?
