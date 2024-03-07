import trueOrFalseStructuredDecks from '../trueOrFalse/data/structured.json'
import trueOrFalseRandomDecks from '../trueOrFalse/data/random.json'
import willItThrowSturcturedDecks from '../willItThrow/data/structured.json'
import willItThrowRandomDecks from '../willItThrow/data/random.json'
import cccRandomDecks from '../ccc/data/random.json'
import mutateRandom from '../mutate/data/random.json'
import returnsRandom from '../returns/data/random.json'

const getProperDecks = (gameName, random) => {
  if (gameName == 'true-or-false') {
    if (random) return trueOrFalseRandomDecks
    else return trueOrFalseStructuredDecks
  } else if (gameName == 'will-it-throw') {
    if (random) return willItThrowRandomDecks
    else return willItThrowSturcturedDecks
  } else if (gameName == 'ccc') {
    if (random) return cccRandomDecks
  } else if (gameName == 'mutate') {
    if (random) return mutateRandom
  } else if (gameName == 'returns') {
    if (random) return returnsRandom
  }
}

export default getProperDecks
