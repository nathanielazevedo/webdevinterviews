/* eslint-disable operator-linebreak */
const checkCodeDifferences = (serverFiles, localFiles) => {
  const serverKeys = Object.keys(serverFiles)
  const localKeys = Object.keys(localFiles)
  const diffKeys = []

  serverKeys.forEach((key) => {
    if (serverFiles[key]?.code !== localFiles?.[key]?.code) {
      diffKeys.push(key)
    }
  })

  localKeys.forEach((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (
      !serverFiles.hasOwnProperty(key) &&
      localFiles[key]?.code !== '.emptyDir'
    ) {
      diffKeys.push(key)
    }
  })

  return diffKeys
}

const mergeFiles = (workout) => {
  const local =
    JSON.parse(localStorage.getItem(workout.id)) || workout.dynamoData.template
  const shared =
    JSON.parse(localStorage.getItem(`${workout.id}-shared`)) ||
    workout.dynamoData.shared
  const packageJson =
    JSON.parse(localStorage.getItem(`${workout.id}-package.json`)) ||
    workout.dynamoData.packageJson

  return { ...local, ...shared, ...packageJson }
}

const separateFiles = (files) => {
  const sharedFiles = {}
  const otherFiles = {}
  const packageJson = {}

  Object.keys(files).forEach((key) => {
    if (key.startsWith('/shared')) {
      sharedFiles[key] = files[key]
    } else if (key.startsWith('/package.json')) {
      packageJson[key] = files[key]
    } else {
      otherFiles[key] = files[key]
    }
  })
  return { sharedFiles, otherFiles, packageJson }
}

export { checkCodeDifferences, mergeFiles, separateFiles }
