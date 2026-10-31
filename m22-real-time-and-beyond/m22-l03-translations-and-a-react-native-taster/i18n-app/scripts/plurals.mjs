for (const lng of ['en', 'de', 'hi', 'ar']) {
  const rules = new Intl.PluralRules(lng)
  console.log(lng, [0, 1, 2, 3, 11, 100].map((n) => `${n}:${rules.select(n)}`).join(' '))
}
