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
    if (
      !serverFiles.hasOwnProperty(key) &&
      localFiles[key]?.code !== '.emptyDir'
    ) {
      diffKeys.push(key)
    }
  })

  return diffKeys
}

const mergeFiles = (workout, isSolution, setFromLocal) => {
  let local
  if (isSolution) {
    setFromLocal(false)
    local = workout.solution
  } else {
    if (JSON.parse(localStorage.getItem(`${workout.id}`))) {
      setFromLocal(true)
      local = JSON.parse(localStorage.getItem(`${workout.id}`))
    } else {
      local = workout.template
    }
  }
  const shared = workout.shared
  const packageJson = workout.package
  return { ...local, ...shared, ...packageJson }
}

const mergeFilesAsOwner = (workout, isSolution) => {
  let local
  if (isSolution) {
    local =
      JSON.parse(localStorage.getItem(`${workout.id}-solution`)) ??
      workout.solution
  } else {
    local =
      JSON.parse(localStorage.getItem(`${workout.id}`)) ?? workout.template
  }
  const shared =
    JSON.parse(localStorage.getItem(`${workout.id}-shared`)) ?? workout.shared
  const packageJson =
    JSON.parse(localStorage.getItem(`${workout.id}-package.json`)) ??
    workout.packageJson

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

const getChangedCode = (changedFiles, files) => {
  const sharedFiles = {}
  const otherFiles = {}
  const packageJson = {}
  changedFiles.forEach((key) => {
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

export {
  checkCodeDifferences,
  mergeFiles,
  separateFiles,
  mergeFilesAsOwner,
  getChangedCode,
}
