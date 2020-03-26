const curry = require('./curry')

const objects = [{ id: 1 }, { id: 2 }, { id: 3 }]
objects.map(o => o.id)//?

const get = curry((prop, obj) => obj[prop])
objects.map(get('id'))//?

const map = curry((fn, val) => val.map(fn))
const getIDs = map(get('id'))
const getVals = prop => map(get(prop))
getVals('id')(objects)//?

const fetchFromServer = async () => `{
  "user": "hughfdjackson",
  "posts": [
      { "title": "why curry?", "contents": "..." },
      { "title": "prototypes: the short(est possible) story", "contents": "..." }
  ]
}`
fetchFromServer()
  .then(JSON.parse)
  .then(data => data.posts)
  .then(posts => posts.map(post => post.title))//?
fetchFromServer()
  .then(JSON.parse)
  .then(get('posts'))
  .then(getVals('title'))//?

const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x)

const mult = a => b => a * b
let list = [...Array(10)]
  .map(Math.random)
  .map(mult(100))
  .map(Math.trunc)
  .sort((a, b) => a - b)//?

const recurse = fn => (
  (f => f(f))(fn)
)

const curry2 = f => recurse(
  g => a =>
    (...b) => {
      a = a.concat(b)
      return a.length < f.length ? g(g)(a) : f(...a)
    }
)([])

curry((a, b, c) => a + b + c)(2)(2)(2)//?
curry2((a, b, c) => a + b + c)(2)(2)(2)//?

let summation = list => recurse(
  f => (list, a) =>
    list.shift() + (list.length && f(f)(list, a))
)(list, 0)

list//?
list.reduce((a, b) => a + b, 0)//?
summation(list)//?
