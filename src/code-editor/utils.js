export const getLocalStorage = (challenge) => {
  const storedFiles = localStorage.getItem(challenge.name)
  const whichFile = storedFiles ? JSON.parse(storedFiles) : challenge.template
  return whichFile
}

export const setLocalStorage = (challenge, files) => {
  localStorage.setItem(challenge.name, JSON.stringify(files))
}
