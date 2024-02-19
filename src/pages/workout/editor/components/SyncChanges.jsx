import { Button } from '@mui/material'
import { useSandpack } from '@codesandbox/sandpack-react'
import { useContext, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { WorkoutContext } from '../../../../contexts/WorkoutContext'
import { AuthContext } from '../../../AuthContext'
import { separateFiles } from '../utils'
import { useNavigate } from 'react-router'

const SyncChanges = ({ changedFiles, isSolution }) => {
  const [loading, setLoading] = useState(false)
  const { sandpack } = useSandpack()
  const { workout, setData } = useContext(WorkoutContext)
  const { API } = useContext(AuthContext)
  const navigate = useNavigate()

  const onSubmit = async () => {
    const { sharedFiles, otherFiles, packageJson } = separateFiles(
      sandpack.files
    )
    setLoading(true)
    try {
      if (isSolution) {
        await API.put(
          `/workouts/${workout.id}/upload-solution`,
          JSON.stringify(otherFiles)
        )
      } else {
        await API.put(
          `/workouts/${workout.id}/upload-template`,
          JSON.stringify(otherFiles)
        )
      }
      if (sharedFiles) {
        await API.put(
          `/workouts/${workout.id}/upload-shared`,
          JSON.stringify(sharedFiles)
        )
      }
      if (changedFiles.indexOf('/package.json')) {
        await API.put(
          `/workouts/${workout.id}/upload-package`,
          JSON.stringify(packageJson)
        )
      }
      localStorage.removeItem(workout.id)
      localStorage.removeItem(workout.id + '-shared')
      localStorage.removeItem(workout.id + '-package.json')
      setTimeout(() => {
        navigate(`/workouts`)
      }, 1000)
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
