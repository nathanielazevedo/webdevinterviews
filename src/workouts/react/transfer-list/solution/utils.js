const intersection = (a, b) => {
  return a.filter((value) => b.indexOf(value) !== -1)
}

const not = (a, b) => {
  return a.filter((value) => b.indexOf(value) === -1)
}

export { not, intersection }
