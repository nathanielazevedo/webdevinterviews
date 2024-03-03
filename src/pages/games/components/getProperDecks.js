import trueOrFalseStructuredDecks from '../trueOrFalse/data/structured.json'
import trueOrFalseRandomDecks from '../trueOrFalse/data/random.json'
import willItThrowSturcturedDecks from '../willItThrow/data/structured.json'
import willItThrowRandomDecks from '../willItThrow/data/random.json'

const getProperDecks = (gameName, random) => {
  if (gameName == 'true-or-false') {
    if (random) return trueOrFalseRandomDecks
    else return trueOrFalseStructuredDecks
  } else if (gameName == 'will-it-throw') {
    if (random) return willItThrowRandomDecks
    else return willItThrowSturcturedDecks
  }
}

export default getProperDecks
