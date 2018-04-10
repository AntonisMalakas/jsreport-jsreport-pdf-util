let value = 0

module.exports = {
  increment: () => value++,
  get: () => value,
  reset: () => value = 0,
  setValue: (valToSet) => value = valToSet,
}