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

const simple = {
  bool: true,
  str: "stuff",
  obj: {
    bool: false,
    str: "things",
    nested: {
      num: 4
    }
  }
}

const simpleJson = deepStringify(simple)
parsed = deepParse(simpleJson)

const files = [
  require('./modules/auth')
]

files//?

const json = deepStringify(files[0])
