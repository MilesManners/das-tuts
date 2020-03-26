const fromEntries = e => [...e].reduce((o, [k, v]) => (o[k] = v, o), {})

const arr = [
  ['a', 1],
  ['b', 2],
  ['c', 3]
]

fromEntries(arr)

const path = require('path').join(__dirname, 'modules')
const fs = require('fs')

let files = fs
  .readdirSync(path)
  .filter(f => f !== 'mutationTypes.js')
  .map(file => [
    file.replace(/(\.\/|\.js)/g, ''),
    require(`./modules/${file}`).default
  ])

fromEntries(files)//?

module.exports = fromEntries
