module.exports = s =>
  (m => m
    ? s.replace(new RegExp(`^[ \\t]{${Math.min(...m.map(x => x.length))}}`, 'gm'), '')
    : s
  )(s.match(/^[ \t]*(?=\S)/gm))