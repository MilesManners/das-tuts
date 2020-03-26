module.exports = f => (
  (g => g(g))(
    g => a => (...b) => (
      a => a.length < f.length ? g(g)(a) : f(...a)
    )(a.concat(b))
  )
)([])