import { Button } from '@mui/material'
import { useSandpack } from '@codesandbox/sandpack-react'
import { useContext, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { WorkoutContext } from '../../../../contexts/WorkoutContext'
import { getChangedCode } from '../utils'
import useApi from '../../../../hooks/useApi'

const SyncChanges = ({ changedFiles, isSolution }) => {
  const { putIt } = useApi()
  const { sandpack } = useSandpack()
  const [loading, setLoading] = useState(false)
  const { workout } = useContext(WorkoutContext)

  const onSubmit = async () => {
    const { sharedFiles, otherFiles, packageJson } = getChangedCode(
      changedFiles,
      sandpack.files
    )

    setLoading(true)

    try {
      if (Object.keys(otherFiles).length > 0) {
        if (isSolution) {
          console.log('solution')
          await putIt(`/workouts/${workout.id}/upload-solution`, otherFiles)
        } else {
          console.log('template')
          await putIt(`/workouts/${workout.id}/upload-template`, otherFiles)
        }
      }
      if (Object.keys(sharedFiles).length > 0) {
        console.log('shared')
        await putIt(`/workouts/${workout.id}/upload-shared`, sharedFiles)
      }
      if (Object.keys(packageJson).length > 0) {
        console.log('package')
        await putIt(`/workouts/${workout.id}/upload-package`, packageJson)
      }
      // localStorage.removeItem(workout.id)
      // localStorage.removeItem(workout.id + '-shared')
      // localStorage.removeItem(workout.id + '-package.json')
      setLoading(false)
      // setTimeout(() => {
      //   navigate(`/workouts/${workout.id}`)
      // }, 1000)
      // window.location.reload()
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <Button
      variant='contained'
      onClick={() => onSubmit()}
      size='small'
      fullWidth
      sx={{ mt: 1 }}
      disabled={changedFiles?.length === 0 || loading}
    >
      {loading ? (
        <CircularProgress
          size={24}
          sx={{
            color: 'primary.main',
          }}
        />
      ) : (
        'Upload'
      )}
    </Button>
  )
}

export default SyncChanges
