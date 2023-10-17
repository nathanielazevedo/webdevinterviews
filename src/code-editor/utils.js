export const generateLocalStorageKey = (challenge, showDemo) => {
  const tag = showDemo ? '-demo' : '-challenge'
  return challenge.name + tag
}

export const getLocalStorage = (challenge, showDemo) => {
  // console.log('getLocalStorage', challenge, showDemo)
  // when show demo is true it will return false - bug
  const key = generateLocalStorageKey(challenge, showDemo)
  const storedFiles = localStorage.getItem(key)
  // console.log('storedFiles', storedFiles)
  // console.log('key', key)
  const whichFile = storedFiles
    ? JSON.parse(storedFiles)
    : showDemo && challenge.demo
    ? challenge.demo
    : challenge.template
    ? challenge.template
    : undefined
  // console.log('whichFile', whichFile)
  return whichFile
}

export const setLocalStorage = (challenge, showDemo, files) => {
  const key = generateLocalStorageKey(challenge, showDemo)
  localStorage.setItem(key, JSON.stringify(files))
}

// const getFiles = (challenge, showDemo) => {
//   // hmm
// }
