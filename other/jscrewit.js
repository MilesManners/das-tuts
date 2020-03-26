const jscrewit = require('jscrewit')

let input = `
const deepStringify = obj => {
  for (k in obj) {
    if (typeof obj[k] === 'object') {
      obj[k] = deepStringify(obj[k])
    }
  }

  return JSON.stringify(obj)
}

const deepParse = json => {
  const obj = JSON.parse(json)

  for (k in obj) {
    if (typeof obj[k] === 'string') {
      try {
        obj[k] = deepParse(obj[k])
      } catch {}
    }
  }

  return obj
}
`

let output = jscrewit.encode(input)

output
output.length//?
eval(output)//?